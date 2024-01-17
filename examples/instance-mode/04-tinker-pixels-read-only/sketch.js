const reusableSketch = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight/2);

        p5grain.setup({ instance: sketch });

        // Simulate drawing artwork
        sketch.drawArtwork();

        /**
         * Using `tinkerPixels` in read-only mode
         * 
         * Pixel manipulation will not be carried out, when using read-only mode.
         * 
         * If you are not changing pixels inside the tinkerPixels callback,
         * you should pass `false` as the `shouldUpdate` argument, which
         * will skip calling the `updatePixels` function.
         */
        let minAvg = 255;
        let maxAvg = 0;
        sketch.tinkerPixels((index, total) => {
            // determine min, max average pixel values
            const avg = sketch.round((sketch.pixels[index] + sketch.pixels[index+1] + sketch.pixels[index+2])/3);
            minAvg = sketch.min(minAvg, avg);
            maxAvg = sketch.max(maxAvg, avg);
        }, false); // <-- shouldUpdate = false
    }

    sketch.drawArtwork = () => {
        sketch.background(255);
        sketch.noStroke();
        sketch.fill(100, 100, 240);
        sketch.circle(sketch.width/2, sketch.height/2, sketch.min(sketch.width, sketch.height)/2);
    }

    sketch.windowResized = () => {
        sketch.setup();
    }
};
// first instance
let myp5_1 = new p5(reusableSketch);

// second instance
let myp5_2 = new p5((sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight/2);
        sketch.background(255);
        
        // configure p5grain to be used on a specific p5.js instance
        p5grain.setup({ instance: sketch });

        // draw a circle to the sketch's canvas
        sketch.noStroke();
        sketch.fill(100, 100, 240);
        sketch.circle(sketch.width/2, sketch.height/2, sketch.min(sketch.width, sketch.height)/2);

        // apply monochromatic grain to sketch's canvas
        sketch.applyMonochromaticGrain(42);

        // create a separate graphics buffer and draw a small rectangle to it
        const pg = sketch.createGraphics(140, 140);
        pg.background(250, 100, 100);

        // apply colored grain to the sketch's canvas
        pg.applyChromaticGrain(42);

        // draw the graphics buffer to the sketch's canvas
        sketch.image(pg, sketch.width/2-70, sketch.height/2-70);
    }

    sketch.windowResized = () => {
        sketch.setup();
    }
});

// third instance
// let myp5_3 = new p5(reusableSketch);
