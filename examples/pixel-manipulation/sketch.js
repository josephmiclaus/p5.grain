function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(width/2, height/2, min(width, height)/2);

    // Granulate artwork
    granulateSimple(42);
    // granulateChannels(42);
    // granulateFuzzify(42);
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
