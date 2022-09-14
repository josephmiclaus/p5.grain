const shouldAnimate = true;
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
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(cW, cH, cD);

    // Blend over texture image
    textureOverlay(textureImage, {
        width: tW,
        height: tH,
        animate: shouldAnimate,
    });
}

function windowResized() {
    setup();
    if (!shouldAnimate) redraw();
}

function mousePressed() {
    noLoop();
}

function mouseReleased() {
    if (shouldAnimate) loop();
}

function keyPressed() {
    // Press [S] to save frame
    if (keyCode === 83) {
        saveCanvas('export.png');
    }
}
