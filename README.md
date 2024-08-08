<a id="top"></a>

# 🌾 p5.grain
p5.grain is a [p5.js](https://github.com/processing/p5.js) library for conveniently applying film grain, seamless texture overlays, and manipulate pixels to achieve nostalgic and artistic effects in p5.js sketches and artworks.

Ideal for deterministic generative artworks, p5.grain ensures consistent film grain effects with each reload. It's perfect for platforms like [fxhash](https://www.fxhash.xyz), where generative artworks should use a deterministic approach to randomness.

The initial release of the library was accompanied by the article "[All About That Grain](https://www.fxhash.xyz/article/all-about-that-grain)" co-authored by [Gorilla Sun](https://x.com/gorillasu) and [meezwhite](https://x.com/meezwhite). Since then, p5.grain has been regularly updated to further enhance its functionality, performance and ease of use.


<a id="table_of_contents"></a>

## Table of Contents

* [Getting started](#getting_started)
* [Which file should I use?](#which_file)
* [Setup](#setup)
* [Techniques](#techniques)
    * [Pixel manipulation](#pixel_manipulation)
        * [Read-only mode](#read_only_mode)
    * [Texture overlay inside canvas](#texture_overlay_inside_canvas)
    * [Texture overlay inside canvas with texture animation](#texture_overlay_inside_canvas_with_texture_animation)
* [Ignoring errors and warnings](#ignoring_errors_and_warnings)
* [Global and instance mode](#global_and_instance_mode)
* [API](#api)
* [Limitations](#limitations)
* [Support](#support)
* [Contributing](#contributing)
* [License](#license)


<a id="getting_started"></a>

## Getting started
Download the latest version from [Releases](https://github.com/meezwhite/p5.grain/releases) and embed `p5.grain.js` (~42 KB) or `p5.grain.min.js` (~6 KB) in your project's HTML file *after* loading p5.js but *before* loading your sketch code.

```html
<script src="./lib/p5.min.js"></script>
<!-- insert after p5.js -->
<script src="./lib/p5.grain.min.js"></script>
<script src="./sketch.js"></script>
```

[Go to top ⬆](#top)


<a id="which_file"></a>

## Which file should I use?

| File              | Size    | Purpose     | Errors & Warnings       |
| ----------------- | ------- | ----------- | ----------------------- |
| `p5.grain.js`     | ~ 42 KB | development | Yes (can be turned off) |
| `p5.grain.min.js` | ~ 6 KB  | production  | No                      |

The unminified version `p5.grain.js` is primarily meant for when you are working on your sketch. It handles p5.grain related errors and warnings, and therefore has a considerably larger file size. However, we recommend using the minified version `p5.grain.min.js` when your sketch is final and you've made sure that p5.grain related errors and warnings cannot occur.

[Go to top ⬆](#top)


<a id="setup"></a>

## Setup

The first step is to set up p5.grain according to your project's needs in the `setup` function of your sketch.

### Non-deterministic setup

Use this setup for p5 sketches that *don't* need to use deterministic randomness.

```js
function setup() {
    p5grain.setup();
}
```

### Deterministic setup

Use this setup for p5 sketches that need to use deterministic randomness.

Simply set a seed number for the `random` function using p5's `randomSeed(seed)` function. In the example below, the seed number 1<sup>6</sup> (one million) is used, but you can choose any seed number you like. 

```js
function setup() {
    randomSeed(1e6);
    p5grain.setup();
}
```

<details>
<summary style="font-size: 1.2rem; font-weight: bold;">Deterministic setup (fxhash)</summary>
<br>
Use this setup when using p5.grain for fxhash generative projects.
<br><br>
If you're unsure how to correctly use randomness for fxhash projects, we recommend reading the "<a href="https://docs.fxhash.xyz/using-randomness-correctly">Use Randomness Correctly</a>" guide in the fxhash documentation first.

#### Method 1: Using `fxrand` for randomness (recommended)

In most cases, you will use `fxrand` as the *single* source of randomness for your generative project. In this case, you simply have to configure p5.grain to also use `fxrand` as the underlying source of randomness.

```js
function setup() {
    p5grain.setup({ random: fxrand });

    // Use `fxrand()` for all randomness in your project.
}
```

*Note: You can also use `$fx.rand` instead of `fxrand` for consistency across your code. Please refer to the [fxhash API reference](https://docs.fxhash.xyz/api-reference) for further information.*

#### Method 2: Using p5's `random` for randomness

Although this method is not used that often for fxhash projects, you can use p5's `random` function as the *single* source of randomness for your generative project too. To achieve this, you'll need to use `fxrand` *once* to generate an initial deterministic number for computing the seed number for `random`. 

In the example below, a seed number is computed by multiplying `fxrand` with a number of your choice. In this case, 1<sup>6</sup> (one million) is used, but you can choose any number you like.

```js
function setup() {
    randomSeed(fxrand() * 1e6);
    p5grain.setup();

    // Use `random()` for all randomness in your project.
}
```

*Note: You can also use `$fx.rand` instead of `fxrand` for consistency across your code. Please refer to the [fxhash API reference](https://docs.fxhash.xyz/api-reference) for further information.*

</details>


<a id="techniques"></a>

## Techniques

p5.grain currently supports the techniques: pixel manipulation, texture overlay and SVG filter. WebGL shader technique is planned for the future. Stay tuned!

Depending on how your artwork is created and whether you want to animate texture overlays, you would use p5.grain methods within the `setup` or `draw` functions of your sketch.

The best way to get you started with a technique is to check out the provided standalone [examples](./examples). There is an example for each technique currently supported by the library.

Go to the standalone examples:
* [Pixel manipulation](./examples/pixel-manipulation)
    * [Monochromatic grain](./examples/pixel-manipulation/01-monochromatic-grain)
    * [Chromatic grain](./examples/pixel-manipulation/02-chromatic-grain)
    * [Tinker with pixels](./examples/pixel-manipulation/03-tinker-pixels)
    * [Loop over pixels](./examples/pixel-manipulation/04-loop-pixels-read-onyl) (read-only mode)
* Texture overlay
    * [Inside canvas](./examples/texture-overlay-inside) (texture animation supported)
    * [Outside canvas](./examples/texture-overlay-outside) (texture animation supported)
* SVG filter
    * [SVG element](./examples/svg-element) (texture animation supported; [limited compatibility in Safari](#limitations))
    * [SVG URL-encoded](./examples/svg-url-encoded) (texture animation supported; [doesn't work in Safari](#limitations))

Here are a few examples of a basic implementation for each respective technique. **Note that all the examples below are non-deterministic.**


<a id="pixel_manipulation"></a>

### Pixel manipulation

```js
function setup() {

    p5grain.setup();

    // draw something...

    applyMonochromaticGrain(42);
    // applyChromaticGrain(42);
}
```

The next example demonstates modifying the artwork's pixels using the `tinkerPixels(callback)` function. Here the red channel of each pixel is set to a random value between 0 and 255.

```js
function setup() {

    p5grain.setup();

    // draw something...

    // set the red channel of each pixel to a random value between 0 and 255
    tinkerPixels((index, total) => {
        pixels[index] = random(0, 255); // red channel
    });
}
```

<a id="read_only_mode"></a>

#### Read-only mode

If you only want to loop over pixels without changing them, you can use `loopPixels`:
```js
loopPixels((index, total) => {
    // read-only mode
    // ...
});
```

Alternatively, you can use `tinkerPixels` in read-only mode:
```js
tinkerPixels((index, total) => {
    // read-only mode
    // ...
}, false); // <-- shouldUpdate = false
```

[Go to top ⬆](#top)


<a id="texture_overlay_inside_canvas"></a>

### Texture overlay inside canvas

```js
let textureImage;

function preload() {
    textureImage = loadImage('./assets/texture.jpg');
}

function setup() {

    p5grain.setup();

    // draw something...

    textureOverlay(textureImage);
}
```

[Go to top ⬆](#top)


<a id="texture_overlay_inside_canvas_with_texture_animation"></a>

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
    // draw something...

    textureOverlay(textureImage, { animate: true });
}
```

For more concrete use cases, please have a look at the provided [examples](./examples).

[Go to top ⬆](#top)


<a id="ignoring_errors_and_warnings"></a>

## Ignoring errors and warnings

Turning off errors and warnings is possible when using the unminified version of p5.grain (`p5.grain.js`). The minified version of p5.grain (`p5.grain.min.js`) doesn't handle errors and warnings. (see [Which file should I use?](#which_file))

Initially, p5.grain will attempt to extend p5.js core functionality by registering new functions. If a function cannot be registered because the function name is already in use, p5.grain will log a warning with a suggestion of an alternative usage. You can prevent warnings to be logged by passing `ignoreWarnings: true` to the `config` object when setting up p5.grain.

When using p5.grain functions, the library validates the parameters passed to the respective functions, and error messages are thrown in case of invalid parameters to attract attention during development. You can prevent errors to be thrown by passing `ignoreErrors: true` to the `config` object when setting up p5.grain. 

When your sketch is final and you've made sure that p5.grain-related errors or warnings cannot occur, we recommend using `p5.grain.min.js` instead of manually ignoring errors and warnings as shown below, since errors and warnings are not handled in the minified version of p5.grain.

```js
function setup() {
    // ignore warnings and errors
    p5grain.setup({
        ignoreWarnings: true,
        ignoreErrors: true,
    });
}
```

[Go to top ⬆](#top)


<a id="global_and_instance_mode"></a>

## Global and instance mode

p5.grain supports both global and instance mode. You can read more about p5.js global and instance modes [here](https://github.com/processing/p5.js/wiki/Global-and-instance-mode).

All examples from above showcase p5.grain usage in p5's global mode.

In order to use p5.grain on a specific p5.js instance, you can pass the respective instance to the `p5grain.setup` function. Since p5.grain functions are registered to `p5.prototype`, you can call registered p5.grain functions directly on your p5.js instance. Here's how to use p5.grain in p5's instance mode:

```js
let myp5 = new p5((sketch) => {
    sketch.setup = () => {

        // configure p5.grain to be used on a specific p5.js instance
        p5grain.setup({ instance: sketch });

        // draw something...

        // example: apply monochromatic grain
        sketch.applyMonochromaticGrain(42);
    }
});
```

To better understand how p5.grain works in instance mode, please have a look at the provided [examples](./examples/instance-mode/).

[Go to top ⬆](#top)


<a id="api"></a>

## API

**Note: p5.grain is still in the initial development phase and the API can still change. Always review the release notes.**

The library initializes the global `p5grain` variable to a new `P5Grain` instance. You can directly access the properties and functions below from the `p5grain` variable. The library also attempts to register all p5.grain functions except `setup` with p5.js by adding them to `p5.prototype`. This way, instead of calling, for example, `p5grain.applyMonochromaticGrain(42)`, you can conveniently call `applyMonochromaticGrain(42)`, although the former is also possible.

p5.grain exposes the following properties and functions:

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `version` | `String` | Holds the p5.grain version in [SemVer](https://semver.org) format. |
| `ignoreWarnings` | `Boolean` | Specifies whether warnings should be ignored. (default: `false`)<br>*Note: not available in the p5.grain minified version.* |
| `ignoreErrors` | `Boolean` | Specifies whether errors should be ignored. (default: `false`)<br>*Note: not available in the p5.grain minified version.* |

### Functions

| Method | Description |
| --- | --- |
| `setup([config])` | Setup and configure p5.grain features. |
| `applyMonochromaticGrain(amount, [alpha], [pg])` | Apply monochromatic grain. |
| `applyChromaticGrain(amount, [alpha], [pg])` | Apply chromatic grain. |
| `tinkerPixels(callback, [shouldUpdate], [pg])` | Loop through pixels and call the given callback function for every pixel. Pixels are manipulated depending on the given callback function, unless read-only mode is enabled. |
| `loopPixels(callback, [pg])` | Loop through pixels and call the given callback function for every pixel without updating them (read-only mode). |
| `textureOverlay(textureImage, config)` | Blend the given texture image onto the canvas. The texture is repeated along the horizontal and vertical axes to cover the entire canvas or context. |
| `textureAnimate(textureElement, config)` | Animate the given texture element by randomly shifting its background position. |

[Go to top ⬆](#top)


### `p5grain.setup([config])`

Setup and configure p5.grain features.

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | `Object` | (optional) Config object to configure p5grain features. |
| `config.random` | `function` | (optional) The random function that should be used for e.g. pixel manipulation, texture animation, etc. Here you could use a custom deterministic random function (e.g. fxrand). (default: p5's `random` function) |
| `config.randomMode` | `function` | (optional) Specifies the mode of the internal random function. Either `'float'` for floating-point numbers or `'int'` for integers. (default: `'float'`) |
| `config.instance` | `Object` | (optional) Reference to a p5.js instance. Read how to use p5.grain with p5.js instance mode [here](#global-and-instance-mode). |
| `config.ignoreWarnings` | `Boolean` | (optional) Specifies whether warnings should be ignored. (default: `false`)<br>*Note: not available in the p5.grain minified version.* |
| `config.ignoreErrors` | `Boolean` | (optional) Specifies whether errors should be ignored. (default: `false`)<br>*Note: not available in the p5.grain minified version.* |

<details>
<summary><strong>Examples</strong></summary>

#### Custom random function

Configure p5.grain to use `fxrand` as the internal random function:

```js
function setup() {
    p5grain.setup({ random: fxrand });
}
```

#### Configure `randomMode`

Configure the internal random function to generate integers:

```js
function setup() {
    p5grain.setup({ randomMode: 'int' });
}
```

Configure the internal random function to generate floating-point numbers:

```js
function setup() {
    p5grain.setup({ randomMode: 'float' });
}
```

*Note: `randomMode` is `'float'` by default, so you only need to do the above if you have previously configured `randomMode` to something other than `'float'` and you now need to generate random floating-point numbers again.*

#### Ignore errors and warnings

Make sure you've read the section on [Ignoring errors and warnings](#ignoring_errors_and_warnings). This is how you can suppress errors and warnings in the unminified version of p5.grain:

```js
function setup() {
    p5grain.setup({
        ignoreErrors: true,
        ignoreWarnings: true,
    });
}
```

</details>
<br>

[Go to top ⬆](#top)

### `applyMonochromaticGrain(amount, [alpha], [pg])`

Apply monochromatic grain.

This function generates one random value per pixel. The random value ranges from `-amount` to `+amount`. Each generated random value is added to every RGB(A) pixel channel.

| Parameter | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. (default: `false`)<br><br>*Caution: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.* |
| `pg\|img` | `p5.Graphics\|p5.Image` | (optional) The offscreen graphics buffer or image whose pixels should be manipulated.<br><br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.applyMonochromaticGrain(amount, alpha)`. Only in case `p5.Graphics.applyMonochromaticGrain` could not be registered, use the alternative syntax `p5grain.applyMonochromaticGrain(amount, alpha, pg)`.*<br><br>*Note: When using an image, use the usual syntax `img.applyMonochromaticGrain(amount, alpha)`. Only in case `p5.Image.applyMonochromaticGrain` could not be registered, use the alternative syntax `p5grain.applyMonochromaticGrain(amount, alpha, img)`.* |

[Go to top ⬆](#top)


### `applyChromaticGrain(amount, [alpha], [pg])`

Apply chromatic grain.

This function generates one random value per pixel channel. The random values range from `-amount` to `+amount`. Each generated random value is added to the respective RGB(A) channel of the pixel.

| Parameter | Type | Description |
| --- | --- | --- |
| `amount` | `Number` | The amount of granularity that should be applied. |
| `alpha` | `Boolean` | (optional) Specifies whether the alpha channel should also be modified. (default: `false`)<br><br>*Caution: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.* |
| `pg\|img` | `p5.Graphics\|p5.Image` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br><br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.applyChromaticGrain(amount, alpha)`. Only in case `p5.Graphics.applyChromaticGrain` could not be registered, use the alternative syntax `p5grain.applyChromaticGrain(amount, alpha, pg)`.*<br><br>*Note: When using an image, use the usual syntax `img.applyChromaticGrain(amount, alpha)`. Only in case `p5.Image.applyChromaticGrain` could not be registered, use the alternative syntax `p5grain.applyChromaticGrain(amount, alpha, img)`.* |

[Go to top ⬆](#top)


### `tinkerPixels(callback, [shouldUpdate], [pg])`

Loop through pixels and call the given callback function for every pixel. Pixels are manipulated depending on the given callback function, unless read-only mode is enabled.

The callback function provides two arguments:
1. `index`: the current pixel index
2. `total`: the total indexes count

[Read-only mode](#read-only-mode): updating pixels can be by-passed by setting the `shouldUpdate` argument to `false`. **It is however recommended to use `loopPixels` if you only want to loop through pixels.**

| Parameter | Type | Description |
| --- | --- | --- |
| `callback` | `Function` | The callback function that should be called on every pixel. |
| `shouldUpdate` | `Boolean` | (optional) Specifies whether the pixels should be updated. (default: `true`) |
| `pg\|img` | `p5.Graphics\|p5.Image` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br><br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.tinkerPixels(callback, shouldUpdate)`. Only in case `p5.Graphics.tinkerPixels` could not be registered, use the alternative syntax `p5grain.tinkerPixels(callback, shouldUpdate, pg)`.*<br><br>*Note: When using an image, use the usual syntax `img.tinkerPixels(callback, shouldUpdate)`. Only in case `p5.Image.tinkerPixels` could not be registered, use the alternative syntax `p5grain.tinkerPixels(callback, shouldUpdate, img)`.* |

[Go to top ⬆](#top)


### `loopPixels(callback, [pg])`

Loop through pixels and call the given callback function for every pixel without updating them ([read-only mode](#read-only-mode)).

In contrast to the `tinkerPixels` function, no pixel manipulations are performed with `loopPixels`. In other words `loopPixels` has the same effect as using `tinkerPixels` in [read-only mode](#read-only-mode).

The callback function provides two arguments:
1. `index`: the current pixel index
2. `total`: the total indexes count

| Parameter | Type | Description |
| --- | --- | --- |
| `callback` | `Function` | The callback function that should be called on every pixel. |
| `pg\|img` | `p5.Graphics\|p5.Image` | (optional) The offscreen graphics buffer whose pixels should be manipulated.<br><br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.loopPixels(callback)`. Only in case `p5.Graphics.loopPixels` could not be registered, use the alternative syntax `p5grain.loopPixels(callback, pg)`.*<br><br>*Note: When using an image, use the usual syntax `img.loopPixels(callback)`. Only in case `p5.Image.loopPixels` could not be registered, use the alternative syntax `p5grain.loopPixels(callback, img)`.* |

[Go to top ⬆](#top)


### `textureOverlay(textureImage, [config], [pg])`

Blend the given texture image onto the canvas.

The texture is repeated along the horizontal and vertical axes to cover the entire canvas (or context).

| Parameter | Type | Description |
| --- | --- | --- |
| `texture` | `p5.Image` | The texture image to blend over. |
| `config` | `Object` | (optional) Config object to configure the texture overlay. |
| `config.width` | `Number` | (optional) The width the texture image should have. (default: `textureImage.width`) |
| `config.height` | `Number` | (optional) The height the texture image should have. (default: `textureImage.height`) |
| `config.mode` | `Constant` | (optional) The blend mode that should be used to blend the texture over the canvas. Either `BLEND`, `DARKEST`, `LIGHTEST`, `DIFFERENCE`, `MULTIPLY`, `EXCLUSION`, `SCREEN`, `REPLACE`, `OVERLAY`, `HARD_LIGHT`, `SOFT_LIGHT`, `DODGE`, `BURN`, `ADD` or `NORMAL`. (default: `MULTIPLY`) |
| `config.reflect` | `Boolean` | (optional) Specifies whether the given texture image should reflect horizontally and vertically, in order to provide seamless continuity. (default: `false`) |
| `config.animate` | `Boolean\| Object` | (optional) Specifies whether the given texture image should be animated. (default: `false`) |
| `config.animate.atFrame` | `Number` | (optional) When animation is activated, the frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. (default: `2`) |
| `config.animate.amount` | `Number` | (optional) When animation is activated, the maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. (default: `min(width, height)`) |
| `pg` | `p5.Graphics` | (optional) The offscreen graphics buffer onto which the texture image should be drawn.<br><br>*Note: When using an offscreen graphics buffer, use the usual syntax `pg.textureOverlay(textureImage, config)`. Only in case `p5.Graphics.textureOverlay` could not be registered, use the alternative syntax `p5grain.textureOverlay(textureImage, config, pg)`.* |

[Go to top ⬆](#top)


### `textureAnimate(textureElement, [config])`

Animate the given texture element by randomly shifting its background position.

| Parameter | Type | Description |
| --- | --- | --- |
| `textureElement` | `HTMLElement\| SVGElement\| p5.Element` | The texture element to be animated. |
| `config` | `Object` | (optional) Config object to configure the texture animation. |
| `config.atFrame` | `Number` | (optional) The frame at which the texture should be shifted. When `atFrame` isn't specified, the texture is shifted every 2<sup>nd</sup> frame. (default: `2`) |
| `config.amount` | `Number` | (optional) The maximum amount of pixels by which the texture should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. When no amount is specified, the minimum of the main canvas `width` or `height` is used. (default: `min(width, height)`) |

[Go to top ⬆](#top)


<a id="limitations"></a>

## Limitations

* Safari: SVG element technique only works for browser window resolutions with less than 2<sup>20</sup> pixels (e.g. 1024 x 1024 pixels).
* Safari: SVG URL-encoded technique is currently unsupported.


<a id="support"></a>

## Support

If you need help or have questions about using p5.grain, you can find support through the following channels:

1. **GitHub Discussions**: Join the conversation and ask questions in the [Q&A section](https://github.com/meezwhite/p5.grain/discussions/categories/q-a)
2. **Direct Message on X (Twitter)**: Feel free to DM [@meezwhite](https://x.com/meezwhite)


<a id="contributing"></a>

## Contributing

Are you considering contributing to p5.grain? Check out our [contributing guidelines](./CONTRIBUTING.md).


<a id="license"></a>

## License

p5.grain is [MIT licensed](./LICENSE).


## Spread the Word

If you find p5.grain useful, we’d love for you to share it! Mentioning the library in your project description, tutorials, or social media posts helps others discover it and benefit from it. Thanks for spreading the word and showing your appreciation! 🙏
