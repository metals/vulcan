
  
    Polymer('paper-icon-button', {

      publish: {

        /**
         * If true, the ripple expands to a square to fill the containing box.
         *
         * @attribute fill
         * @type boolean
         * @default false
         */
        fill: {value: false, reflect: true}

      },

      ready: function() {
        this.$.ripple.classList.add('recenteringTouch');
        this.fillChanged();
      },

      fillChanged: function() {
        this.$.ripple.classList.toggle('circle', !this.fill);
      },

      iconChanged: function(oldIcon) {
        if (!this.label) {
          this.setAttribute('aria-label', this.icon);
        }
      }

    });
    
  ;

    Polymer('paper-fab', {

      publish: {

        /**
         * See [`<paper-button>`](../paper-button).
         *
         * @attribute raisedButton
         * @type boolean
         * @default true
         */
        raisedButton: {value: true, reflect: true}

      }

    });
  ;


  (function() {

    var paperInput = CoreStyle.g.paperInput = CoreStyle.g.paperInput || {};
    paperInput.focusedColor = '#4059a9';
    paperInput.invalidColor = '#d34336';

    Polymer('paper-input', {

      /**
       * The label for this input. It normally appears as grey text inside
       * the text input and disappears once the user enters text.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',

      /**
       * If true, the label will "float" above the text input once the
       * user enters text instead of disappearing.
       *
       * @attribute floatingLabel
       * @type boolean
       * @default false
       */
      floatingLabel: false,

      /**
       * (multiline only) If set to a non-zero value, the height of this
       * text input will grow with the value changes until it is maxRows
       * rows tall. If the maximum size does not fit the value, the text
       * input will scroll internally.
       *
       * @attribute maxRows
       * @type number
       * @default 0
       */
      maxRows: 0,

      /**
       * The message to display if the input value fails validation. If this
       * is unset or the empty string, a default message is displayed depending
       * on the type of validation error.
       *
       * @attribute error
       * @type string
       */
      error: '',

      focused: false,
      pressed: false,

      attached: function() {
        if (this.multiline) {
          this.resizeInput();
          window.requestAnimationFrame(function() {
            this.$.underlineContainer.classList.add('animating');
          }.bind(this));
        }
      },

      resizeInput: function() {
        var height = this.$.inputClone.getBoundingClientRect().height;
        var bounded = this.maxRows > 0 || this.rows > 0;
        if (bounded) {
          var minHeight = this.$.minInputHeight.getBoundingClientRect().height;
          var maxHeight = this.$.maxInputHeight.getBoundingClientRect().height;
          height = Math.max(minHeight, Math.min(height, maxHeight));
        }
        this.$.inputContainer.style.height = height + 'px';
        this.$.underlineContainer.style.top = height + 'px';
      },

      prepareLabelTransform: function() {
        var toRect = this.$.floatedLabelSpan.getBoundingClientRect();
        var fromRect = this.$.labelSpan.getBoundingClientRect();
        if (toRect.width !== 0) {
          this.$.label.cachedTransform = 'scale(' + (toRect.width / fromRect.width) + ') ' +
            'translateY(' + (toRect.bottom - fromRect.bottom) + 'px)';
        }
      },

      toggleLabel: function(force) {
        var v = force !== undefined ? force : this.inputValue;

        if (!this.floatingLabel) {
          this.$.label.classList.toggle('hidden', v);
        }

        if (this.floatingLabel && !this.focused) {
          this.$.label.classList.toggle('hidden', v);
          this.$.floatedLabel.classList.toggle('hidden', !v);
        }
      },

      rowsChanged: function() {
        if (this.multiline && !isNaN(parseInt(this.rows))) {
          this.$.minInputHeight.innerHTML = '';
          for (var i = 0; i < this.rows; i++) {
            this.$.minInputHeight.appendChild(document.createElement('br'));
          }
          this.resizeInput();
        }
      },

      maxRowsChanged: function() {
        if (this.multiline && !isNaN(parseInt(this.maxRows))) {
          this.$.maxInputHeight.innerHTML = '';
          for (var i = 0; i < this.maxRows; i++) {
            this.$.maxInputHeight.appendChild(document.createElement('br'));
          }
          this.resizeInput();
        }
      },

      inputValueChanged: function() {
        this.super();

        if (this.multiline) {
          var escaped = this.inputValue.replace(/\n/gm, '<br>');
          if (!escaped || escaped.lastIndexOf('<br>') === escaped.length - 4) {
            escaped += '&nbsp';
          }
          this.$.inputCloneSpan.innerHTML = escaped;
          this.resizeInput();
        }

        this.toggleLabel();
      },

      labelChanged: function() {
        if (this.floatingLabel && this.$.floatedLabel && this.$.label) {
          // If the element is created programmatically, labelChanged is called before
          // binding. Run the measuring code in async so the DOM is ready.
          this.async(function() {
            this.prepareLabelTransform();
          });
        }
      },

      placeholderChanged: function() {
        this.label = this.placeholder;
      },

      inputFocusAction: function() {
        if (!this.pressed) {
          if (this.floatingLabel) {
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
          }
          this.$.label.classList.add('hidden');
          this.$.underlineHighlight.classList.add('focused');
          this.$.caret.classList.add('focused');

          this.super(arguments);
        }
        this.focused = true;
      },

      shouldFloatLabel: function() {
        // if type = number, the input value is the empty string until a valid number
        // is entered so we must do some hacks here
        return this.inputValue || (this.type === 'number' && !this.validity.valid);
      },

      inputBlurAction: function() {
        this.super(arguments);

        this.$.underlineHighlight.classList.remove('focused');
        this.$.caret.classList.remove('focused');

        if (this.floatingLabel) {
          this.$.floatedLabel.classList.remove('focused');
          this.$.floatedLabel.classList.remove('focusedColor');
          if (!this.shouldFloatLabel()) {
            this.$.floatedLabel.classList.add('hidden');
          }
        }

        // type = number hack. see core-input for more info
        if (!this.shouldFloatLabel()) {
          this.$.label.classList.remove('hidden');
          this.$.label.classList.add('animating');
          this.async(function() {
            this.$.label.style.webkitTransform = 'none';
            this.$.label.style.transform = 'none';
          });
        }

        this.focused = false;
      },

      downAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (this.focused) {
          return;
        }

        this.pressed = true;
        var rect = this.$.underline.getBoundingClientRect();
        var right = e.x - rect.left;
        this.$.underlineHighlight.style.webkitTransformOriginX = right + 'px';
        this.$.underlineHighlight.style.transformOriginX = right + 'px';
        this.$.underlineHighlight.classList.remove('focused');
        this.underlineAsync = this.async(function() {
          this.$.underlineHighlight.classList.add('pressed');
        }, null, 200);

        // No caret animation if there is text in the input.
        if (!this.inputValue) {
          this.$.caret.classList.remove('focused');
        }
      },

      upAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (!this.pressed) {
          return;
        }

        // if a touchevent caused the up, the synthentic mouseevents will blur
        // the input, make sure to prevent those from being generated.
        if (e._source === 'touch') {
          e.preventDefault();
        }

        if (this.underlineAsync) {
          clearTimeout(this.underlineAsync);
          this.underlineAsync = null;
        }

        // Focus the input here to bring up the virtual keyboard.
        this.$.input.focus();
        this.pressed = false;
        this.animating = true;

        this.$.underlineHighlight.classList.remove('pressed');
        this.$.underlineHighlight.classList.add('animating');
        this.async(function() {
          this.$.underlineHighlight.classList.add('focused');
        });

        // No caret animation if there is text in the input.
        if (!this.inputValue) {
          this.$.caret.classList.add('animating');
          this.async(function() {
            this.$.caret.classList.add('focused');
          }, null, 100);
        }

        if (this.floatingLabel) {
          this.$.label.classList.add('focusedColor');
          this.$.label.classList.add('animating');
          if (!this.$.label.cachedTransform) {
            this.prepareLabelTransform();
          }
          this.$.label.style.webkitTransform = this.$.label.cachedTransform;
          this.$.label.style.transform = this.$.label.cachedTransform;
        }
      },

      keydownAction: function() {
        this.super();

        // more type = number hacks. see core-input for more info
        if (this.type === 'number') {
          this.async(function() {
            if (!this.inputValue) {
              this.toggleLabel(!this.validity.valid);
            }
          });
        }
      },

      keypressAction: function() {
        if (this.animating) {
          this.transitionEndAction();
        }
      },

      transitionEndAction: function(e) {
        this.animating = false;
        if (this.pressed) {
          return;
        }

        if (this.focused) {

          if (this.floatingLabel || this.inputValue) {
            this.$.label.classList.add('hidden');
          }

          if (this.floatingLabel) {
            this.$.label.classList.remove('focusedColor');
            this.$.label.classList.remove('animating');
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
          }

          this.async(function() {
            this.$.underlineHighlight.classList.remove('animating');
            this.$.caret.classList.remove('animating');
          }, null, 100);

        } else {

          this.$.label.classList.remove('animating');

        }
      }

    });

  }());

  ;


  (function() {

    var waveMaxRadius = 150;
    //
    // INK EQUATIONS
    //
    function waveRadiusFn(touchDownMs, touchUpMs, anim) {
      // Convert from ms to s.
      var touchDown = touchDownMs / 1000;
      var touchUp = touchUpMs / 1000;
      var totalElapsed = touchDown + touchUp;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), waveMaxRadius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveRadius / waveMaxRadius);
      var tt = (totalElapsed / duration);

      var size = waveRadius * (1 - Math.pow(80, -tt));
      return Math.abs(size);
    }

    function waveOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
      }
      return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
    }

    function waveOuterOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;

      // Linear increase in background opacity, capped at the opacity
      // of the wavefront (waveOpacity).
      var outerOpacity = touchDown * 0.3;
      var waveOpacity = waveOpacityFn(td, tu, anim);
      return Math.max(0, Math.min(outerOpacity, waveOpacity));
    }

    // Determines whether the wave should be completely removed.
    function waveDidFinish(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);
      // If the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      if (waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, waveMaxRadius)) {
        return true;
      }
      return false;
    };

    function waveAtMaximum(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);
      if (waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, waveMaxRadius)) {
        return true;
      }
      return false;
    }

    //
    // DRAWING
    //
    function drawRipple(ctx, x, y, radius, innerColor, outerColor) {
      if (outerColor) {
        ctx.fillStyle = outerColor;
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = innerColor;
      ctx.fill();
    }

    //
    // SETUP
    //
    function createWave(elem) {
      var elementStyle = window.getComputedStyle(elem);
      var fgColor = elementStyle.color;

      var wave = {
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
      };
      return wave;
    }

    function removeWaveFromScope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
      }
    };

    // Shortcuts.
    var pow = Math.pow;
    var now = Date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function cssColorWithAlpha(cssColor, alpha) {
        var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return Math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distanceFromPointToFurthestCorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return Math.max(tl_d, tr_d, bl_d, br_d);
    }

    Polymer('paper-ripple', {

      /**
       * The initial opacity set on the wave.
       *
       * @attribute initialOpacity
       * @type number
       * @default 0.25
       */
      initialOpacity: 0.25,

      /**
       * How fast (opacity per second) the wave fades out.
       *
       * @attribute opacityDecayVelocity
       * @type number
       * @default 0.8
       */
      opacityDecayVelocity: 0.8,

      backgroundFill: true,
      pixelDensity: 2,

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      attached: function() {
        // create the canvas element manually becase ios
        // does not render the canvas element if it is not created in the
        // main document (component templates are created in a
        // different document). See:
        // https://bugs.webkit.org/show_bug.cgi?id=109073.
        if (!this.$.canvas) {
          var canvas = document.createElement('canvas');
          canvas.id = 'canvas';
          this.shadowRoot.appendChild(canvas);
          this.$.canvas = canvas;
        }
      },

      ready: function() {
        this.waves = [];
      },

      setupCanvas: function() {
        this.$.canvas.setAttribute('width', this.$.canvas.clientWidth * this.pixelDensity + "px");
        this.$.canvas.setAttribute('height', this.$.canvas.clientHeight * this.pixelDensity + "px");
        var ctx = this.$.canvas.getContext('2d');
        ctx.scale(this.pixelDensity, this.pixelDensity);
        if (!this._loop) {
          this._loop = this.animate.bind(this, ctx);
        }
      },

      downAction: function(e) {
        this.setupCanvas();
        var wave = createWave(this.$.canvas);

        this.cancelled = false;
        wave.isMouseDown = true;
        wave.tDown = 0.0;
        wave.tUp = 0.0;
        wave.mouseUpStart = 0.0;
        wave.mouseDownStart = now();

        var width = this.$.canvas.width / 2; // Retina canvas
        var height = this.$.canvas.height / 2;
        var rect = this.getBoundingClientRect();
        var touchX = e.x - rect.left;
        var touchY = e.y - rect.top;

        wave.startPosition = {x:touchX, y:touchY};

        if (this.classList.contains("recenteringTouch")) {
          wave.endPosition = {x: width / 2,  y: height / 2};
          wave.slideDistance = dist(wave.startPosition, wave.endPosition);
        }
        wave.containerSize = Math.max(width, height);
        wave.maxRadius = distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});
        this.waves.push(wave);
        requestAnimationFrame(this._loop);
      },

      upAction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // Declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
          }
        }
        this._loop && requestAnimationFrame(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldRenderNextFrame = false;

        // Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var deleteTheseWaves = [];
        // The oldest wave's touch down duration
        var longestTouchDownDuration = 0;
        var longestTouchUpDuration = 0;
        // Save the last known wave color
        var lastWaveColor = null;
        // wave animation values
        var anim = {
          initialOpacity: this.initialOpacity,
          opacityDecayVelocity: this.opacityDecayVelocity,
          height: ctx.canvas.height,
          width: ctx.canvas.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mouseDownStart > 0) {
            wave.tDown = now() - wave.mouseDownStart;
          }
          if (wave.mouseUpStart > 0) {
            wave.tUp = now() - wave.mouseUpStart;
          }

          // Determine how long the touch has been up or down.
          var tUp = wave.tUp;
          var tDown = wave.tDown;
          longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
          longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

          // Obtain the instantenous size and alpha of the ripple.
          var radius = waveRadiusFn(tDown, tUp, anim);
          var waveAlpha =  waveOpacityFn(tDown, tUp, anim);
          var waveColor = cssColorWithAlpha(wave.waveColor, waveAlpha);
          lastWaveColor = wave.waveColor;

          // Position of the ripple.
          var x = wave.startPosition.x;
          var y = wave.startPosition.y;

          // Ripple gravitational pull to the center of the canvas.
          if (wave.endPosition) {

            // This translates from the origin to the center of the view  based on the max dimension of  
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2) );

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
          }

          // If we do a background fill fade too, work out the correct color.
          var bgFillColor = null;
          if (this.backgroundFill) {
            var bgFillAlpha = waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = cssColorWithAlpha(wave.waveColor, bgFillAlpha);
          }

          // Draw the ripple.
          drawRipple(ctx, x, y, radius, waveColor, bgFillColor);

          // Determine whether there is any more rendering to be done.
          var maximumWave = waveAtMaximum(wave, radius, anim);
          var waveDissipated = waveDidFinish(wave, radius, anim);
          var shouldKeepWave = !waveDissipated || maximumWave;
          var shouldRenderWaveAgain = !waveDissipated && !maximumWave;
          shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
          if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
          }
       }

        if (shouldRenderNextFrame) {
          requestAnimationFrame(this._loop);
        }

        for (var i = 0; i < deleteTheseWaves.length; ++i) {
          var wave = deleteTheseWaves[i];
          removeWaveFromScope(this, wave);
        }

        if (!this.waves.length) {
          // If there is nothing to draw, clear any drawn waves now because
          // we're not going to get another requestAnimationFrame any more.
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          this._loop = null;
        }
      }

    });

  })();

