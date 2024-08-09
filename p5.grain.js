/**!
 * p5.grain
 * 
 * @version 0.8.0
 * @license MIT
 * @copyright meezwhite, Gorilla Sun
 */
class P5Grain {
    version = '0.8.0';

    instance;
    /** @internal */
    ignoreWarnings = false;
    ignoreErrors = false;
    #overrideMethodArgument;
    /** @end */

    #random;
    #randomMinMax;
    #randomMode;
    #textureAnimate;
    #textureOverlay;

    constructor() {
        this.#prepareRandomMode('float');
        this.#textureAnimate = { frameCount: 0 };
        this.#textureOverlay = { frameCount: 0, tX_anchor: 0, tX: 0, tY: 0 };
    }

    /**
     * Setup and configure p5.grain features.
     * 
     * @example
     * <p>Pass a custom random function to be used internally.</p>
     * <code>
     *     p5grain.setup({ random: fxrand });
     * </code>
     * 
     * @example
     * <p>Configure internal random function to generate integers instead of floating-point numbers.</p>
     * <code>
     *     p5grain.setup({ randomMode: 'int' });
     * </code>
     * 
     * @example
     * <p>Configure internal random function to generate floats.</p>
     * <code>
     *     p5grain.setup({ randomMode: 'float' });
     * </code>
     * <p><em>Note: `randomMode` is `float` by default, so you only need to do the above if you have previously configured `randomMode` to something other than `float` and you now need to generate random floating-point numbers again.</em></p>
     * 
     * @example
     * <p>Ignore errors and warnings</p>
     * <code>
     *     p5grain.setup({
     *         ignoreErrors: true,
     *         ignoreWarnings: true,
     *     });
     * </code>
     * 
     * @method setup
     * 
     * @param {Object} [config] Config object to configure p5.grain features.
     * @param {function} [config.random] The random function that should be used for e.g. pixel manipulation, 
     *     texture animation, etc. Here you could use a custom deterministic random function (e.g. fxrand). 
     *     By default p5's random function is used.
     * @param {String} [config.randomMode] Specifies the mode of the internal random function.
     *     Either `float` for floating-point numbers or `int` for integers. (default: `float`)
     * @param {Object} [config.instance] Reference to a p5.js instance.
     * @param {Boolean} [config.ignoreWarnings] Specifies whether warnings should be ignored. (default: `false`)
     * @param {Boolean} [config.ignoreErrors] Specifies whether errors should be ignored. (default: `false`)
     */
    setup(config) {
        /** @internal */
        if (!this.#validateArguments('setup', arguments)) return;
        /** @end */
        if (typeof config === 'object') {
            if (typeof config.random === 'function') {
                this.#random = config.random;
            }
            if (typeof config.randomMode === 'string') {
                this.#prepareRandomMode(config.randomMode);
            }
            if (typeof config.instance === 'object') {
                this.instance = config.instance;
                if (this.instance !== null) {
                    this.#random = this.instance.random;
                }
            }
            /** @internal */
            if (typeof config.ignoreWarnings === 'boolean') {
                this.ignoreWarnings = config.ignoreWarnings;
            }
            if (typeof config.ignoreErrors === 'boolean') {
                this.ignoreErrors = config.ignoreErrors;
            } /** @end */
        }
        if (typeof this.#random === 'undefined' || this.instance === null) {
            this.#random = random;
        }
    }

    /**
     * Apply monochromatic grain.
     *
     * This method generates one random value per pixel. The random value ranges from -amount to +amount.
     * Each generated random value is added to every RGB(A) pixel channel.
     *
     * @method applyMonochromaticGrain
     * 
     * @param {Number} amount The amount of granularity that should be applied.
     * @param {Boolean} [alpha] Specifies whether the alpha channel should also be modified. (default: `false`)
     *     Note: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be manipulated.
     */
    applyMonochromaticGrain(amount, alpha, pg) {
        /** @internal */
        if (!this.#validateArguments('applyMonochromaticGrain', arguments)) return;
        /** @end */
        const _alpha = alpha || false;
        let density, _width, _height, _pixels;
        if (pg) {
            pg.loadPixels();
            density = pg.pixelDensity();
            _width = pg.width;
            _height = pg.height;
            _pixels = pg.pixels;
        } else {
            if (this.instance) {
                this.instance.loadPixels();
                density = this.instance.pixelDensity();
                _width = this.instance.width;
                _height = this.instance.height;
                _pixels = this.instance.pixels;
            } else {
                loadPixels();
                density = pixelDensity();
                _width = width;
                _height = height;
                _pixels = pixels;
            }
        }
        const total = 4 * (_width * density) * (_height * density);
        const { min, max } = this.#prepareRandomBounds(-amount, amount);
        for (let i = 0; i < total; i += 4) {
            const grainAmount = this.#randomMinMax(min, max);
            _pixels[i] = _pixels[i] + grainAmount;
            _pixels[i + 1] = _pixels[i + 1] + grainAmount;
            _pixels[i + 2] = _pixels[i + 2] + grainAmount;
            if (_alpha) {
                _pixels[i + 3] = _pixels[i + 3] + grainAmount;
            }
        }
        if (pg) {
            pg.updatePixels();
        } else {
            if (this.instance) {
                this.instance.updatePixels();
            } else {
                updatePixels();
            }
        }
    }

    /**
     * Apply chromatic grain.
     *
     * This method generates one random value per pixel channel. The random values range from -amount to +amount. 
     * Each generated random value is added to the respective RGB(A) channel of the pixel.
     *
     * @method applyChromaticGrain
     * 
     * @param {Number} amount The amount of granularity that should be applied.
     * @param {Boolean} [alpha] Specifies whether the alpha channel should also be modified. (default: `false`)
     *     Note: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be manipulated.
     */
    applyChromaticGrain(amount, alpha, pg) {
        /** @internal */
        if (!this.#validateArguments('applyChromaticGrain', arguments)) return;
        /** @end */
        const _alpha = alpha || false;
        let density, _width, _height, _pixels;
        if (pg) {
            pg.loadPixels();
            density = pg.pixelDensity();
            _width = pg.width;
            _height = pg.height;
            _pixels = pg.pixels;
        } else {
            if (this.instance) {
                this.instance.loadPixels();
                density = this.instance.pixelDensity();
                _width = this.instance.width;
                _height = this.instance.height;
                _pixels = this.instance.pixels;
            } else {
                loadPixels();
                density = pixelDensity();
                _width = width;
                _height = height;
                _pixels = pixels;
            }
        }
        const total = 4 * (_width * density) * (_height * density);
        const { min, max } = this.#prepareRandomBounds(-amount, amount);
        for (let i = 0; i < total; i += 4) {
            _pixels[i] = _pixels[i] + this.#randomMinMax(min, max);
            _pixels[i + 1] = _pixels[i + 1] + this.#randomMinMax(min, max);
            _pixels[i + 2] = _pixels[i + 2] + this.#randomMinMax(min, max);
            if (_alpha) {
                _pixels[i + 3] = _pixels[i + 3] + this.#randomMinMax(min, max);
            }
        }
        if (pg) {
            pg.updatePixels();
        } else {
            if (this.instance) {
                this.instance.updatePixels();
            } else {
                updatePixels();
            }
        }
    }

    /**
     * Loop through pixels and call the given callback function for every pixel.
     * 
     * Pixels are manipulated depending on the given callback function, unless read-only mode is enabled.
     * 
     * The callback function provides two arguments:
     * 1. index: the current pixel index
     * 2. total: the total indexes count
     * 
     * Read-only mode: updating pixels can be by-passed by setting the `shouldUpdate` argument to `false`.
     * It is however recommended to use `loopPixels` if you only want to loop through pixels.
     * 
     * @example
     * <p>Loop over all pixels and set the red channel of each pixel to a random value between 0 and 255:</p>
     * <code>
     *     tinkerPixels((index, total) => {
     *         pixels[index] = random(0, 255); // red channel
     *     });
     * </code>
     * 
     * @example
     * <p>Read-only mode:</p>
     * <code>
     *     tinkerPixels((index, total) => {
     *         // read-only mode
     *         // ...
     *     }, false); // <-- shouldUpdate = false
     * </code>
     *
     * @method tinkerPixels
     * 
     * @param {Function} callback The callback function that should be called on every pixel.
     * @param {Boolean} [shouldUpdate] Specifies whether the pixels should be updated. (default: `true`)
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be looped.
     */
    tinkerPixels(callback, shouldUpdate, pg) {
        /** @internal */
        if (!this.#validateArguments('tinkerPixels', arguments)) return;
        /** @end */
        shouldUpdate = shouldUpdate !== false;
        let density, _width, _height;
        if (pg) {
            pg.loadPixels();
            density = pg.pixelDensity();
            _width = pg.width;
            _height = pg.height;
        } else {
            if (this.instance) {
                this.instance.loadPixels();
                density = this.instance.pixelDensity();
                _width = this.instance.width;
                _height = this.instance.height;
            } else {
                loadPixels()
                density = pixelDensity();
                _width = width;
                _height = height;
            }
        }
        const total = 4 * (_width * density) * (_height * density);
        for (let i = 0; i < total; i += 4) {
            callback(i, total);
        }
        if (shouldUpdate) {
            if (pg) {
                pg.updatePixels();
            } else {
                if (this.instance) {
                    this.instance.updatePixels();
                } else {
                    updatePixels();
                }
            }
        }
    }

    /**
     * Loop through pixels and call the given callback function for every pixel without updating them (read-only mode).
     * 
     * In contrast to the `tinkerPixels` function, no pixel manipulations are performed with `loopPixels`. 
     * In other words `loopPixels` has the same effect as using `tinkerPixels` in read-only mode.
     * 
     * The callback function provides two arguments:
     * 1. index: the current pixel index
     * 2. total: the total indexes count
     * 
     * @example
     * <code>
     *     loopPixels((index, total) => {
     *         // read-only mode
     *         // ...
     *     });
     * </code>
     *
     * @method loopPixels
     * 
     * @param {Function} callback The callback function that should be called on every pixel.
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be looped.
     */
    loopPixels(callback, pg) {
        /** @internal */
        this.#overrideMethodArgument = 'loopPixels';
        /** @end */
        this.tinkerPixels(callback, false, pg);
    }

    /**
     * Animate the given texture element by randomly shifting its background position.
     * 
     * @method textureAnimate
     * 
     * @param {HTMLElement|SVGElement|p5.Element} textureElement The texture element to be animated.
     * @param {Object} [config] Config object to configure the texture animation.
     * @param {Number} [config.atFrame] The frame at which the texture should be shifted.
     *     When atFrame isn't specified, the texture is shifted every second frame. (default: `2`)
     * @param {Number} [config.amount] The maximum amount of pixels by which the texture should be shifted.
     *     The actual amount of pixels which the texture is shifted by is generated randomly.
     *     When no amount is specified, the minimum of the main canvas width or height is used. (default: `min(width, height)`)
     */
    textureAnimate(textureElement, config) {
        /** @internal */
        if (!this.#validateArguments('textureAnimate', arguments)) return;
        /** @end */
        const _atFrame = config && config.atFrame ? Math.round(config.atFrame) : 2;
        this.#textureAnimate.frameCount += 1;
        if (this.#textureAnimate.frameCount >= _atFrame) {
            const _amount = config && config.amount
                ? Math.round(config.amount)
                : (this.instance ? Math.min(this.instance.width, this.instance.height) : Math.min(width, height));
            const bgPosX_rand = this.#random() * _amount;
            const bgPosY_rand = this.#random() * _amount;
            const bgPosX = Math.floor(bgPosX_rand);
            const bgPosY = Math.floor(bgPosY_rand);
            const bgPos = `${bgPosX}px ${bgPosY}px`;
            if (textureElement instanceof HTMLElement) {
                textureElement.style.backgroundPosition = bgPos;
            } else if (textureElement instanceof SVGElement) {
                textureElement.style.top = `${-bgPosY}px`;
                textureElement.style.left = `${-bgPosX}px`;
            } else if (textureElement instanceof p5.Element) {
                textureElement.style('background-position', bgPos);
            }
            this.#textureAnimate.frameCount = 0;
        }
    }

    /**
     * Blend the given texture image onto the canvas.
     * 
     * The texture is repeated along the horizontal and vertical axes to cover the entire canvas or context.
     * 
     * @method textureOverlay
     * 
     * @param {p5.Image} texture The texture image to blend over.
     * @param {Object} [config] Config object to configure the texture overlay.
     * @param {Number} [config.width] The width the texture image should have. (default: textureImage.width`)
     * @param {Number} [config.height] The height the texture image should have. (default: `textureImage.height`)
     * @param {Constant} [config.mode] The blend mode that should be used to blend the texture over the canvas. 
     *     Either BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, 
     *     SOFT_LIGHT, DODGE, BURN, ADD or NORMAL. (default: MULTIPLY)
     * @param {Boolean} [config.reflect] Specifies whether the given texture image should reflect horizontally and 
     *     vertically, in order to provide seamless continuity. (default: `false`)
     * @param {Boolean|Object} [config.animate] Specifies whether the given texture image should be animated. (default: `false`)
     * @param {Number} [config.animate.atFrame] When animating, the frame at which the texture should be shifted.
     *     When atFrame isn't specified, the texture is shifted every second frame. (default: `2`)
     * @param {Number} [config.animate.amount] When animating, the maximum amount of pixels by which the texture 
     *     should be shifted. The actual amount of pixels which the texture is shifted by is generated randomly. 
     *     When no amount is specified, the minimum of the main canvas width or height is used. (default: `min(width, height)`)
     * @param {p5.Graphics} [pg] The offscreen graphics buffer onto which the texture image should be drawn.
     */
    textureOverlay(textureImage, config, pg) {
        /** @internal */
        if (!this.#validateArguments('textureOverlay', arguments)) return;
        /** @end */
        // flag whether drawing onto an offset graphics buffer
        const isGraphicsBuffer = pg instanceof p5.Graphics;
        // width and height of the canvas or context
        let _width, _height;
        if (isGraphicsBuffer) {
            _width = pg.width;
            _height = pg.height;
        } else {
            if (this.instance) {
                _width = this.instance.width;
                _height = this.instance.height;
            } else {
                _width = width;
                _height = height;
            }
        }
        // blend mode used to blend the texture over the canvas or context
        const _mode = config && config.mode ? config.mode : (this.instance ? this.instance.MULTIPLY : MULTIPLY);
        // should reflect flag
        const _reflect = config && config.reflect ? config.reflect : false;
        // should animate flag
        const _animate = config && config.animate ? config.animate : false;
        // animate atFrame
        const _animateAtFrame = (
            config && config.animate && config.animate.atFrame ? Math.round(config.animate.atFrame) : 2
        );
        // animate amount
        const _animateAmount = (
            config && config.animate && config.animate.amount
                ? Math.round(config.animate.amount)
                : Math.min(_width, _height)
        );
        // texture width
        const tW = config && typeof config.width === 'number' ? config.width : textureImage.width;
        // texture height
        const tH = config && typeof config.height === 'number' ? config.height : textureImage.height;
        // animate the texture coordinates
        if (_animate) {
            this.#textureOverlay.frameCount += 1;
            if (this.#textureOverlay.frameCount >= _animateAtFrame) {
                const tX_rand = this.#random() * _animateAmount;
                const tY_rand = this.#random() * _animateAmount;
                this.#textureOverlay.tX_anchor = -Math.floor(tX_rand);
                this.#textureOverlay.tY = -Math.floor(tY_rand);
                this.#textureOverlay.frameCount = 0;
            }
        }
        // texture current start x-coordinate
        let tX = this.#textureOverlay.tX_anchor;
        // texture current start y-coordinate
        let tY = this.#textureOverlay.tY;
        // flag that the first texture row is currently drawn
        let tRowFirst = true;
        // flag that the first texture column is currently drawn
        let tColFirst = true;
        if (pg) {
            pg.blendMode(_mode);
        } else {
            if (this.instance) {
                this.instance.blendMode(_mode);
            } else {
                blendMode(_mode);
            }
        }
        while (tY < _height) {
            while (tX < _width) {
                if (_reflect) {
                    if (!isGraphicsBuffer) {
                        this.instance ? this.instance.push() : push();
                    } else {
                        pg.push();
                    }
                    if (tRowFirst) {
                        if (tColFirst) {
                            if (!isGraphicsBuffer) {
                                this.instance
                                    ? this.instance.image(textureImage, tX, tY, tW, tH)
                                    : image(textureImage, tX, tY, tW, tH);
                            } else {
                                pg.image(textureImage, tX, tY, tW, tH);
                            }
                        } else { // tColSecond
                            if (!isGraphicsBuffer) {
                                if (this.instance) {
                                    this.instance.scale(-1, 1);
                                    this.instance.image(textureImage, -tX, tY, -tW, tH)
                                } else {
                                    scale(-1, 1);
                                    image(textureImage, -tX, tY, -tW, tH);
                                }
                            } else {
                                pg.scale(-1, 1);
                                pg.image(textureImage, -tX, tY, -tW, tH);
                            }
                        }
                    } else { // tRowSecond
                        if (tColFirst) {
                            if (!isGraphicsBuffer) {
                                if (this.instance) {
                                    this.instance.scale(1, -1);
                                    this.instance.image(textureImage, tX, -tY, tW, -tH);
                                } else {
                                    scale(1, -1);
                                    image(textureImage, tX, -tY, tW, -tH);
                                }
                            } else {
                                pg.scale(1, -1);
                                pg.image(textureImage, tX, -tY, tW, -tH);
                            }
                        } else { // tColSecond
                            if (!isGraphicsBuffer) {
                                if (this.instance) {
                                    this.instance.scale(-1, -1);
                                    this.instance.image(textureImage, -tX, -tY, -tW, -tH);
                                } else {
                                    scale(-1, -1);
                                    image(textureImage, -tX, -tY, -tW, -tH);
                                }
                            } else {
                                pg.scale(-1, -1);
                                pg.image(textureImage, -tX, -tY, -tW, -tH);
                            }
                        }
                    }
                    if (!isGraphicsBuffer) {
                        this.instance ? this.instance.pop() : pop();
                    } else {
                        pg.pop();
                    }
                } else {
                    if (!isGraphicsBuffer) {
                        this.instance
                            ? this.instance.image(textureImage, tX, tY, tW, tH)
                            : image(textureImage, tX, tY, tW, tH);
                    } else {
                        pg.image(textureImage, tX, tY, tW, tH);
                    }
                }
                tX += tW;
                if (tX >= _width) {
                    tColFirst = true;
                    tX = this.#textureOverlay.tX_anchor;
                    tY += tH;
                    break;
                } else {
                    tColFirst = !tColFirst;
                }
            }
            tRowFirst = !tRowFirst;
        }
        // reset blend mode
        if (pg) {
            pg.blendMode(this.instance ? this.instance.BLEND : BLEND)
        } else {
            this.instance ? this.instance.blendMode(this.instance.BLEND) : blendMode(BLEND);
        }
        // reset context
        if (isGraphicsBuffer) {
            pg.reset();
        }
    }


    /*******************
     * Private methods *
     *******************/

    /**
     * Prepare the random mode.
     * 
     * @private
     * @method prepareRandomMode
     * 
     * @param {String} mode The mode in which the internal random function should operate.
     */
    #prepareRandomMode(mode) {
        switch (mode) {
            case 'int':
                this.#randomMode = 1;
                this.#randomMinMax = this.#randomInt;
                break;
            case 'float':
                this.#randomMode = 0;
                this.#randomMinMax = this.#randomFloat;
                break;
            default: break;
        }
    }

    /**
     * Prepare the random bounds based on the `randomMode`.
     * 
     * @private
     * @method prepareRandomBounds
     * 
     * @param {Number} min The lower bounds.
     * @param {Number} max The upper bounds.
     * @param {Number} value
     */
    #prepareRandomBounds(min, max) {
        if (this.#randomMode == 1) { // randomInt
            return { min: Math.ceil(min), max: Math.floor(max) };
        }
        return { min, max }; // randomFloat
    }

    /**
     * Generate a random integer between the prepared bounds inclusively.
     * 
     * @private
     * @method randomInt
     * 
     * @param {Number} min The lower bounds.
     * @param {Number} max The upper bounds.
     * @returns {Number}
     */
    #randomInt(min, max) {
        return Math.floor(this.#random() * (max - min + 1) + min);
    }

    /**
     * Generate a random float between the prepared bounds.
     * 
     * @private
     * @method randomFloat
     * 
     * @param {Number} min The lower bounds.
     * @param {Number} max The upper bounds.
     * @returns {Number}
     */
    #randomFloat(min, max) {
        return this.#random() * (max - min) + min;
    }


    /********************
     * Internal methods *
     ********************/

    /** @internal */
    /**
     * Logs the given message as an error to the console and returns `false`.
     * 
     * @private
     * @method error
     * 
     * @param {String} message The error message to be logged to the console.
     * @returns {Boolean} `false`
     */
    #error(message) {
        console.error(`[p5.grain] Error: ${message}`);
        return false;
    }

    /**
     * Logs the given message as a warning to the console.
     * 
     * @private
     * @method _warn
     * 
     * @param {String} message The warning message to be logged to the console.
     */
    _warn(message) {
        console.warn(`[p5.grain] Warning: ${message}`);
    }

    /**
     * Checks the validity of the given arguments to the respective method.
     * 
     * Unless `ignoreErrors` is `false`, errors will be thrown when necessary.
     * 
     * @private
     * @method validateArguments
     * 
     * @param {String} method Name of the method
     * @param {Array} args User given arguments to the respective method
     */
    #validateArguments(method, args) {
        if (!this.ignoreErrors) {
            if (typeof this.#overrideMethodArgument === 'string') {
                method = this.#overrideMethodArgument;
                this.#overrideMethodArgument = undefined;
            }
            switch (method) {
                case 'setup':
                    if (
                        typeof args[0] !== 'undefined'
                        && typeof args[0] !== 'object'
                    ) {
                        return this.#error(`The optional config argument passed to p5grain.${method}() must be of type object.`);
                    }
                    if (typeof args[0] === 'object') {
                        if (
                            typeof args[0].random !== 'undefined'
                            && typeof args[0].random !== 'function'
                        ) {
                            return this.#error(`The optional config.random property passed to p5grain.${method}() must be of type function.`);
                        }
                        if (
                            typeof args[0].randomMode !== 'undefined'
                            && !(args[0].randomMode === 'int' || args[0].randomMode === 'float')
                        ) {
                            return this.#error(`The optional config.randomMode property passed to p5grain.${method}() must be either 'int' or 'float'.`);
                        }
                        if (
                            typeof args[0].ignoreErrors !== 'undefined'
                            && typeof args[0].ignoreErrors !== 'boolean'
                        ) {
                            return this.#error(`The optional config.ignoreErrors property passed to p5grain.${method}() must be of type boolean.`);
                        }
                        if (
                            typeof args[0].ignoreWarnings !== 'undefined'
                            && typeof args[0].ignoreWarnings !== 'boolean'
                        ) {
                            return this.#error(`The optional config.ignoreWarnings property passed to p5grain.${method}() must be of type boolean.`);
                        }
                        if (
                            typeof args[0].instance !== 'undefined'
                            && typeof args[0].instance !== 'object'
                        ) {
                            return this.#error(`The optional config.instance property passed to p5grain.${method}() must be either of type object or null.`);
                        }
                    }
                    break;
                case 'applyMonochromaticGrain':
                case 'applyChromaticGrain':
                    if (typeof args[0] !== 'number') {
                        return this.#error(`The amount argument passed to ${method}() must be of type number.`);
                    }
                    if (
                        typeof args[1] !== 'undefined'
                        && typeof args[1] !== 'boolean'
                    ) {
                        return this.#error(`The optional alpha argument passed to ${method}() must be of type boolean.`);
                    }
                    if (
                        typeof args[2] !== 'undefined'
                        && !(args[2] instanceof p5.Graphics || args[2] instanceof p5.Image)
                    ) {
                        return this.#error(`The offscreen graphics buffer for ${method}() must be an instance of p5.Graphics or p5.Image.`);
                    }
                    break;
                case 'tinkerPixels':
                case 'loopPixels':
                    if (typeof args[0] !== 'function') {
                        return this.#error(`The callback argument passed to ${method}() must be of type function.`);
                    }
                    if (
                        typeof args[1] !== 'undefined'
                        && typeof args[1] !== 'boolean'
                    ) {
                        return this.#error(`The optional shouldUpdate argument for ${method}() must be an instance of boolean.`);
                    }
                    if (
                        typeof args[2] !== 'undefined'
                        && !(args[2] instanceof p5.Graphics || args[2] instanceof p5.Image)
                    ) {
                        return this.#error(`The offscreen graphics buffer for ${method}() must be an instance of p5.Graphics or p5.Image.`);
                    }
                    break;
                case 'textureAnimate':
                    if (
                        !(
                            args[0] instanceof HTMLElement
                            || args[0] instanceof SVGElement
                            || args[0] instanceof p5.Element
                        )
                    ) {
                        return this.#error(`The textureElement argument passed to ${method}() must be an instance of HTMLElement, SVGElement or p5.Element.`);
                    }
                    if (
                        typeof args[1] !== 'undefined'
                        && typeof args[1] !== 'object'
                    ) {
                        return this.#error(`The optional config argument passed to ${method}() must be of type object.`);
                    }
                    if (typeof args[1] === 'object') {
                        if (
                            typeof args[1].atFrame !== 'undefined'
                            && typeof args[1].atFrame !== 'number'
                        ) {
                            return this.#error(`The optional config.atFrame property passed to ${method}() must be of type number.`);
                        }
                        if (
                            typeof args[1].amount !== 'undefined'
                            && typeof args[1].amount !== 'number'
                        ) {
                            return this.#error(`The optional config.amount argument passed to ${method}() must be of type number.`);
                        }
                    }
                    break;
                case 'textureOverlay':
                    if (!(args[0] instanceof p5.Image)) {
                        return this.#error(`The texture argument passed to ${method}() must be an instance of p5.Image.`);
                    }
                    if (
                        typeof args[1] !== 'undefined'
                        && typeof args[1] !== 'object'
                    ) {
                        return this.#error(`The optional config argument passed to ${method}() must be of type object.`);
                    }
                    if (typeof args[1] === 'object') {
                        if (
                            typeof args[1].width !== 'undefined'
                            && typeof args[1].width !== 'number'
                        ) {
                            return this.#error(`The optional config.width property passed to ${method}() must be of type number.`);
                        }
                        if (
                            typeof args[1].height !== 'undefined'
                            && typeof args[1].height !== 'number'
                        ) {
                            return this.#error(`The optional config.height property passed to ${method}() must be of type number.`);
                        }
                        if (
                            typeof args[1].mode !== 'undefined'
                            && typeof args[1].mode !== 'string'
                        ) {
                            return this.#error(`The optional config.mode property passed to ${method}() must be of type string.`);
                        }
                        if (
                            typeof args[1].reflect !== 'undefined'
                            && typeof args[1].reflect !== 'boolean'
                        ) {
                            return this.#error(`The optional config.reflect property passed to ${method}() must be of type boolean.`);
                        }
                    }
                    if (
                        typeof args[2] !== 'undefined'
                        && !(args[2] instanceof p5.Graphics)
                    ) {
                        return this.#error(`The offscreen graphics buffer for ${method}() must be an instance of p5.Graphics.`);
                    }
                    break;
                default: break;
            }
        }
        return true;
    }
    /** @end */
}

const p5grain = new P5Grain();

// Register applyMonochromaticGrain()
/** @internal */
if (!p5.prototype.hasOwnProperty('applyMonochromaticGrain')) { /** @end */
    p5.prototype.applyMonochromaticGrain = function (amount, alpha) {
        return p5grain.applyMonochromaticGrain(amount, alpha);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('applyMonochromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyMonochromaticGrain() instead.');
} /** @end */

// Register p5.Graphics.applyMonochromaticGrain()
/** @internal */
if (!p5.Graphics.prototype.hasOwnProperty('applyMonochromaticGrain')) { /** @end */
    p5.Graphics.prototype.applyMonochromaticGrain = function (amount, alpha) {
        return p5grain.applyMonochromaticGrain(amount, alpha, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Graphics.applyMonochromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyMonochromaticGrain(amount, alpha, pg) instead.');
} /** @end */

// Register p5.Image.applyMonochromaticGrain()
/** @internal */
if (!p5.Image.prototype.hasOwnProperty('applyMonochromaticGrain')) { /** @end */
    p5.Image.prototype.applyMonochromaticGrain = function (amount, alpha) {
        return p5grain.applyMonochromaticGrain(amount, alpha, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Image.applyMonochromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyMonochromaticGrain(amount, alpha, img) instead.');
} /** @end */

// Register applyChromaticGrain()
/** @internal */
if (!p5.prototype.hasOwnProperty('applyChromaticGrain')) { /** @end */
    p5.prototype.applyChromaticGrain = function (amount, alpha) {
        return p5grain.applyChromaticGrain(amount, alpha);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('applyChromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyChromaticGrain() instead.');
} /** @end */

// Register p5.Graphics.applyChromaticGrain()
/** @internal */
if (!p5.Graphics.prototype.hasOwnProperty('applyChromaticGrain')) { /** @end */
    p5.Graphics.prototype.applyChromaticGrain = function (amount, alpha) {
        return p5grain.applyChromaticGrain(amount, alpha, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Graphics.applyChromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyChromaticGrain(amount, alpha, pg) instead.');
} /** @end */

// Register p5.Image.applyChromaticGrain()
/** @internal */
if (!p5.Image.prototype.hasOwnProperty('applyChromaticGrain')) { /** @end */
    p5.Image.prototype.applyChromaticGrain = function (amount, alpha) {
        return p5grain.applyChromaticGrain(amount, alpha, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Image.applyChromaticGrain() could not be registered, since it\'s already defined. Use p5grain.applyChromaticGrain(amount, alpha, img) instead.');
} /** @end */

// Register tinkerPixels()
/** @internal */
if (!p5.prototype.hasOwnProperty('tinkerPixels')) { /** @end */
    p5.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('tinkerPixels() could not be registered, since it\'s already defined. Use p5grain.tinkerPixels() instead.');
} /** @end */

// Register p5.Graphics.tinkerPixels()
/** @internal */
if (!p5.Graphics.prototype.hasOwnProperty('tinkerPixels')) { /** @end */
    p5.Graphics.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Graphics.tinkerPixels() could not be registered, since it\'s already defined. Use p5grain.tinkerPixels(callback, shouldUpdate, pg) instead.');
} /** @end */

// Register p5.Image.tinkerPixels()
/** @internal */
if (!p5.Image.prototype.hasOwnProperty('tinkerPixels')) { /** @end */
    p5.Image.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Image.tinkerPixels() could not be registered, since it\'s already defined. Use p5grain.tinkerPixels(callback, shouldUpdate, img) instead.');
} /** @end */

// Register loopPixels()
/** @internal */
if (!p5.prototype.hasOwnProperty('loopPixels')) { /** @end */
    p5.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('loopPixels() could not be registered, since it\'s already defined. Use p5grain.loopPixels() instead.');
} /** @end */

// Register p5.Graphics.loopPixels()
/** @internal */
if (!p5.Graphics.prototype.hasOwnProperty('loopPixels')) { /** @end */
    p5.Graphics.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Graphics.loopPixels() could not be registered, since it\'s already defined. Use p5grain.loopPixels(callback, pg) instead.');
} /** @end */

// Register p5.Image.loopPixels()
/** @internal */
if (!p5.Image.prototype.hasOwnProperty('loopPixels')) { /** @end */
    p5.Image.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Image.loopPixels() could not be registered, since it\'s already defined. Use p5grain.loopPixels(callback, img) instead.');
} /** @end */

// Register textureAnimate()
/** @internal */
if (!p5.prototype.hasOwnProperty('textureAnimate')) { /** @end */
    p5.prototype.textureAnimate = function (textureElement, config) {
        return p5grain.textureAnimate(textureElement, config);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('textureAnimate() could not be registered, since it\'s already defined. Use p5grain.textureAnimate() instead.');
} /** @end */

// Register textureOverlay()
/** @internal */
if (!p5.prototype.hasOwnProperty('textureOverlay')) { /** @end */
    p5.prototype.textureOverlay = function (textureImage, config) {
        return p5grain.textureOverlay(textureImage, config);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('textureOverlay() could not be registered, since it\'s already defined. Use p5grain.textureOverlay() instead.');
} /** @end */

// Register p5.Graphics.textureOverlay()
/** @internal */
if (!p5.Graphics.prototype.hasOwnProperty('textureOverlay')) { /** @end */
    p5.Graphics.prototype.textureOverlay = function (textureImage, config) {
        return p5grain.textureOverlay(textureImage, config, this);
    };
/** @internal */
} else if (!p5grain.ignoreWarnings) {
    p5grain._warn('p5.Graphics.textureOverlay() could not be registered, since it\'s already defined. Use p5grain.textureOverlay(textureImage, config, pg) instead.');
} /** @end */
