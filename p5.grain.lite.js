/**!
 * p5.grain
 * 
 * @version 0.8.0
 * @license MIT
 * @copyright Joseph Miclaus, Gorilla Sun
 */
class P5Grain {
    version = '0.8.0';

    #instance;
    /** @lite */

    #random;
    #randomMinMax;
    #randomMode;
    #pixels;
    #pixelsCount;
    #contextWidth;
    #contextHeight;
    #contextDensity;
    #textureAnimate_frameCount = 0;
    #textureOverlay_frameCount = 0;
    #textureOverlay_tX = 0;
    #textureOverlay_tY = 0;

    constructor() {
        this.#prepareRandomMode('float');
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
     * @param {p5} [config.instance] Reference to a p5 instance.
     * @param {Boolean} [config.ignoreWarnings] Specifies whether warnings should be ignored. (default: `false`)
     * @param {Boolean} [config.ignoreErrors] Specifies whether errors should be ignored. (default: `false`)
     */
    setup(config) {
        /** @lite */
        if (typeof config === 'object') {
            if (typeof config.random === 'function') {
                this.#random = config.random;
            }
            if (typeof config.randomMode === 'string') {
                this.#prepareRandomMode(config.randomMode);
            }
            if (typeof config.instance === 'object') {
                this.#instance = config.instance;
                if (this.#instance !== null) {
                    this.#random = this.#instance.random;
                }
            }
            /** @lite */
        }
        if (typeof this.#random === 'undefined' || this.#instance === null) {
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
     * @param {Boolean} [shouldUpdateAlpha] Specifies whether the alpha channel should also be modified. (default: `false`)
     *     Note: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be manipulated.
     */
    applyMonochromaticGrain(amount, shouldUpdateAlpha, pg) {
        /** @lite */
        shouldUpdateAlpha = shouldUpdateAlpha || false;
        this.#loadPixels(pg);
        const [min, max] = this.#prepareRandomBounds(-amount, amount);
        const pixels = this.#pixels;
        const pixelsLength = pixels.length;
        let offset, r, g, b, a;
        for (let i = 0; i < pixelsLength; i++) {
            offset = this.#randomMinMax(min, max);
            // Destructure the current 32-bit pixel value into its RGBA components
            r = pixels[i] & 0xff;
            g = (pixels[i] >> 8) & 0xff;
            b = (pixels[i] >> 16) & 0xff;
            a = (pixels[i] >> 24) & 0xff;
            // Clamp the RGBA components between 0 and 255
            r = Math.max(0, Math.min(255, r + offset));
            g = Math.max(0, Math.min(255, g + offset));
            b = Math.max(0, Math.min(255, b + offset));
            if (shouldUpdateAlpha) {
                a = Math.max(0, Math.min(255, a + offset));
            }
            // Constructs a 32-bit pixel value from RGBA components.
            pixels[i] = (a << 24) | (b << 16) | (g << 8) | r;
        }
        this.#updatePixels(pg);
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
     * @param {Boolean} [shouldUpdateAlpha] Specifies whether the alpha channel should also be modified. (default: `false`)
     *     Note: modifying the alpha channel could have unintended consequences. Only use if you are confident in what you are doing.
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be manipulated.
     */
    applyChromaticGrain(amount, shouldUpdateAlpha, pg) {
        /** @lite */
        shouldUpdateAlpha = shouldUpdateAlpha || false;
        this.#loadPixels(pg);
        const [min, max] = this.#prepareRandomBounds(-amount, amount);
        const pixels = this.#pixels;
        const pixelsLength = pixels.length;
        let r, g, b, a;
        for (let i = 0; i < pixelsLength; i++) {
            // Destructure the current 32-bit pixel value into its RGBA components
            r = pixels[i] & 0xff;
            g = (pixels[i] >> 8) & 0xff;
            b = (pixels[i] >> 16) & 0xff;
            a = (pixels[i] >> 24) & 0xff;
            // Clamp the RGBA components between 0 and 255
            r = Math.max(0, Math.min(255, r + this.#randomMinMax(min, max)));
            g = Math.max(0, Math.min(255, g + this.#randomMinMax(min, max)));
            b = Math.max(0, Math.min(255, b + this.#randomMinMax(min, max)));
            if (shouldUpdateAlpha) {
                a = Math.max(0, Math.min(255, a + this.#randomMinMax(min, max)));
            }
            // Constructs a 32-bit pixel value from RGBA components.
            pixels[i] = (a << 24) | (b << 16) | (g << 8) | r;
        }
        this.#updatePixels(pg);
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
        /** @lite */
        shouldUpdate = shouldUpdate !== false;
        let density, _width, _height;
        if (pg) {
            pg.loadPixels();
            density = pg.pixelDensity();
            _width = pg.width;
            _height = pg.height;
        } else {
            if (this.#instance) {
                this.#instance.loadPixels();
                density = this.#instance.pixelDensity();
                _width = this.#instance.width;
                _height = this.#instance.height;
            } else {
                loadPixels()
                density = pixelDensity();
                _width = width;
                _height = height;
            }
        }
        const channels = 4;
        const total = channels * (_width * density) * (_height * density);
        for (let i = 0; i < total; i += channels) {
            callback(i, total);
        }
        if (shouldUpdate) {
            this.#updatePixels(pg);
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
        /** @lite */
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
        /** @lite */
        const _atFrame = config && config.atFrame ? Math.round(config.atFrame) : 2;
        this.#textureAnimate_frameCount += 1;
        if (this.#textureAnimate_frameCount >= _atFrame) {
            const _amount = config && config.amount
                ? Math.round(config.amount)
                : (this.#instance
                    ? Math.min(this.#instance.width, this.#instance.height)
                    : Math.min(width, height)
                );
            const bgPosX_rand = this.#random() * _amount;
            const bgPosY_rand = this.#random() * _amount;
            const bgPosX = Math.trunc(bgPosX_rand);
            const bgPosY = Math.trunc(bgPosY_rand);
            const bgPos = `${bgPosX}px ${bgPosY}px`;
            if (textureElement instanceof HTMLElement) {
                textureElement.style.backgroundPosition = bgPos;
            } else if (textureElement instanceof SVGElement) {
                textureElement.style.top = `${-bgPosY}px`;
                textureElement.style.left = `${-bgPosX}px`;
            } else if (textureElement instanceof p5.Element) {
                textureElement.style('background-position', bgPos);
            }
            this.#textureAnimate_frameCount = 0;
        }
    }

    /**
     * Blend the given texture image onto the canvas.
     * 
     * The texture is repeated along the horizontal and vertical axes to cover the entire canvas or context.
     * 
     * @method textureOverlay
     * 
     * @param {p5.Image|p5.Graphics} texture The texture image to blend over.
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
        /** @lite */
        // flag whether drawing onto an offset graphics buffer
        const isGraphicsBuffer = pg instanceof p5.Graphics;
        // width and height of the canvas or context
        let _width, _height;
        if (isGraphicsBuffer) {
            _width = pg.width;
            _height = pg.height;
        } else {
            if (this.#instance) {
                _width = this.#instance.width;
                _height = this.#instance.height;
            } else {
                _width = width;
                _height = height;
            }
        }
        // blend mode used to blend the texture over the canvas or context
        const _mode = config && config.mode ? config.mode : (this.#instance ? this.#instance.MULTIPLY : MULTIPLY);
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
            this.#textureOverlay_frameCount += 1;
            if (this.#textureOverlay_frameCount >= _animateAtFrame) {
                const tX_rand = this.#random() * _animateAmount;
                const tY_rand = this.#random() * _animateAmount;
                this.#textureOverlay_tX = -Math.trunc(tX_rand);
                this.#textureOverlay_tY = -Math.trunc(tY_rand);
                this.#textureOverlay_frameCount = 0;
            }
        }
        // texture current start x-coordinate
        let tX = this.#textureOverlay_tX;
        // texture current start y-coordinate
        let tY = this.#textureOverlay_tY;
        // flag that the first texture row is currently drawn
        let tRowFirst = true;
        // flag that the first texture column is currently drawn
        let tColFirst = true;
        if (pg) {
            pg.blendMode(_mode);
        } else if (this.#instance) {
            this.#instance.blendMode(_mode);
        } else {
            blendMode(_mode);
        }
        while (tY < _height) {
            while (tX < _width) {
                if (_reflect) {
                    if (!isGraphicsBuffer) {
                        this.#instance ? this.#instance.push() : push();
                    } else {
                        pg.push();
                    }
                    if (tRowFirst) {
                        if (tColFirst) {
                            if (!isGraphicsBuffer) {
                                this.#instance
                                    ? this.#instance.image(textureImage, tX, tY, tW, tH)
                                    : image(textureImage, tX, tY, tW, tH);
                            } else {
                                pg.image(textureImage, tX, tY, tW, tH);
                            }
                        } else { // tColSecond
                            if (!isGraphicsBuffer) {
                                if (this.#instance) {
                                    this.#instance.scale(-1, 1);
                                    this.#instance.image(textureImage, -tX, tY, -tW, tH)
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
                                if (this.#instance) {
                                    this.#instance.scale(1, -1);
                                    this.#instance.image(textureImage, tX, -tY, tW, -tH);
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
                                if (this.#instance) {
                                    this.#instance.scale(-1, -1);
                                    this.#instance.image(textureImage, -tX, -tY, -tW, -tH);
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
                        this.#instance ? this.#instance.pop() : pop();
                    } else {
                        pg.pop();
                    }
                } else {
                    if (!isGraphicsBuffer) {
                        this.#instance
                            ? this.#instance.image(textureImage, tX, tY, tW, tH)
                            : image(textureImage, tX, tY, tW, tH);
                    } else {
                        pg.image(textureImage, tX, tY, tW, tH);
                    }
                }
                tX += tW;
                if (tX >= _width) {
                    tColFirst = true;
                    tX = this.#textureOverlay_tX;
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
            pg.blendMode(this.#instance ? this.#instance.BLEND : BLEND)
        } else if (this.#instance) {
            this.#instance.blendMode(this.#instance.BLEND);
        } else {
            blendMode(BLEND);
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
                // this.#randomMinMax = (min, max) => Math.floor(this.#random() * (max - min + 1) + min);
                this.#randomMinMax = this.#randomInt;
                break;
            case 'float':
                this.#randomMode = 0;
                // this.#randomMinMax = (min, max) => this.#random() * (max - min) + min;
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
     * @returns {Array}
     */
    #prepareRandomBounds(min, max) {
        if (this.#randomMode == 1) { // randomInt
            return [Math.ceil(min), Math.floor(max)];
        }
        return [min, max]; // randomFloat
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

    /**
     * Loads the pixel data from the appropriate source (global context, offscreen buffer, instance).
     * 
     * @private
     * @method loadPixels
     * 
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be loaded.
     */
    #loadPixels(pg) {
        /**
         * Initializes pixel data and context properties.
         * 
         * @private
         * @function setPixelsData
         * 
         * @param {Uint8ClampedArray} buffer The pixel data buffer.
         * @param {Number} width The width of the context.
         * @param {Number} height The height of the context.
         * @param {Number} density The density of the context.
         */
        const setPixelsData = (buffer, width, height, density) => {
            this.#pixels = new Uint32Array(buffer);
            this.#contextWidth = width;
            this.#contextHeight = height;
            this.#contextDensity = density;
            this.#pixelsCount = width * height;
        };
        if (pg) {
            pg.loadPixels();
            setPixelsData(pg.pixels.buffer, pg.width, pg.height, pg.pixelDensity());
        } else if (this.#instance) {
            this.#instance.loadPixels();
            setPixelsData(this.#instance.pixels.buffer, this.#instance.width, this.#instance.height, this.#instance.pixelDensity());
        } else {
            loadPixels();
            setPixelsData(pixels.buffer, width, height, pixelDensity());
        }
    }

    /**
     * Updates the pixels at the appropriate source (global cointext, offscreen buffer, instance).
     * 
     * @private
     * @method updatePixels
     * 
     * @param {p5.Graphics|p5.Image} [pg] The offscreen graphics buffer or image whose pixels should be updated.
     */
    #updatePixels(pg) {
        if (pg) {
            pg.updatePixels();
        } else if (this.#instance) {
            this.#instance.updatePixels();
        } else {
            updatePixels();
        }
    }


    /********************
     * Internal methods *
     ********************/

    /** @lite */
}

const p5grain = new P5Grain();

// Register applyMonochromaticGrain()
/** @lite */
    p5.prototype.applyMonochromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyMonochromaticGrain(amount, shouldUpdateAlpha);
    };
/** @lite */

// Register p5.Graphics.applyMonochromaticGrain()
/** @lite */
    p5.Graphics.prototype.applyMonochromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyMonochromaticGrain(amount, shouldUpdateAlpha, this);
    };
/** @lite */

// Register p5.Image.applyMonochromaticGrain()
/** @lite */
    p5.Image.prototype.applyMonochromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyMonochromaticGrain(amount, shouldUpdateAlpha, this);
    };
/** @lite */

// Register applyChromaticGrain()
/** @lite */
    p5.prototype.applyChromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyChromaticGrain(amount, shouldUpdateAlpha);
    };
/** @lite */

// Register p5.Graphics.applyChromaticGrain()
/** @lite */
    p5.Graphics.prototype.applyChromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyChromaticGrain(amount, shouldUpdateAlpha, this);
    };
/** @lite */

// Register p5.Image.applyChromaticGrain()
/** @lite */
    p5.Image.prototype.applyChromaticGrain = function (amount, shouldUpdateAlpha) {
        return p5grain.applyChromaticGrain(amount, shouldUpdateAlpha, this);
    };
/** @lite */

// Register tinkerPixels()
/** @lite */
    p5.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate);
    };
/** @lite */

// Register p5.Graphics.tinkerPixels()
/** @lite */
    p5.Graphics.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate, this);
    };
/** @lite */

// Register p5.Image.tinkerPixels()
/** @lite */
    p5.Image.prototype.tinkerPixels = function (callback, shouldUpdate) {
        return p5grain.tinkerPixels(callback, shouldUpdate, this);
    };
/** @lite */

// Register loopPixels()
/** @lite */
    p5.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate);
    };
/** @lite */

// Register p5.Graphics.loopPixels()
/** @lite */
    p5.Graphics.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate, this);
    };
/** @lite */

// Register p5.Image.loopPixels()
/** @lite */
    p5.Image.prototype.loopPixels = function (callback, shouldUpdate) {
        return p5grain.loopPixels(callback, shouldUpdate, this);
    };
/** @lite */

// Register textureAnimate()
/** @lite */
    p5.prototype.textureAnimate = function (textureElement, config) {
        return p5grain.textureAnimate(textureElement, config);
    };
/** @lite */

// Register textureOverlay()
/** @lite */
    p5.prototype.textureOverlay = function (textureImage, config) {
        return p5grain.textureOverlay(textureImage, config);
    };
/** @lite */

// Register p5.Graphics.textureOverlay()
/** @lite */
    p5.Graphics.prototype.textureOverlay = function (textureImage, config) {
        return p5grain.textureOverlay(textureImage, config, this);
    };
/** @lite */