;

    Polymer('paper-item', {

      publish: {

        /**
         * The label for the item.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * (optional) The URL of an image for an icon to use in the button.
         * Should not use `icon` property if you are using this property.
         *
         * @attribute iconSrc
         * @type string
         * @default ''
         */
        iconSrc: '',

        /**
         * (optional) Specifies the icon name or index in the set of icons
         * available in the icon set. If using this property, load the icon
         * set separately where the icon is used. Should not use `src`
         * if you are using this property.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: ''

      },

      eventDelegates: {
        'down': 'downAction',
        'up': 'upAction'
      },

      downAction: function(e) {
        this.$.ripple.downAction(e);
      },

      upAction: function(e) {
        this.$.ripple.upAction(e);
      }
    });
  ;

    Polymer('paper-focusable', {

      publish: {

        /**
         * If true, the button is currently active either because the
         * user is holding down the button, or the button is a toggle
         * and is currently in the active state.
         *
         * @attribute active
         * @type boolean
         * @default false
         */
        active: {value: false, reflect: true},

        /**
         * If true, the element currently has focus due to keyboard
         * navigation.
         *
         * @attribute focused
         * @type boolean
         * @default false
         */
        focused: {value: false, reflect: true},

        /**
         * If true, the user is currently holding down the button.
         *
         * @attribute pressed
         * @type boolean
         * @default false
         */
        pressed: {value: false, reflect: true},

        /**
         * If true, the user cannot interact with this element.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: {value: false, reflect: true},

        /**
         * If true, the button toggles the active state with each tap.
         * Otherwise, the button becomes active when the user is holding
         * it down.
         *
         * @attribute isToggle
         * @type boolean
         * @default false
         */
        isToggle: {value: false, reflect: false}

      },

      disabledChanged: function() {
        if (this.disabled) {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', 0);
        }
      },

      downAction: function() {
        this.pressed = true;
        this.focused = false;

        if (this.isToggle) {
          this.active = !this.active;
        } else {
          this.active = true;
        }
      },

      // Pulling up the context menu for an item should focus it; but we need to
      // be careful about how we deal with down/up events surrounding context
      // menus. The up event typically does not fire until the context menu
      // closes: so we focus immediately.
      //
      // This fires _after_ downAction.
      contextMenuAction: function(e) {
        // Note that upAction may fire _again_ on the actual up event.
        this.upAction(e);
        this.focusAction();
      },

      upAction: function() {
        this.pressed = false;

        if (!this.isToggle) {
          this.active = false;
        }
      },

      focusAction: function() {
        if (!this.pressed) {
          // Only render the "focused" state if the element gains focus due to
          // keyboard navigation.
          this.focused = true;
        }
      },

      blurAction: function() {
        this.focused = false;
      }

    });

  ;

    Polymer('paper-shadow', {

      publish: {
        /**
         * If set, the shadow is applied to this node.
         *
         * @attribute target
         * @type Element
         * @default null
         */
        target: {value: null, reflect: true},

        /**
         * The z-depth of this shadow, from 0-5.
         *
         * @attribute z
         * @type number
         * @default 1
         */
        z: {value: 1, reflect: true},

        /**
         * If true, the shadow animates between z-depth changes.
         *
         * @attribute animated
         * @type boolean
         * @default false
         */
        animated: {value: false, reflect: true},

        /**
         * Workaround: getComputedStyle is wrong sometimes so `paper-shadow`
         * may overwrite the `position` CSS property. Set this property to
         * true to prevent this.
         *
         * @attribute hasPosition
         * @type boolean
         * @default false
         */
        hasPosition: {value: false}
      },

      // NOTE: include template so that styles are loaded, but remove
      // so that we can decide dynamically what part to include
      registerCallback: function(polymerElement) {
        var template = polymerElement.querySelector('template');
        this._style = template.content.querySelector('style');
        this._style.removeAttribute('no-shim');
      },

      fetchTemplate: function() {
        return null;
      },

      attached: function() {
        this.installScopeStyle(this._style);

        // If no target is bound at attach, default the target to the parent
        // element or shadow host.
        if (!this.target) {
          if (!this.parentElement && this.parentNode.host) {
            this.target = this.parentNode.host;
          } else if (this.parentElement && (window.ShadowDOMPolyfill ? this.parentElement !== wrap(document.body) : this.parentElement !== document.body)) {
            this.target = this.parentElement;
          }
        }
      },

      targetChanged: function(old) {
        if (old) {
          this.removeShadow(old);
        }
        if (this.target) {
          this.addShadow(this.target);
        }
      },

      zChanged: function(old) {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            shadow[s].classList.remove('paper-shadow-' + s + '-z-' + old);
            shadow[s].classList.add('paper-shadow-' + s + '-z-' + this.z);
          }.bind(this));
        }
      },

      animatedChanged: function() {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            if (this.animated) {
              shadow[s].classList.add('paper-shadow-animated');
            } else {
              shadow[s].classList.remove('paper-shadow-animated');
            }
          }.bind(this));
        }
      },

      addShadow: function(node) {
        if (node._paperShadow) {
          return;
        }

        var computed = getComputedStyle(node);
        if (!this.hasPosition && computed.position === 'static') {
          node.style.position = 'relative';
        }
        node.style.overflow = 'visible';

        // Both the top and bottom shadows are children of the target, so
        // it does not affect the classes and CSS properties of the target.
        ['top', 'bottom'].forEach(function(s) {
          var inner = (node._paperShadow && node._paperShadow[s]) || document.createElement('div');
          inner.classList.add('paper-shadow');
          inner.classList.add('paper-shadow-' + s + '-z-' + this.z);
          if (this.animated) {
            inner.classList.add('paper-shadow-animated');
          }

          if (node.shadowRoot) {
            node.shadowRoot.insertBefore(inner, node.shadowRoot.firstChild);
          } else {
            node.insertBefore(inner, node.firstChild);
          }

          node._paperShadow = node._paperShadow || {};
          node._paperShadow[s] = inner;
        }.bind(this));

      },

      removeShadow: function(node) {
        if (!node._paperShadow) {
          return;
        }

        ['top', 'bottom'].forEach(function(s) {
          node._paperShadow[s].remove();
        });
        node._paperShadow = null;

        node.style.position = null;
      }

    });
  ;

    Polymer('paper-menu-button-overlay', {

      publish: {

        /**
         * The `relatedTarget` is an element used to position the overlay, for example a
         * button the user taps to show a menu.
         *
         * @attribute relatedTarget
         * @type Element
         */
        relatedTarget: null,

        /**
         * The horizontal alignment of the overlay relative to the `relatedTarget`.
         *
         * @attribute halign
         * @type 'left'|'right'|'center'
         * @default 'left'
         */
        halign: 'left'

      },

      updateTargetDimensions: function() {
        this.super();

        var t = this.target;
        this.target.cachedSize = t.getBoundingClientRect();
      },

      positionTarget: function() {
        if (this.relatedTarget) {

          var rect = this.relatedTarget.getBoundingClientRect();

          if (this.halign === 'left') {
            this.target.style.left = rect.left + 'px';
          } else if (this.halign === 'right') {
            this.target.style.right = (window.innerWidth - rect.right) + 'px';
          } else {
            this.target.style.left = (rect.left - (rect.width - this.target.cachedSize.width) / 2) + 'px';
          }

          if (this.valign === 'top') {
            this.target.style.top = rect.top + 'px';
          } else if (this.valign === 'bottom') {
            this.target.style.top = rect.bottom + 'px';
          } else {
            this.target.style.top = rect.top + 'px';
          }

          // this.target.style.top = rect.top + 'px';

        } else {
          this.super();
        }
      }

    });
  ;

    Polymer('paper-menu-button-transition', {

      baseClass: 'paper-menu-button-transition',
      revealedClass: 'paper-menu-button-revealed',
      openedClass: 'paper-menu-button-opened',
      closedClass: 'paper-menu-button-closed',

      duration: 500,

      setup: function(node) {
        this.super(arguments);

        var bg = node.querySelector('.paper-menu-button-overlay-bg');
        bg.style.transformOrigin = this.transformOrigin;
        bg.style.webkitTransformOrigin = this.transformOrigin;
      },

      transitionOpened: function(node, opened) {
        this.super(arguments);

        if (opened) {
          if (this.player) {
            this.player.cancel();
          }

          var anims = [];

          var ink = node.querySelector('.paper-menu-button-overlay-ink');
          var offset = 40 / Math.max(node.cachedSize.width, node.cachedSize.height);
          anims.push(new Animation(ink, [{
            'opacity': 0.9,
            'transform': 'scale(0)',
          }, {
            'opacity': 0.9,
            'transform': 'scale(1)'
          }], {
            duration: this.duration * offset
          }));

          var bg = node.querySelector('.paper-menu-button-overlay-bg');
          anims.push(new Animation(bg, [{
            'opacity': 0.9,
            'transform': 'scale(' + 40 / node.cachedSize.width + ',' + 40 / node.cachedSize.height + ')',
          }, {
            'opacity': 1,
            'transform': 'scale(0.95, 0.5)'
          }, {
            'opacity': 1,
            'transform': 'scale(1, 1)'
          }], {
            delay: this.duration * offset,
            duration: this.duration * (1 - offset),
            fill: 'forwards'
          }));

          var nodes = window.ShadowDOMPolyfill ? Platform.queryAllShadows(node.querySelector('core-menu'), 'content').getDistributedNodes() : node.querySelector('core-menu::shadow content').getDistributedNodes().array();
          var items = nodes.filter(function(n) {
            return n.nodeType === Node.ELEMENT_NODE;
          });
          var itemDelay = offset + (1 - offset) / 2;
          var itemDuration = this.duration * (1 - itemDelay) / items.length;
          items.forEach(function(item, i) {
            anims.push(new Animation(item, [{
              'opacity': 0
            }, {
              'opacity': 1
            }], {
              delay: this.duration * itemDelay + itemDuration * i,
              duration: itemDuration,
              fill: 'both'
            }));
          }.bind(this));

          var shadow = node.querySelector('paper-shadow');
          anims.push(new Animation(shadow, function(t, target) {
            if (t > offset * 2 && shadow.z === 0) {
              shadow.z = 1
            }
          }, {
            duration: this.duration
          }));

          var group = new AnimationGroup(anims, {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
          });
          this.player = document.timeline.play(group);
        }
      },

    });
  ;
