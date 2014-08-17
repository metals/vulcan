

  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @property list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

  
    Polymer('core-iconset', {
  
      /**
       * The URL of the iconset image.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * The width of the iconset image. This must only be specified if the
       * icons are arranged into separate rows inside the image.
       *
       * @attribute width
       * @type number
       * @default 0
       */
      width: 0,

      /**
       * A space separated list of names corresponding to icons in the iconset
       * image file. This list must be ordered the same as the icon images
       * in the image file.
       *
       * @attribute icons
       * @type string
       * @default ''
       */
      icons: '',

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,

      /**
       * The horizontal offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetX
       * @type number
       * @default 0
       */
      offsetX: 0,
      /**
       * The vertical offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetY
       * @type number
       * @default 0
       */
      offsetY: 0,
      type: 'iconset',

      created: function() {
        this.iconMap = {};
        this.iconNames = [];
        this.themes = {};
      },
  
      ready: function() {
        // TODO(sorvell): ensure iconset's src is always relative to the main
        // document
        if (this.src && (this.ownerDocument !== document)) {
          this.src = this.resolvePath(this.src, this.ownerDocument.baseURI);
        }
        this.super();
        this.updateThemes();
      },

      iconsChanged: function() {
        var ox = this.offsetX;
        var oy = this.offsetY;
        this.icons && this.icons.split(/\s+/g).forEach(function(name, i) {
          this.iconNames.push(name);
          this.iconMap[name] = {
            offsetX: ox,
            offsetY: oy
          }
          if (ox + this.iconSize < this.width) {
            ox += this.iconSize;
          } else {
            ox = this.offsetX;
            oy += this.iconSize;
          }
        }, this);
      },

      updateThemes: function() {
        var ts = this.querySelectorAll('property[theme]');
        ts && ts.array().forEach(function(t) {
          this.themes[t.getAttribute('theme')] = {
            offsetX: parseInt(t.getAttribute('offsetX')) || 0,
            offsetY: parseInt(t.getAttribute('offsetY')) || 0
          };
        }, this);
      },

      // TODO(ffu): support retrived by index e.g. getOffset(10);
      /**
       * Returns an object containing `offsetX` and `offsetY` properties which
       * specify the pixel locaion in the iconset's src file for the given
       * `icon` and `theme`. It's uncommon to call this method. It is useful,
       * for example, to manually position a css backgroundImage to the proper
       * offset. It's more common to use the `applyIcon` method.
       *
       * @method getOffset
       * @param {String|Number} icon The name of the icon or the index of the
       * icon within in the icon image.
       * @param {String} theme The name of the theme.
       * @returns {Object} An object specifying the offset of the given icon 
       * within the icon resource file; `offsetX` is the horizontal offset and
       * `offsetY` is the vertical offset. Both values are in pixel units.
       */
      getOffset: function(icon, theme) {
        var i = this.iconMap[icon];
        if (!i) {
          var n = this.iconNames[Number(icon)];
          i = this.iconMap[n];
        }
        var t = this.themes[theme];
        if (i && t) {
          return {
            offsetX: i.offsetX + t.offsetX,
            offsetY: i.offsetY + t.offsetY
          }
        }
        return i;
      },

      /**
       * Applies an icon to the given element as a css background image. This
       * method does not size the element, and it's often necessary to set 
       * the element's height and width so that the background image is visible.
       *
       * @method applyIcon
       * @param {Element} element The element to which the background is
       * applied.
       * @param {String|Number} icon The name or index of the icon to apply.
       * @param {Number} scale (optional, defaults to 1) A scaling factor 
       * with which the icon can be magnified.
       * @return {Element} The icon element.
       */
      applyIcon: function(element, icon, scale) {
        var offset = this.getOffset(icon);
        scale = scale || 1;
        if (element && offset) {
          var icon = element._icon || document.createElement('div');
          var style = icon.style;
          style.backgroundImage = 'url(' + this.src + ')';
          style.backgroundPosition = (-offset.offsetX * scale + 'px') + 
             ' ' + (-offset.offsetY * scale + 'px');
          style.backgroundSize = scale === 1 ? 'auto' :
             this.width * scale + 'px';
          if (icon.parentNode !== element) {
            element.appendChild(icon);
          }
          return icon;
        }
      }

    });

  ;

