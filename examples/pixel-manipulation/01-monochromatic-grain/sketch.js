function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    drawArtwork();

    // Apply monochromatic grain
    applyMonochromaticGrain(42);
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