Polymer('paper-menu-button-overlay-container');;

    Polymer('paper-menu-button', {

      publish: {

        /**
         * If true, this menu is currently visible.
         *
         * @attribute opened
         * @type boolean
         * @default false
         */
        opened: { value: false, reflect: true },

        /**
         * The horizontal alignment of the pulldown menu relative to the button.
         *
         * @attribute halign
         * @type 'left' | 'right'
         * @default 'left'
         */
        halign: { value: 'left', reflect: true },

        /**
         * The vertical alignment of the pulldown menu relative to the button.
         *
         * @attribute valign
         * @type 'bottom' | 'top'
         * @default 'top'
         */
        valign: {value: 'top', reflect: true}
      },

      /**
       * The URL of an image for the icon.  Should not use `icon` property
       * if you are using this property.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * Specifies the icon name or index in the set of icons available in
       * the icon set.  Should not use `src` property if you are using this
       * property.
       *
       * @attribute icon
       * @type string
       * @default ''
       */
      icon: '',

      slow: false,

      tapAction: function() {
        if (this.disabled) {
          return;
        }

        this.super();
        this.toggle();
      },

      /**
       * Toggle the opened state of the menu.
       *
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      }

    });
  ;

  
    Polymer('paper-progress', {
      
      /**
       * The number that represents the current secondary progress.
       *
       * @attribute secondaryProgress
       * @type number
       * @default 0
       */
      secondaryProgress: 0,
      
      step: 0,
      
      observe: {
        'value secondaryProgress min max': 'update'
      },
      
      update: function() {
        this.super();
        this.secondaryProgress = this.clampValue(this.secondaryProgress);
        this.secondaryRatio = this.calcRatio(this.secondaryProgress) * 100;
      }
      
    });
    
  ;


  Polymer('paper-radio-button', {
    
    /**
     * Fired when the checked state changes.
     *
     * @event change
     */
    
    publish: {
      /**
       * Gets or sets the state, `true` is checked and `false` is unchecked.
       *
       * @attribute checked
       * @type boolean
       * @default false
       */
      checked: {value: false, reflect: true},
      
      /**
       * The label for the radio button.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',
      
      /**
       * Normally the user cannot uncheck the radio button by tapping once
       * checked.  Setting this property to `true` makes the radio button
       * toggleable from checked to unchecked.
       *
       * @attribute toggles
       * @type boolean
       * @default false
       */
      toggles: false,
      
      /**
       * If true, the user cannot interact with this element.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true}
    },
    
    eventDelegates: {
      tap: 'tap'
    },
    
    tap: function() {
      this.toggle();
      this.fire('paper-radio-button-activate');
    },
    
    toggle: function() {
      this.checked = !this.toggles || !this.checked;
    },
    
    checkedChanged: function() {
      this.$.onRadio.classList.toggle('fill', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('change');
    },
    
    labelChanged: function() {
      this.setAttribute('aria-label', this.label);
    }
    
  });
  
;

  
    Polymer('paper-radio-group', {
      
      selectedAttribute: 'checked',
      activateEvent: 'paper-radio-button-activate'
      
    });
  
  ;


  Polymer('paper-slider', {
    
    /**
     * Fired when the slider's value changes.
     *
     * @event change
     */

    /**
     * Fired when the slider's value changes due to manual interaction.
     *
     * Changes to the slider's value due to changes in an underlying
     * bound variable will not trigger this event.
     *
     * @event manual-change
     */
     
    /**
     * If true, the slider thumb snaps to tick marks evenly spaced based
     * on the `step` property value.
     *
     * @attribute snaps
     * @type boolean
     * @default false
     */
    snaps: false,
    
    /**
     * If true, a pin with numeric value label is shown when the slider thumb 
     * is pressed.  Use for settings for which users need to know the exact 
     * value of the setting.
     *
     * @attribute pin
     * @type boolean
     * @default false
     */
    pin: false,
    
    /**
     * If true, this slider is disabled.  A disabled slider cannot be tapped
     * or dragged to change the slider value.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    disabled: false,
    
    /**
     * The number that represents the current secondary progress.
     *
     * @attribute secondaryProgress
     * @type number
     * @default 0
     */
    secondaryProgress: 0,
    
    /**
     * If true, an input is shown and user can use it to set the slider value.
     *
     * @attribute editable
     * @type boolean
     * @default false
     */
    editable: false,
    
    /**
     * The immediate value of the slider.  This value is updated while the user
     * is dragging the slider.
     *
     * @attribute immediateValue
     * @type number
     * @default 0
     */
    
    observe: {
      'min max step snaps': 'update'
    },
    
    ready: function() {
      this.update();
    },
    
    update: function() {
      this.positionKnob(this.calcRatio(this.value));
      this.updateMarkers();
    },
    
    valueChanged: function() {
      this.update();
      this.fire('change');
    },
    
    expandKnob: function() {
      this.$.sliderKnob.classList.add('expand');
    },
    
    resetKnob: function() {
      this.expandJob && this.expandJob.stop();
      this.$.sliderKnob.classList.remove('expand');
    },
    
    positionKnob: function(ratio) {
      this._ratio = ratio;
      this.immediateValue = this.calcStep(this.calcKnobPosition()) || 0;
      if (this.snaps) {
        this._ratio = this.calcRatio(this.immediateValue);
      }
      this.$.sliderKnob.style.left = this._ratio * 100 + '%';
    },
    
    immediateValueChanged: function() {
      this.$.sliderKnob.classList.toggle('ring', this.immediateValue <= this.min);
    },
    
    inputChange: function() {
      this.value = this.$.input.value;
      this.fire('manual-change');
    },
    
    calcKnobPosition: function() {
      return (this.max - this.min) * this._ratio + this.min;
    },
    
    measureWidth: function() {
      this._w = this.$.sliderBar.offsetWidth;
    },
    
    trackStart: function(e) {
      this.measureWidth();
      this._x = this._ratio * this._w;
      this._startx = this._x || 0;
      this._minx = - this._startx;
      this._maxx = this._w - this._startx;
      this.$.sliderKnob.classList.add('dragging');
      e.preventTap();
    },

    trackx: function(e) {
      var x = Math.min(this._maxx, Math.max(this._minx, e.dx));
      this._x = this._startx + x;
      this._ratio = this._x / this._w;
      this.immediateValue = this.calcStep(this.calcKnobPosition()) || 0;
      var s =  this.$.sliderKnob.style;
      s.transform = s.webkitTransform = 'translate3d(' + (this.snaps ? 
          (this.calcRatio(this.immediateValue) * this._w) - this._startx : x) + 'px, 0, 0)';
    },
    
    trackEnd: function() {
      var s =  this.$.sliderKnob.style;
      s.transform = s.webkitTransform = '';
      this.$.sliderKnob.classList.remove('dragging');
      this.resetKnob();
      this.value = this.immediateValue;
      this.fire('manual-change');
    },
    
    bardown: function(e) {
      this.measureWidth();
      this.$.sliderKnob.classList.add('transiting');
      var rect = this.$.sliderBar.getBoundingClientRect();
      this.positionKnob((e.x - rect.left) / this._w);
      this.value = this.calcStep(this.calcKnobPosition());
      this.expandJob = this.job(this.expandJob, this.expandKnob, 60);
      this.fire('manual-change');
    },
    
    knobTransitionEnd: function() {
      this.$.sliderKnob.classList.remove('transiting');
    },
    
    updateMarkers: function() {
      this.markers = [], l = (this.max - this.min) / this.step;
      for (var i = 0; i < l; i++) {
        this.markers.push('');
      }
    },
    
    increment: function() {
      this.value = this.clampValue(this.value + this.step);
    },
    
    decrement: function() {
      this.value = this.clampValue(this.value - this.step);
    },
    
    keydown: function(e) {
      if (this.disabled) {
        return;
      }
      var c = e.keyCode;
      if (c === 37) {
        this.decrement();
        this.fire('manual-change');
      } else if (c === 39) {
        this.increment();
        this.fire('manual-change');
      }
    }

  });

;


  Polymer('paper-tab', {
    
    /**
     * If true, ink ripple effect is disabled.
     *
     * @attribute noink
     * @type boolean
     * @default false
     */
    noink: false
    
  });
  
;


  Polymer('paper-tabs', {
    
    /**
     * If true, ink effect is disabled.
     *
     * @attribute noink
     * @type boolean
     * @default false
     */
    noink: false,
    
    /**
     * If true, the bottom bar to indicate the selected tab will not be shown.
     *
     * @attribute nobar
     * @type boolean
     * @default false
     */
    nobar: false,
    
    activateEvent: 'down',
    
    nostretch: false,
    
    selectedIndexChanged: function(old) {
      var s = this.$.selectionBar.style;
      
      if (!this.selectedItem) {
        s.width = 0;
        s.left = 0;
        return;
      } 
      
      var w = 100 / this.items.length;
      
      if (this.nostretch || old === null || old === -1) {
        s.width = w + '%';
        s.left = this.selectedIndex * w + '%';
        return;
      }
      
      var m = 5;
      this.$.selectionBar.classList.add('expand');
      if (old < this.selectedIndex) {
        s.width = w + w * (this.selectedIndex - old) - m + '%';
      } else {
        s.width = w + w * (old - this.selectedIndex) - m + '%';
        s.left = this.selectedIndex * w + m + '%';
      }
    },
    
    barTransitionEnd: function() {
      var cl = this.$.selectionBar.classList;
      if (cl.contains('expand')) {
        cl.remove('expand');
        cl.add('contract');
        var s = this.$.selectionBar.style;
        var w = 100 / this.items.length;
        s.width = w + '%';
        s.left = this.selectedIndex * w + '%';
      } else if (cl.contains('contract')) {
        cl.remove('contract');
      }
    }
    
  });
  
;


  (function() {
  
    var currentToast;
  
    Polymer('paper-toast', {
  
      /**
       * The text shows in a toast.
       *
       * @attribute text
       * @type string
       * @default ''
       */
      text: '',
      
      /**
       * The duration in milliseconds to show the toast.
       *
       * @attribute duration
       * @type number
       * @default 3000
       */
      duration: 3000,
      
      /**
       * Set opened to true to show the toast and to false to hide it.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,
      
      /**
       * Min-width when the toast changes to narrow layout.  In narrow layout,
       * the toast fits at the bottom of the screen when opened.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '480px'
       */
      responsiveWidth: '480px',
      
      /**
       * If true, the toast can't be swiped.
       *
       * @attribute swipeDisabled
       * @type boolean
       * @default false
       */
      swipeDisabled: false,
      
      eventDelegates: {
        trackstart: 'trackStart',
        track: 'track',
        trackend: 'trackEnd',
        transitionend: 'transitionEnd'
      },
      
      narrowModeChanged: function() {
        this.classList.toggle('fit-bottom', this.narrowMode);
      },
      
      openedChanged: function() {
        if (this.opened) {
          this.dismissJob = this.job(this.dismissJob, this.dismiss, this.duration);
        } else {
          this.dismissJob && this.dismissJob.stop();
          this.dismiss();
        }
      },
      
      /** 
       * Toggle the opened state of the toast.
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      },
      
      /** 
       * Show the toast for the specified duration
       * @method show
       */
      show: function() {
        if (currentToast) {
          currentToast.dismiss();
        }
        currentToast = this;
        this.opened = true;
      },
      
      /** 
       * Dismiss the toast and hide it.
       * @method dismiss
       */
      dismiss: function() {
        if (this.dragging) {
          this.shouldDismiss = true;
        } else {
          this.opened = false;
          if (currentToast === this) {
            currentToast = null;
          }
        }
      },
      
      trackStart: function(e) {
        if (!this.swipeDisabled) {
          e.preventTap();
          this.vertical = e.yDirection;
          this.w = this.offsetWidth;
          this.h = this.offsetHeight;
          this.dragging = true;
          this.classList.add('dragging');
        }
      },
      
      track: function(e) {
        if (this.dragging) {
          var s = this.style;
          if (this.vertical) {
            var y = e.dy;
            s.opacity = (this.h - Math.abs(y)) / this.h;
            s.webkitTransform = s.transform =  'translate3d(0, ' + y + 'px, 0)';
          } else {
            var x = e.dx;
            s.opacity = (this.w - Math.abs(x)) / this.w;
            s.webkitTransform = s.transform = 'translate3d(' + x + 'px, 0, 0)';
          }
        }
      },
      
      trackEnd: function(e) {
        if (this.dragging) {
          this.classList.remove('dragging');
          this.style.opacity = null;
          this.style.webkitTransform = this.style.transform = null;
          var cl = this.classList;
          if (this.vertical) {
            cl.toggle('fade-out-down', e.yDirection === 1 && e.dy > 0);
            cl.toggle('fade-out-up', e.yDirection === -1 && e.dy < 0);
          } else {
            cl.toggle('fade-out-right', e.xDirection === 1 && e.dx > 0);
            cl.toggle('fade-out-left', e.xDirection === -1 && e.dx < 0);
          }
          this.dragging = false;
        }
      },
      
      transitionEnd: function() {
        var cl = this.classList;
        if (cl.contains('fade-out-right') || cl.contains('fade-out-left') || 
            cl.contains('fade-out-down') || cl.contains('fade-out-up')) {
          this.dismiss();
          cl.remove('fade-out-right', 'fade-out-left', 
              'fade-out-down', 'fade-out-up');
        } else if (this.shouldDismiss) {
          this.dismiss();
        }
        this.shouldDismiss = false;
      }
  
    });
    
  })();

;


  Polymer('paper-toggle-button', {
    
    /**
     * Fired when the checked state changes.
     *
     * @event change
     */

    /**
     * Gets or sets the state, `true` is checked and `false` is unchecked.
     *
     * @attribute checked
     * @type boolean
     * @default false
     */
    checked: false,

    trackStart: function(e) {
      this._w = this.$.toggleBar.offsetLeft + this.$.toggleBar.offsetWidth;
      e.preventTap();
    },

    trackx: function(e) {
      this._x = Math.min(this._w, 
          Math.max(0, this.checked ? this._w + e.dx : e.dx));
      this.$.toggleRadio.classList.add('dragging');
      var s =  this.$.toggleRadio.style;
      s.webkitTransform = s.transform = 'translate3d(' + this._x + 'px,0,0)';
    },

    trackEnd: function() {
      var s =  this.$.toggleRadio.style;
      s.webkitTransform = s.transform = null;
      this.$.toggleRadio.classList.remove('dragging');
      this.checked = Math.abs(this._x) > this._w / 2;
    },

    checkedChanged: function() {
      this.setAttribute('aria-pressed', Boolean(this.checked));
      this.fire('change');
    }

  });

