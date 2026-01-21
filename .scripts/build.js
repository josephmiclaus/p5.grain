#!/usr/bin/env node

/**
 * Build script for fx.genetics
 *
 * Usage:
 *   node scripts/build.js               → builds fx.genetics.min.js
 *   node scripts/build.js --lite        → builds fx.genetics.lite.min.js (removes internals)
 *   node scripts/build.js --lite --keep → same as above but keeps fx.genetics.lite.js temp file
 */

const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

// --- Helpers --------------------------------------------------------------

const log = (msg) => console.log(`[build] ${msg}`);

const rootDir = path.resolve(__dirname, "..");
const pkg = require(path.join(rootDir, "package.json"));

const args = process.argv.slice(2);
const isLite = args.includes("--lite");
const keepTemp = args.includes("--keep");
const renameToMin = args.includes("--renameToMin");

if (renameToMin && !isLite) {
    log("⚠️  --renameToMin ignored because --lite was not specified.");
}

// Input and output setup
const mainFile = pkg.name.replace(/-/g, ".") + ".js";
const inputFile = path.resolve(rootDir, mainFile);

if (!fs.existsSync(inputFile)) {
    throw new Error(`Main file not found: ${mainFile}`);
}

const baseName = path.basename(inputFile, ".js");
const distDir = path.join(rootDir, "dist");
const tempLiteFile = path.join(rootDir, `${baseName}.lite.js`);

if (!fs.existsSync(inputFile)) {
    console.error(`[build] ERROR: main file not found at ${inputFile}`);
    process.exit(1);
}

// Ensure dist exists
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

// --- Remove internals (for lite build) -----------------------------------

function removeInternals(source) {
    // Removes everything between @internal and @end (including tags)
    return source.replace(/@internal[\s\S]*?@end/g, "@lite");
}

// --- Build function ------------------------------------------------------

const internalProps = [
    // ...
];

if (!isLite) {
    const moreInternals = [
        // ...
    ];
    internalProps.push(...moreInternals);
}

async function build() {
    let source = fs.readFileSync(inputFile, "utf8");
    let outputFile;
    let licenseTarget;
    let headerFile;
    let preamble = "";

    if (isLite) {
        log("Creating lite version (removing internals)...");
        const liteSource = removeInternals(source);
        fs.writeFileSync(tempLiteFile, liteSource);
        source = liteSource;
        outputFile = path.join(distDir, `${baseName}.lite.min.js`);
        licenseTarget = path.join(distDir, `${baseName}.lite.min.js.LICENSE.txt`);
        headerFile = path.join(__dirname, "license.lite.min.txt");
    } else {
        log("Creating minified version...");
        outputFile = path.join(distDir, `${baseName}.min.js`);
        licenseTarget = path.join(distDir, `${baseName}.min.js.LICENSE.txt`);
        headerFile = path.join(__dirname, "license.min.txt");
    }

    // Read and prepend header if exists
    if (fs.existsSync(headerFile)) {
        preamble = fs.readFileSync(headerFile, "utf8").trim();
        log(`Including header from ${path.basename(headerFile)}`);
    } else {
        log(`⚠️  Header file not found (${path.basename(headerFile)}), continuing without header.`);
    }

    // Minify using terser
    log(`Minifying ${isLite ? "lite " : ""}file...`);
    const result = await minify(source, {
        compress: true,
        mangle: {
            properties: {
                regex: new RegExp(`^(${internalProps.join("|")})$`),
                keep_quoted: true,
            },
            reserved: ["author"],
        },
        format: {
            preamble,
            comments: false,
        },
    });

    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }

    fs.writeFileSync(outputFile, result.code);
    log(`✅ Minified file written to ${outputFile}`);

    // Copy LICENSE
    const licenseSrc = path.join(rootDir, "LICENSE");
    if (fs.existsSync(licenseSrc)) {
        fs.copyFileSync(licenseSrc, licenseTarget);
        log(`📄 LICENSE copied to ${licenseTarget}`);
    } else {
        log("⚠️  LICENSE file not found, skipping copy.");
    }

    // renameToMin
    if (isLite && renameToMin) {
        const liteMinFile = path.join(distDir, `${baseName}.lite.min.js`);
        const liteLicenseFile = path.join(distDir, `${baseName}.lite.min.js.LICENSE.txt`);
        const mainMinFile = path.join(distDir, `${baseName}.min.js`);
        const mainLicenseFile = path.join(distDir, `${baseName}.min.js.LICENSE.txt`);

        if (fs.existsSync(mainMinFile)) {
            fs.unlinkSync(mainMinFile);
            log(`🗑️ Removed existing ${path.basename(mainMinFile)}`);
        }

        if (fs.existsSync(mainLicenseFile)) {
            fs.unlinkSync(mainLicenseFile);
            log(`🗑️ Removed existing ${path.basename(mainLicenseFile)}`);
        }

        if (fs.existsSync(liteMinFile)) {
            fs.renameSync(liteMinFile, mainMinFile);
            log(`🔁 Renamed ${path.basename(liteMinFile)} → ${path.basename(mainMinFile)}`);
        }

        if (fs.existsSync(liteLicenseFile)) {
            fs.renameSync(liteLicenseFile, mainLicenseFile);
            log(`🔁 Renamed ${path.basename(liteLicenseFile)} → ${path.basename(mainLicenseFile)}`);
        }
    }

    // Clean up temporary lite file (unless --keep)
    if (isLite && !keepTemp) {
        fs.unlinkSync(tempLiteFile);
        log("🧹 Temporary lite file removed.");
    } else if (isLite && keepTemp) {
        log(`📁 Temporary lite file kept: ${tempLiteFile}`);
    }

    log("✅ Build complete!");
}

// -------------------------------------------------------------------------

build().catch((err) => {
    console.error("❌ Build failed:", err);
    process.exit(1);
});