(function() {
  
  // mono-state
  var meta;
  
  Polymer('core-icon', {

    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    src: '',

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    icon: '',

    /**
     * Alternative text content for accessibility support.
     * If alt is present and not empty, it will set the element's role to img and add an aria-label whose content matches alt.
     * If alt is present and is an empty string, '', it will hide the element from the accessibility layer
     * If alt is not present, it will set the element's role to img and the element will fallback to using the icon attribute for its aria-label.
     * 
     * @attribute alt
     * @type string
     * @default ''
     */
    alt: null,

    observe: {
      'icon': 'updateIcon',
      'alt': 'updateAlt'
    },

    defaultIconset: 'icons',

    ready: function() {
      if (!meta) {
        meta = document.createElement('core-iconset');
      }

      // Allow user-provided `aria-label` in preference to any other text alternative.
      if (this.hasAttribute('aria-label')) {
        // Set `role` if it has not been overridden.
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        return;
      }
      this.updateAlt();
    },

    srcChanged: function() {
      var icon = this._icon || document.createElement('div');
      icon.textContent = '';
      icon.setAttribute('fit', '');
      icon.style.backgroundImage = 'url(' + this.src + ')';
      icon.style.backgroundPosition = 'center';
      icon.style.backgroundSize = '100%';
      if (!icon.parentNode) {
        this.appendChild(icon);
      }
      this._icon = icon;
    },

    getIconset: function(name) {
      return meta.byId(name || this.defaultIconset);
    },

    updateIcon: function(oldVal, newVal) {
      if (!this.icon) {
        this.updateAlt();
        return;
      }
      var parts = String(this.icon).split(':');
      var icon = parts.pop();
      if (icon) {
        var set = this.getIconset(parts.pop());
        if (set) {
          this._icon = set.applyIcon(this, icon);
          if (this._icon) {
            this._icon.setAttribute('fit', '');
          }
        }
      }
      // Check to see if we're using the old icon's name for our a11y fallback
      if (oldVal) {
        if (oldVal.split(':').pop() == this.getAttribute('aria-label')) {
          this.updateAlt();
        }
      }
    },

    updateAlt: function() {
      // Respect the user's decision to remove this element from
      // the a11y tree
      if (this.getAttribute('aria-hidden')) {
        return;
      }

      // Remove element from a11y tree if `alt` is empty, otherwise
      // use `alt` as `aria-label`.
      if (this.alt === '') {
        this.setAttribute('aria-hidden', 'true');
        if (this.hasAttribute('role')) {
          this.removeAttribute('role');
        }
        if (this.hasAttribute('aria-label')) {
          this.removeAttribute('aria-label');
        }
      } else {
        this.setAttribute('aria-label', this.alt ||
                                        this.icon.split(':').pop());
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        if (this.hasAttribute('aria-hidden')) {
          this.removeAttribute('aria-hidden');
        }
      }
    }

  });
  
})();
;


    Polymer('core-input', {
      publish: {
        /**
         * Placeholder text that hints to the user what can be entered in
         * the input.
         *
         * @attribute placeholder
         * @type string
         * @default ''
         */
        placeholder: '',
  
        /**
         * If true, this input cannot be focused and the user cannot change
         * its value.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: false,
  
        /**
         * If true, the user cannot modify the value of the input.
         *
         * @attribute readonly
         * @type boolean
         * @default false
         */
        readonly: false,

        /**
         * If true, this input will automatically gain focus on page load.
         *
         * @attribute autofocus
         * @type boolean
         * @default false
         */
        autofocus: false,

        /**
         * If true, this input accepts multi-line input like a `<textarea>`
         *
         * @attribute multiline
         * @type boolean
         * @default false
         */
        multiline: false,
  
        /**
         * (multiline only) The height of this text input in rows. The input
         * will scroll internally if more input is entered beyond the size
         * of the component. This property is meaningless if multiline is
         * false. You can also set this property to "fit" and size the
         * component with CSS to make the input fit the CSS size.
         *
         * @attribute rows
         * @type number|'fit'
         * @default 'fit'
         */
        rows: 'fit',
  
        /**
         * The current value of this input. Changing inputValue programmatically
         * will cause value to be out of sync. Instead, change value directly
         * or call commit() after changing inputValue.
         *
         * @attribute inputValue
         * @type string
         * @default ''
         */
        inputValue: '',
  
        /**
         * The value of the input committed by the user, either by changing the
         * inputValue and blurring the input, or by hitting the `enter` key.
         *
         * @attribute value
         * @type string
         * @default ''
         */
        value: '',

        /**
         * Set the input type. Not supported for `multiline`.
         *
         * @attribute type
         * @type string
         * @default text
         */
        type: 'text',

        /**
         * If true, the input is invalid if its value is null.
         *
         * @attribute required
         * @type boolean
         * @default false
         */
        required: false,

        /**
         * A regular expression to validate the input value against. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute pattern
         * @type string
         * @default '.*'
         */
        // FIXME(yvonne): The default is set to .* because we can't bind to pattern such
        // that the attribute is unset if pattern is null.
        pattern: '.*',

        /**
         * If set, the input is invalid if the value is less than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute min
         */
        min: null,

        /**
         * If set, the input is invalid if the value is greater than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute max
         */
        max: null,

        /**
         * If set, the input is invalid if the value is not `min` plus an integral multiple
         * of this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute step
         */
        step: null,

        /**
         * The maximum length of the input value.
         *
         * @attribute maxlength
         * @type number
         */
        maxlength: null,
  
        /**
         * If this property is true, the text input's inputValue failed validation.
         *
         * @attribute invalid
         * @type boolean
         * @default false
         */
        invalid: false
      },

      ready: function() {
        this.handleTabindex(this.getAttribute('tabindex'));
      },

      invalidChanged: function() {
        this.classList.toggle('invalid', this.invalid);
        this.fire('input-'+ (this.invalid ? 'invalid' : 'valid'), {value: this.inputValue});
      },

      inputValueChanged: function() {
        this.updateValidity_();
      },

      valueChanged: function() {
        this.inputValue = this.value;
      },

      requiredChanged: function() {
        this.updateValidity_();
      },

      attributeChanged: function(attr, oldVal, curVal) {
        if (attr === 'tabindex') {
          this.handleTabindex(curVal);
        }
      },

      handleTabindex: function(tabindex) {
        if (tabindex > 0) {
          this.$.input.setAttribute('tabindex', -1);
        } else {
          this.$.input.removeAttribute('tabindex');
        }
      },

      /**
       * Commits the inputValue to value.
       *
       * @method commit
       */
      commit: function() {
         this.value = this.inputValue;
      },

      updateValidity_: function() {
        if (this.$.input.willValidate) {
          this.invalid = !this.$.input.validity.valid;
        }
      },

      keydownAction: function() {
        // for type = number, the value is the empty string unless the input is a valid number.
        // FIXME(yvonne): check other types
        if (this.type === 'number') {
          this.async(function() {
            this.updateValidity_();
          });
        }
      },

      inputChangeAction: function() {
        this.commit();
        if (!window.ShadowDOMPolyfill) {
          // re-fire event that does not bubble across shadow roots
          this.fire('change', null, this);
        }
      },

      focusAction: function(e) {
        if (this.getAttribute('tabindex') > 0) {
          // Forward focus to the inner input if tabindex is set on the element
          // This will not cause an infinite loop because focus will not fire on the <input>
          // again if it's already focused.
          this.$.input.focus();
        }
      },

      inputFocusAction: function(e) {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event if polyfill
          this.fire('focus', null, this, false);
        }
      },

      inputBlurAction: function() {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event
          this.fire('blur', null, this, false);
        }
      },

      blur: function() {
        // forward blur method to the internal input / textarea element
        this.$.input.blur();
      },

      click: function() {
        // forward click method to the internal input / textarea element
        this.$.input.click();
      },

      focus: function() {
        // forward focus method to the internal input / textarea element
        this.$.input.focus();
      },

      select: function() {
        // forward select method to the internal input / textarea element
        this.$.input.focus();
      },

      setSelectionRange: function(selectionStart, selectionEnd, selectionDirection) {
        // forward setSelectionRange method to the internal input / textarea element
        this.$.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
      },

      setRangeText: function(replacement, start, end, selectMode) {
        // forward setRangeText method to the internal input element
        if (!this.multiline) {
          this.$.input.setRangeText(replacement, start, end, selectMode);
        }
      },

      stepDown: function(n) {
        // forward stepDown method to the internal input element
        if (!this.multiline) {
          this.$.input.stepDown(n);
        }
      },

      stepUp: function(n) {
        // forward stepUp method to the internal input element
        if (!this.multiline) {
          this.$.input.stepUp(n);
        }
      },

      get willValidate() {
        return this.$.input.willValidate;
      },

      get validity() {
        return this.$.input.validity;
      },

      get validationMessage() {
        return this.$.input.validationMessage;
      },

      checkValidity: function() {
        var r = this.$.input.checkValidity();
        this.updateValidity_();
        return r;
      },

      setCustomValidity: function(message) {
        this.$.input.setCustomValidity(message);
        this.updateValidity_();
      }

    });
  