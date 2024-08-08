function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    drawArtwork();

    // Loop over all pixels and set the red channel of each one to a random value (0-255).
    tinkerPixels((index, total) => {
        pixels[index] = random(0, 255); // red channel
        // pixels[index+1] = random(0, 255); // green channel
        // pixels[index+2] = random(0, 255); // blue channel
    });
}

function drawArtwork() {
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(width/2, height/2, min(width, height)/2);
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
