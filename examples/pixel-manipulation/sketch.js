function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(width/2, height/2, min(width, height)/2);

    // Granulate artwork

    // Simple method
    granulateSimple(42);

    // Channels method
    // granulateChannels(42);

    // Custom granulateSimple implementation
    // const amount = 42;
    // const alpha = false;
    // granulateCustom((index, total) => {
    //     const grainAmount = Math.floor(random() * (amount * 2 + 1)) - amount;
    //     pixels[index] = pixels[index] + grainAmount;
    //     pixels[index+1] = pixels[index+1] + grainAmount;
    //     pixels[index+2] = pixels[index+2] + grainAmount;
    //     if (alpha) {
    //         pixels[index+3] = pixels[index+3] + grainAmount;
    //     }
    // });
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
