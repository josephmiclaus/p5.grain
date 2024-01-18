function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    drawArtwork();

    // Use `loopPixels` to loop over pixels without changing them.
    loopPixels((index, total) => {
        // read-only mode
        // ...
    });

    // Alternatively, you can use `tinkerPixels` in read-only mode.
    tinkerPixels((index, total) => {
        // read-only mode
        // ...
    }, false); // <-- shouldUpdate = false
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
