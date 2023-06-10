const reusableSketch = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight/2);

        p5grain.setup({ instance: sketch });

        // Simulate drawing artwork
        sketch.background(255);
        sketch.noStroke();
        sketch.fill(100, 100, 240);
        sketch.circle(sketch.width/2, sketch.height/2, sketch.min(sketch.width, sketch.height)/2);

        // Granulate artwork

        // Simple method
        sketch.granulateSimple(42);

        // Channels method
        // sketch.granulateChannels(42);

        // Custom granulateSimple implementation
        // const amount = 42;
        // const alpha = false;
        // sketch.tinkerPixels((index, total) => {
        //     const grainAmount = sketch.floor(sketch.random() * (amount * 2 + 1)) - amount;
        //     sketch.pixels[index] = sketch.pixels[index] + grainAmount;
        //     sketch.pixels[index+1] = sketch.pixels[index+1] + grainAmount;
        //     sketch.pixels[index+2] = sketch.pixels[index+2] + grainAmount;
        //     if (alpha) {
        //         sketch.pixels[index+3] = sketch.pixels[index+3] + grainAmount;
        //     }
        // });

        // Using tinkerPixels in read-only mode
        // let minAvg = 255;
        // let maxAvg = 0;
        // sketch.tinkerPixels((index, total) => {
        //     // determine min, max average pixel values
        //     const avg = sketch.round((sketch.pixels[index] + sketch.pixels[index+1] + sketch.pixels[index+2])/3);
        //     minAvg = sketch.min(minAvg, avg);
        //     maxAvg = sketch.max(maxAvg, avg);
        // }, false); // <-- shouldUpdate = false
    }

    sketch.windowResized = () => {
        sketch.setup();
    }

    // sketch.keyPressed = () => {
    //     // Press [S] to save frame
    //     if (sketch.keyCode === 83) {
    //         sketch.saveCanvas('export.png');
    //     }
    // }
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
        sketch.granulateSimple(42);

        // create a separate graphics buffer and draw a small rectangle to it
        const pg = sketch.createGraphics(140, 140);
        pg.background(250, 100, 100);

        // apply colored grain to the sketch's canvas
        pg.granulateChannels(42);

        // draw the graphics buffer to the sketch's canvas
        sketch.image(pg, sketch.width/2-70, sketch.height/2-70);
    }

    sketch.windowResized = () => {
        sketch.setup();
    }

    // sketch.keyPressed = () => {
    //     // Press [S] to save frame
    //     if (sketch.keyCode === 83) {
    //         sketch.saveCanvas('export.png');
    //     }
    // }
});

// third instance
// let myp5_3 = new p5(reusableSketch);
