# p5.grain
p5.grain is a [p5.js](https://github.com/processing/p5.js) addon for conveniently adding grain and texture overlays to artworks.

p5.grain was also created with [fxhash](https://www.fxhash.xyz) projects in mind that use the deterministic `fxrand` random function.

You can read more in detail about the different techniques to achieve grain in artworks in the article "[All about that grain](https://www.fxhash.xyz/article/all-about-that-grain)" on fxhash by [Gorilla Sun](https://twitter.com/gorillasu) and [meezwhite](https://twitter.com/meezwhite).

## Getting started
Download the latest version from [Releases](https://github.com/meezwhite/p5.grain/releases) and embed either `p5.grain.js` (26 KB) or `p5.grain.min.js` (8 KB) in your project's HTML file *after* loading p5.js but *before* loading your sketch code.

```html
    <script src="./lib/p5.min.js"></script>
    <!-- insert after p5.js -->
    <script src="./lib/p5.grain.min.js"></script>
    <script src="./sketch.js"></script>
```

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

    randomSeed(fxrand() * 999999);
    noiseSeed(fxrand() * 999999);

    // use fxrand as the internal random function
    p5grain.setup({ random: fxrand });
}
```

### Ignoring errors and warnings

Initially, p5.grain will attempt to extend p5 core functionality by registering new methods. If a method cannot be registered because the method name is already in use, p5.grain will log a warning with a suggestion of an alternative usage. You can prevent warnings to be logged by passing `ignoreWarnings: true` to the `config` object when setting up p5.grain.

When using p5.grain methods, the library validates the parameters passed to the respective methods, and error messages are thrown in case of invalid parameters to attract attention during development. You can prevent errors to be thrown by passing `ignoreErrors: true` to the `config` object when setting up p5.grain. 

**Note: We recommend ignoring warnings and errors only when your sketch is final, and you've made sure that no p5.grain warnings or errors can occur.**

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

The best way to get you started with a technique is to checkout the provided standalone [examples](./examples). There is an example for each technique currently supported by the library.

Go to standalone example:
* [Pixel manipulation](./examples/pixel-manipulation)
* Texture overlay
  * [Inside canvas](./examples/texture-overlay-inside-canvas) (texture animation supported)
  * [Outside canvas](./examples/texture-overlay-outside-canvas) (texture animation supported)
* SVG filter
  * [SVG element](./examples/svg-element)
  * [SVG URL-encoded](./examples/svg-url-encoded) (texture animation supported)
* Shader (soon)

Here are a few examples of a basic implementation for each respective technique. *Note that these examples are non-deterministic.*

### Pixel manipulation

```js
function setup() {

    p5grain.setup();

    // draw your artwork here
    // ...

    granulateChannels(42);
}
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

## API

p5.grain exposes the following API.

*Note: p5.grain is still in the initial development phase and the API can still change. Always review the release notes.*

The library initializes the global `p5grain` variable to a new `P5Grain` instance. You can directly access the fields and methods below from the `p5grain` variable. The library also attempts to register all p5.grain methods except `setup` with p5 by adding them to `p5.prototype`. This way, instead of calling, for example, `p5grain.granulateSimple(42)`, you can conveniently call `granulateSimple(42)`, although the former is also possible.

| Field | Type | Description |
| --- | --- | --- |
| `version` | `String` | Holds the p5.grain version in [SemVer](https://semver.org) format. |
| `ignoreWarnings` | `Boolean` | Defines whether warnings should be ignored. (default: `false`) |
| `ignoreErrors` | `Boolean` | Defines whether errors should be ignored. (default: `false`) |

| Method | Description |
| --- | --- |
| `setup(config)` | Setup and configure certain p5.grain features. |
| `granulateSimple(amount, alpha)` | Granulate the main canvas pixels by the given amount. |
| `granulateChannels(amount, alpha)` | Granulate the main canvas pixels channels by the given amount. |
| `granulateFuzzify(amount, fuzziness, alpha)` | Fuzzify and granulate the main canvas pixels by the given amount. |
| `textureOverlay(textureImage, config)` | Blend the given texture image onto the canvas. |
| `textureAnimate(textureElement, config)` | Animate the given texture element by randomly shifting its background position. |

### `p5grain.setup(config)`

Setup and configure certain p5grain features.

| Property | Type | Description |
| --- | --- | --- |
| `config` | `Object` | (optional) Config object to configure p5grain features. |
| `config.random` | `function` | (optional) The random function that should be used internally for pixel manipulation and texture animation. |
| `config.ignoreWarnings` | `Boolean` | (optional) Defines whether warnings should be ignored. |
| `config.ignoreErrors` | `Boolean` | (optional) Defines whether errors should be ignored. |

### `granulateSimple(amount, alpha)`

Granulate the main canvas pixels by the given amount.

This method generates one random value per pixel. The random value ranges from `-amount` to `+amount` and is added to every RGB(A) pixel channel.

| Property | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. When not specified the alpha channel will not be modified. |

### `granulateChannels(amount, alpha)`

Granulate the main canvas pixels channels by the given amount.

This method generates one random value per pixel channel. The random values range from `-amount` to `+amount`. Each random value is added to the respective RGB(A) channel of the pixel.

| Property | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. When not specified the alpha channel will not be modified. |

### `granulateFuzzify(amount, fuzziness, alpha)`

Fuzzify and granulate the main canvas pixels by the given amount.

This method modifies pixels in two steps:
1. Selects a pixel $Pn$ that lies "width indices" + "2 pixel indices" further in the pixels array. The value of the current pixel $Pc$ is then calculated as follows: $Pc = (Pc + Pn) / 2$
2. A random value per pixel channel is generated. The random values range from `-amount` to `+amount`. Each random value is added to the respective RGB(A) channel of the pixel.

| Property | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `fuzziness` | `Number` | (optional) The amount of fuzziness that should be applied or the amount of pixels the cavans should be fuzzified by. (default: `2`) |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. When not specified the alpha channel will not be modified. (default: `false`) |

### `textureOverlay(textureImage, config)`

Blend the given texture image onto the canvas.

The texture is repeated along the horizontal and vertical axes to cover the entire canvas (or context).

| Property | Type | Description |
| --- | --- | --- |
| `texture` | `p5.Image` | The texture image to blend over. |
| `config` | `Object` | (optional) Config object to configure the texture overlay. |
| `config.width` | `Number` | (optional) The width the texture image should have. When no width is specified, the width of the texture image is assumed. |
| `config.height` | `Number` | (optional) The height the texture image should have. When no height is specified, the height of the texture image is assumed. |
| `config.mode` | `Constant` | (optional) The blend mode that should be used to blend the texture over the canvas. Either `BLEND`, `DARKEST`, `LIGHTEST`, `DIFFERENCE`, `MULTIPLY`, `EXCLUSION`, `SCREEN`, `REPLACE`, `OVERLAY`, `HARD_LIGHT`, `SOFT_LIGHT`, `DODGE`, `BURN`, `ADD` or `NORMAL`. When no mode is specified, the blend mode `MULTIPLY` is be used. |
| `config.context` | `p5.Graphics` | (optional) The context on which the texture image should be drawn onto. When no context is specified, the main canvas is be used. **Deprecated: Will be removed in favor of `context.textureOverlay(arguments)`.** |
| `config.reflect` | `Boolean` | (optional) Specifies whether the given texture image should reflect horizontally and vertically, in order to provide seamless continuity. |
| `config.animate` | `Boolean\| Object` | (optional) Specifies whether the given texture image should be animated. |
| `config.animate.atFrame` | `Number` | (optional) When animation is activated, the frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. |
| `config.animate.amount` | `Number` | (optional) When animation is activated, the maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. |

### `textureAnimate(textureElement, config)`

Animate the given texture element by randomly shifting its background position.

| Property | Type | Description |
| --- | --- | --- |
| `textureElement` | `HTMLElement\| SVGElement\| p5.Element` | The texture element to be animated. |
| `config` | `Object` | (optional) Config object to configure the texture animation. |
| `config.atFrame` | `Number` | (optional) The frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. |
| `config.amount` | `Number` | (optional) The maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. |

**Note: Animation of `SVGElement` is currently unsupported. Will throw an error that cannot be ignored with `ignoreErrors: true`.**

## Limitations

* p5.grain currently only works in [p5's global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode).
* `granulate*` methods currently only work on the main canvas pixels.
* `textureAnimate` currently doesn't support animating SVG elements.


## License

p5.grain is [MIT licensed](./LICENSE).
