let img;

function preload() {
    img = loadImage('./image.png');
}

function setup() {
    createCanvas(1024, 1024);

    p5grain.setup();

    // Apply chromatic grain to image
    img.applyChromaticGrain(42);

    // Draw image
    image(img, 0, 0, width, height);
}

function windowResized() {
    setup();
}

function keyPressed() {
    // Press [S] to save frame
    if (keyCode === 83) {
        saveCanvas('export.png');
    }
}
