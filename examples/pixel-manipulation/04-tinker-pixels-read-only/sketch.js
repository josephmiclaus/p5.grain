function setup() {
    createCanvas(windowWidth, windowHeight);

    p5grain.setup();

    // Simulate drawing artwork
    drawArtwork();

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
    tinkerPixels((index, total) => {
        // determine min, max average pixel values
        const avg = round((pixels[index] + pixels[index+1] + pixels[index+2])/3);
        minAvg = min(minAvg, avg);
        maxAvg = max(maxAvg, avg);
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
