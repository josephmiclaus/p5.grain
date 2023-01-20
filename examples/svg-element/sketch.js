const shouldAnimate = true;
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

let p5grain = new P5Grain();
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
    background(255);
    noStroke();
    fill(100, 100, 240);
    circle(cW, cH, cD);

    // Animate SVG texture element, currently unsupported!
    if (shouldAnimate) {
        p5grain.textureAnimate(textureElement);
    }
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
        /**
         * Since the texture element would be missing from the export because 
         * it is an element outside the canvas, we are temporarily drawing a 
         * similar texture image onto the canvas and then saving the output.
         */
        p5grain.textureOverlay(textureImage, {
            width: textureWidth,
            height: textureHeight,
        });
        saveCanvas('export.png');
        // Redraw over temporary texture overlay
        if (!shouldAnimate) redraw();
    }
}
