let s1 = function( sketch ) {
    let p5grain = new P5Grain();
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

        p5grain.setup({
            random: sketch.random,
            instanceMode: true,
            instanceRef: sketch,
        });

        // Simulate drawing artwork
        sketch.background(255);
        sketch.noStroke();
        sketch.fill(100, 100, 240);
        sketch.circle(sketch.width/2, sketch.height/2, sketch.min(sketch.width, sketch.height)/2);

        // Granulate artwork

        // Simple method
        sketch.p5grain.granulateSimple(42);

        // Channels method
        // sketch.granulateChannels(42);

        // Custom granulateSimple implementation
        // const amount = 42;
        // const alpha = false;
        // sketch.tinkerPixels((index, total) => {
        //     const grainAmount = Math.floor(sketch.random() * (amount * 2 + 1)) - amount;
        //     sketch.pixels[index] = sketch.pixels[index] + grainAmount;
        //     sketch.pixels[index+1] = sketch.pixels[index+1] + grainAmount;
        //     sketch.pixels[index+2] = sketch.pixels[index+2] + grainAmount;
        //     if (alpha) {
        //         sketch.pixels[index+3] = sketch.pixels[index+3] + grainAmount;
        //     }
        // });

        // Read-only mode
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

    sketch.keyPressed = () => {
        // Press [S] to save frame
        if (keyCode === 83) {
            sketch.saveCanvas('export.png');
        }
    }

}

new p5(s1);