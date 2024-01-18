let shouldAnimate = false;
let textureElement;
let cW, cH, cD;

// Use dimensions as used for texture element background image
const textureWidth = 128;
const textureHeight = 128;
let textureImage;

function preload() {
    // Load the texture image used by the texture element for saveCanvas
    textureImage = loadImage('./assets/texture.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // frameRate(30);

    p5grain.setup();

    // Prepare reusable vars for drawing artwork
    cW = width/2;
    cH = height/2; 
    cD = min(width, height)/2;

    textureElement = document.querySelector('#texture');

    if (!shouldAnimate) noLoop();
}

function draw() {
    // Simulate drawing artwork
    drawArtwork();

    // Animate texture element
    if (shouldAnimate) {
        textureAnimate(textureElement);
    }
}

function drawArtwork() {
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(cW, cH, cD);
    textSize(28);
    text('click to toggle animation', 14, 36);
}

function windowResized() {
    setup();
    if (!shouldAnimate) redraw();
}

function mousePressed() {
    shouldAnimate = ! shouldAnimate;
    shouldAnimate ? loop() : noLoop();
}

function keyPressed() {
    // Press [S] to save frame
    if (keyCode === 83) {
        /**
         * Since the texture element would be missing from the export because 
         * it's an element outside the canvas, we are temporarily drawing the
         * texture image onto the canvas and then saving the output.
         */
        textureOverlay(textureImage, {
            width: textureWidth,
            height: textureHeight,
        });
        saveCanvas('export.png');
        // Redraw over temporary texture overlay
        if (!shouldAnimate) redraw();
    }
}
