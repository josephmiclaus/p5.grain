const reusableSketch = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight/2);

        p5grain.setup({ instance: sketch });

        // Simulate drawing artwork
        sketch.drawArtwork();

        // Loop over all pixels and set the red channel of each one to a random value (0-255).
        sketch.tinkerPixels((index, total) => {
            sketch.pixels[index] = sketch.random(0, 255); // red channel
            // sketch.pixels[index+1] = sketch.random(0, 255); // green channel
            // sketch.pixels[index+2] = sketch.random(0, 255); // blue channel
        });

        sketch.textSize(28);
        sketch.text('instance 1:', 14, 36);
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

        // apply colored grain to the graphics buffer
        pg.applyChromaticGrain(42);

        // draw the graphics buffer to the sketch's canvas
        sketch.image(pg, sketch.width/2-70, sketch.height/2-70);

        sketch.textSize(28);
        sketch.text('instance 2:', 14, 36);
    }

    sketch.windowResized = () => {
        sketch.setup();
    }
});

// third instance
// let myp5_3 = new p5(reusableSketch);
