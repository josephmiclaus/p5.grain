let shouldAnimate = false;
let textureImage;
let tW, tH;
let cW, cH, cD;

function preload() {
    textureImage = loadImage('./assets/texture.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // frameRate(30);

    p5grain.setup();

    // Prepare vars for drawing artwork
    cW = width/2;
    cH = height/2; 
    cD = min(width, height)/2;
    tW = textureImage.width/2;
    tH = textureImage.height/2;

    if (!shouldAnimate) noLoop();
}

function draw() {
    // Simulate drawing artwork
    drawArtwork();

    // Blend over texture image
    textureOverlay(textureImage, {
        width: tW,
        height: tH,
        animate: shouldAnimate,
    });
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
        saveCanvas('export.png');
    }
}
