# 🌾 p5.grain
p5.grain is a [p5.js](https://github.com/processing/p5.js) addon for conveniently adding grain and texture overlays to artworks.

p5.grain was also created with [fxhash](https://www.fxhash.xyz) projects in mind that use the deterministic `fxrand` random function.

You can read more in detail about the different techniques to achieve grain in artworks in the article "[All about that grain](https://www.fxhash.xyz/article/all-about-that-grain)" by [Gorilla Sun](https://twitter.com/gorillasu) and [meezwhite](https://twitter.com/meezwhite).

## Getting started
> *Note: The following README.md is specific to the main branch and contains information about the development version of p5.grain. You might be looking for the [README.md of the latest release](https://github.com/meezwhite/p5.grain/tree/v0.6.1).*

Download the latest version from [Releases](https://github.com/meezwhite/p5.grain/releases) and embed `p5.grain.min.js` (~9.5 KB) or `p5.grain.core.js` (~3.5 KB) in your project's HTML file *after* loading p5.js but *before* loading your sketch code.

```html
<script src="./lib/p5.min.js"></script>
<!-- insert after p5.js -->
<script src="./lib/p5.grain.min.js"></script>
<script src="./sketch.js"></script>
```

*Note: The minified version `p5.grain.min.js` is primarily meant for development, since it handles errors and warnings. However, we recommend using the even smaller core version `p5.grain.core.js` when your sketch is final and you've made sure that p5.grain-related errors and warnings cannot occur.*

## Usage

The first step is to set up p5.grain according to your project's needs in the `setup` function of your sketch.

### Non-deterministic setup

Suited for projects that *don't* have to be deterministic, *don't* use the [pixel manipulation](#pixel-manipulation) technique, or *don't* use methods for animating texture overlays.

```js
function setup() {
    p5grain.setup();
}
```

### Deterministic setup

Suited for projects that should be deterministic.

```js
function setup() {
    // make Math.random be same as random
    Math.random = random;

    // set seeds (example)
    randomSeed(999999);
    noiseSeed(999999);

    p5grain.setup();
}
```

### Deterministic setup (fxhash)

Suited for fxhash projects.

```js
function setup() {
    // make Math.random be same as fxrand
    Math.random = fxrand;

    // set seeds (example)
    randomSeed(fxrand() * 999999);
    noiseSeed(fxrand() * 999999);

    // use fxrand as the internal random function
    p5grain.setup({ random: fxrand });
}
```

### Ignoring errors and warnings

*Note: Ignoring errors and warnings is not possible when using `p5.grain.core.js`, since errors and warnings are not handled in the core version of p5.grain.*

Initially, p5.grain will attempt to extend p5.js core functionality by registering new methods. If a method cannot be registered because the method name is already in use, p5.grain will log a warning with a suggestion of an alternative usage. You can prevent warnings to be logged by passing `ignoreWarnings: true` to the `config` object when setting up p5.grain.

When using p5.grain methods, the library validates the parameters passed to the respective methods, and error messages are thrown in case of invalid parameters to attract attention during development. You can prevent errors to be thrown by passing `ignoreErrors: true` to the `config` object when setting up p5.grain. 

*Note: If your sketch is final and you've made sure that p5.grain-related errors or warnings cannot occur, we recommend using `p5.grain.core.js` instead of manually ignoring errors and warnings as shown below, since errors and warnings are not handled in the core version of p5.grain.*

```js
function setup() {
    // ignore warnings and errors
    p5grain.setup({
        ignoreWarnings: true,
        ignoreErrors: true,
    });
}
```

## Techniques

p5.grain currently supports the techniques: pixel manipulation, texture overlay and SVG filter. WebGL shader technique is coming soon.

Depending on how your artwork is created and whether you want to animate texture overlays, you would use p5.grain methods within the `setup` or `draw` functions of your sketch.

The best way to get you started with a technique is to check out the provided standalone [examples](./examples). There is an example for each technique currently supported by the library.

Go to standalone example:
* [Pixel manipulation](./examples/pixel-manipulation)
* Texture overlay
  * [Inside canvas](./examples/texture-overlay-inside) (texture animation supported)
  * [Outside canvas](./examples/texture-overlay-outside) (texture animation supported)
* SVG filter
  * [SVG element](./examples/svg-element) (texture animation supported; [limited compatibility in Safari](#limitations))
  * [SVG URL-encoded](./examples/svg-url-encoded) (texture animation supported; [doesn't work in Safari](#limitations))
* Shader (soon)

Here are a few examples of a basic implementation for each respective technique. *Note: the examples below are non-deterministic.*

### Pixel manipulation

```js
function setup() {

    p5grain.setup();

    // draw your artwork here
    // ...

    // example: simple method
    granulateSimple(42);

    // example: channels method
    // granulateChannels(42);
}
```

The next example demonstates granulating the artwork using `tinkerPixels(callback, shouldUpdate)` pixel-manipulation function. In this case the `callback` function is an implementation of the `granulateSimple` function. *Note that the example is non-deterministic!*

```js
function setup() {

    p5grain.setup();

    // draw your artwork here
    // ...

    // example: custom granulateSimple implementation
    const amount = 42;
    const alpha = false;
    tinkerPixels((index, total) => {
        const grainAmount = floor(random() * (amount * 2 + 1)) - amount;
        pixels[index] = pixels[index] + grainAmount;
        pixels[index+1] = pixels[index+1] + grainAmount;
        pixels[index+2] = pixels[index+2] + grainAmount;
        if (alpha) {
            pixels[index+3] = pixels[index+3] + grainAmount;
        }
    });
}
```

#### Read-only mode
If you would simply like to loop through the pixels and read their values without manipulating them, you can set `shouldUpdate` to `false`. This will internally skip `updatePixels()`:
```js
let minAvg = 255;
let maxAvg = 0;
tinkerPixels((index, total) => {
    // determine min, max average pixel values
    const avg = round((pixels[index] + pixels[index+1] + pixels[index+2])/3);
    minAvg = min(minAvg, avg);
    maxAvg = max(maxAvg, avg);
}, false); // <-- shouldUpdate = false
```

### Texture overlay inside canvas

```js
let textureImage;

function preload() {
    textureImage = loadImage('./assets/texture.jpg');
}

function setup() {

    p5grain.setup();

    // draw your artwork here
    // ...

    textureOverlay(textureImage);
}
```

### Texture overlay inside canvas with texture animation

```js
let textureImage;

function preload() {
    textureImage = loadImage('./assets/texture.jpg');
}

function setup() {
    p5grain.setup();
}

function draw() {

    // draw your artwork here
    // ...

    textureOverlay(textureImage, { animate: true });
}
```

For more concrete use cases, please have a look at the provided [examples](./examples).

## Global and instance mode

p5.grain supports both global and instance mode. You can read more about p5.js global and instance mode [here](https://github.com/processing/p5.js/wiki/Global-and-instance-mode).

All examples from above showcase p5.grain usage in p5's global mode.

In order to use p5.grain on a specific p5.js instance, you can pass the respective instance to the `p5grain.setup` method. Since p5.grain methods are registered to `p5.prototype`, you can call registered p5.grain methods directly on your p5.js instance. Here's how to use p5.grain in p5's instance mode:

```js
let myp5 = new p5((sketch) => {
    sketch.setup = () => {
        
        // configure p5.grain to be used on a specific p5.js instance
        p5grain.setup({ instance: sketch });

        // draw your artwork here
        // ...

        // example: simple method
        sketch.granulateSimple(42);
    }
});
```
To better understand how p5.grain works in instance mode, please have a look at the provided [example](./examples/instance-mode/).

## API

p5.grain exposes the following API.

*Note: p5.grain is still in the initial development phase and the API can still change. Always review the release notes.*

The library initializes the global `p5grain` variable to a new `P5Grain` instance. You can directly access the fields and methods below from the `p5grain` variable. The library also attempts to register all p5.grain methods except `setup` with p5.js by adding them to `p5.prototype`. This way, instead of calling, for example, `p5grain.granulateSimple(42)`, you can conveniently call `granulateSimple(42)`, although the former is also possible.

### Fields

| Field | Type | Description |
| --- | --- | --- |
| `version` | `String` | Holds the p5.grain version in [SemVer](https://semver.org) format. |
| `ignoreWarnings` | `Boolean` | Defines whether warnings should be ignored. (default: `false`)<br>*Note: not available in the p5.grain core version.* |
| `ignoreErrors` | `Boolean` | Defines whether errors should be ignored. (default: `false`)<br>*Note: not available in the p5.grain core version.* |

### Methods

| Method | Description |
| --- | --- |
| `setup([config])` | Setup and configure certain p5.grain features. |
| `granulateSimple(amount, [alpha], [pg])` | Granulate pixels by the given amount. |
| `granulateChannels(amount, [alpha], [pg])` | Granulate pixels channels by the given amount. |
| `tinkerPixels(callback, [shouldUpdate], [pg])` | Loop through pixels and call the given callback function on every pixel. |
| `textureOverlay(textureImage, config)` | Blend the given texture image onto the canvas. |
| `textureAnimate(textureElement, config)` | Animate the given texture element by randomly shifting its background position. |

### `p5grain.setup([config])`

Setup and configure certain p5grain features.

| Property | Type | Description |
| --- | --- | --- |
| `config` | `Object` | (optional) Config object to configure p5grain features. |
| `config.random` | `function` | (optional) The random function that should be used internally for pixel manipulation and texture animation. |
| `config.instance` | `Object` | (optional) Reference to a p5.js instance. Read how to use p5.grain with p5.js instance mode [here](#global-and-instance-mode). |
| `config.ignoreWarnings` | `Boolean` | (optional) Defines whether warnings should be ignored.<br>*Note: not available in the p5.grain core version.* |
| `config.ignoreErrors` | `Boolean` | (optional) Defines whether errors should be ignored.<br>*Note: not available in the p5.grain core version.* |

### `granulateSimple(amount, [alpha], [pg])`

Granulate pixels by the given amount.

This method generates one random value per pixel. The random value ranges from `-amount` to `+amount` and is added to every RGB(A) pixel channel.

| Property | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. When not specified the alpha channel will not be modified. |
| `pg` | `p5.Graphics` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.granulateSimple(amount, alpha)`. Only in case `p5.Graphics.granulateSimple` could not be registered, use the alternative syntax `p5grain.granulateSimple(amount, alpha, pg)`.* |

### `granulateChannels(amount, [alpha], [pg])`

Granulate pixels channels by the given amount.

This method generates one random value per pixel channel. The random values range from `-amount` to `+amount`. Each random value is added to the respective RGB(A) channel of the pixel.

| Property | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. When not specified the alpha channel will not be modified. |
| `pg` | `p5.Graphics` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.granulateChannels(amount, alpha)`. Only in case `p5.Graphics.granulateChannels` could not be registered, use the alternative syntax `p5grain.granulateChannels(amount, alpha, pg)`.* |

### `tinkerPixels(callback, [shouldUpdate], [pg])`

Loop through pixels and call the given callback function on every pixel. Pixels are manipulated depending on the given callback function.

The callback function receives two arguments:
- `index`: the current pixel index
- `total`: the total indexes count

[Read-only mode](#read-only-mode): updating pixels can be by-passed by setting the `shouldUpdate` argument to `false`.

| Property | Type | Description |
| --- | --- | --- |
| `callback` | `Function` | The callback function that should be called on every pixel. |
| `shouldUpdate` | `Boolean` | (optional) Specifies whether the pixels should be updated. |
| `pg` | `p5.Graphics` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.tinkerPixels(callback, shouldUpdate)`. Only in case `p5.Graphics.tinkerPixels` could not be registered, use the alternative syntax `p5grain.tinkerPixels(callback, shouldUpdate, pg)`.* |

### `textureOverlay(textureImage, [config], [pg])`

Blend the given texture image onto the canvas.

The texture is repeated along the horizontal and vertical axes to cover the entire canvas (or context).

| Property | Type | Description |
| --- | --- | --- |
| `texture` | `p5.Image` | The texture image to blend over. |
| `config` | `Object` | (optional) Config object to configure the texture overlay. |
| `config.width` | `Number` | (optional) The width the texture image should have. When no width is specified, the width of the texture image is assumed. |
| `config.height` | `Number` | (optional) The height the texture image should have. When no height is specified, the height of the texture image is assumed. |
| `config.mode` | `Constant` | (optional) The blend mode that should be used to blend the texture over the canvas. Either `BLEND`, `DARKEST`, `LIGHTEST`, `DIFFERENCE`, `MULTIPLY`, `EXCLUSION`, `SCREEN`, `REPLACE`, `OVERLAY`, `HARD_LIGHT`, `SOFT_LIGHT`, `DODGE`, `BURN`, `ADD` or `NORMAL`. When no mode is specified, the blend mode `MULTIPLY` will be used. |
| `config.reflect` | `Boolean` | (optional) Specifies whether the given texture image should reflect horizontally and vertically, in order to provide seamless continuity. |
| `config.animate` | `Boolean\| Object` | (optional) Specifies whether the given texture image should be animated. |
| `config.animate.atFrame` | `Number` | (optional) When animation is activated, the frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. |
| `config.animate.amount` | `Number` | (optional) When animation is activated, the maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. |
| `pg` | `p5.Graphics` | (optional) The offscreen graphics buffer onto which the texture image should be drawn.<br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.textureOverlay(textureImage, config)`. Only in case `p5.Graphics.textureOverlay` could not be registered, use the alternative syntax `p5grain.textureOverlay(textureImage, config, pg)`.* |

### `textureAnimate(textureElement, [config])`

Animate the given texture element by randomly shifting its background position.

| Property | Type | Description |
| --- | --- | --- |
| `textureElement` | `HTMLElement\| SVGElement\| p5.Element` | The texture element to be animated. |
| `config` | `Object` | (optional) Config object to configure the texture animation. |
| `config.atFrame` | `Number` | (optional) The frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. |
| `config.amount` | `Number` | (optional) The maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. |

## Limitations

* Safari: SVG element technique only works for browser window resolutions with less than 2<sup>20</sup> pixels (e.g. 1024 x 1024 pixels).
* Safari: SVG URL-encoded technique is currently unsupported.

## Contributing

Are you considering contributing to p5.grain? Check out our [contributing guidelines](./CONTRIBUTING.md).

## License

p5.grain is [MIT licensed](./LICENSE).
