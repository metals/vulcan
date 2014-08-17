Polymer('core-field');;


  Polymer('core-header-panel', {
    
    /**
     * Fired when the content has been scrolled.  `details.target` returns
     * the scrollable element which you can use to access scroll info such as
     * `scrollTop`.
     *
     * @event scroll
     */

    publish: {
      /**
       * Controls header and scrolling behavior. Options are
       * `standard`, `seamed`, `waterfall`, `waterfall-tall`, 
       * `waterfall-medium-tall`, `scroll` and `cover`.
       * Default is `standard`.
       *
       * `standard`: The header is a step above the panel. The header will consume the 
       * panel at the point of entry, preventing it from passing through to the 
       * opposite side.
       *
       * `seamed`: The header is presented as seamed with the panel.
       *
       * `waterfall`: Similar to standard mode, but header is initially presented as 
       * seamed with panel, but then separates to form the step.
       *
       * `waterfall-tall`: The header is initially taller (`tall` class is added to 
       * the header).  As the user scrolls, the header separates (forming an edge)
       * while condensing (`tall` class is removed from the header).
       *
       * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
       *
       * `cover`: The panel covers the whole `core-header-panel` including the
       * header. This allows user to style the panel in such a way that the panel is
       * partially covering the header.
       *
       *     <style>
       *       core-header-panel[mode=cover]::shadow #mainContainer {
       *         left: 80px;
       *       }
       *       .content {
       *         margin: 60px 60px 60px 0;
       *       }
       *     </style>
       * 
       *     <core-header-panel mode="cover">
       *       <core-appbar class="tall">
       *         <core-icon-button icon="menu"></core-icon-button>
       *       </core-appbar>
       *       <div class="content"></div>
       *     </core-header-panel>
       *
       * @attribute mode
       * @type string
       * @default ''
       */
      mode: {value: '', reflect: true},
      
      /**
       * The class used in waterfall-tall mode.  Change this if the header
       * accepts a different class for toggling height, e.g. "medium-tall"
       *
       * @attribute tallClass
       * @type string
       * @default 'tall'
       */
      tallClass: 'tall',
      
      /**
       * If true, the drop-shadow is always shown no matter what mode is set to.
       *
       * @attribute shadow
       * @type boolean
       * @default false
       */
      shadow: false
    },
    
    domReady: function() {
      this.async('scroll');
    },

    modeChanged: function() {
      this.scroll();
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    /**
     * Returns the scrollable element.
     *
     * @property scroller
     * @type Object
     */
    get scroller() {
      return this.mode === 'scroll' ? 
          this.$.outerContainer : this.$.mainContainer;
    },
    
    scroll: function() {
      var shadowMode = {'waterfall': 1, 'waterfall-tall': 1};
      var noShadow = {'seamed': 1, 'cover': 1, 'scroll': 1};
      var tallMode = {'waterfall-tall': 1};
      
      var main = this.$.mainContainer;
      var header = this.header;
      
      var sTop = main.scrollTop;
      var atTop = sTop === 0;
      
      if (header) {
        this.$.dropShadow.classList.toggle('hidden', !this.shadow &&
            (atTop && shadowMode[this.mode] || noShadow[this.mode]));
        
        if (tallMode[this.mode]) {
          header.classList.toggle(this.tallClass, atTop || 
              main.scrollHeight < this.$.outerContainer.offsetHeight);
        }
        
        header.classList.toggle('animate', tallMode[this.mode]);
      }
      
      this.fire('scroll', {target: this.scroller}, this, false);
    }

  });

;


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


    Polymer('core-iconset-svg', {


      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,
      type: 'iconset',

      created: function() {
        this._icons = {};
      },

      ready: function() {
        this.super();
        this.updateIcons();
      },

      iconById: function(id) {
        return this._icons[id] || (this._icons[id] = this.querySelector('#' + id));
      },

      cloneIcon: function(id) {
        var icon = this.iconById(id);
        if (icon) {
          var content = icon.cloneNode(true);
          content.removeAttribute('id');
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + this.iconSize + ' ' +
              this.iconSize);
          // NOTE(dfreedm): work around https://crbug.com/370136
          svg.style.pointerEvents = 'none';
          svg.appendChild(content);
          return svg;
        }
      },

      get iconNames() {
        if (!this._iconNames) {
          this._iconNames = this.findIconNames();
        }
        return this._iconNames;
      },

      findIconNames: function() {
        var icons = this.querySelectorAll('[id]').array();
        if (icons.length) {
          return icons.map(function(n){ return n.id });
        }
      },

      /**
       * Applies an icon to the given element. The svg icon is added to the
       * element's shadowRoot if one exists or directly to itself.
       *
       * @method applyIcon
       * @param {Element} element The element to which the icon is
       * applied.
       * @param {String|Number} icon The name the icon to apply.
       * @return {Element} The icon element
       */
      applyIcon: function(element, icon) {
        var root = element;
        // remove old
        var old = root.querySelector('svg');
        if (old) {
          old.remove();
        }
        // install new
        var svg = this.cloneIcon(icon);
        if (!svg) {
          return;
        }
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.display = 'block';
        root.insertBefore(svg, root.firstElementChild);
        return svg;
      },
      
      /**
       * Tell users of the iconset, that the set has loaded.
       * This finds all elements matching the selector argument and calls 
       * the method argument on them.
       * @method updateIcons
       * @param selector {string} css selector to identify iconset users, 
       * defaults to '[icon]'
       * @param method {string} method to call on found elements, 
       * defaults to 'updateIcon'
       */
      updateIcons: function(selector, method) {
        selector = selector || '[icon]';
        method = method || 'updateIcon';
        var deep = window.ShadowDOMPolyfill ? '' : 'html /deep/ ';
        var i$ = document.querySelectorAll(deep + selector);
        for (var i=0, e; e=i$[i]; i++) {
          if (e[method]) {
            e[method].call(e);
          }
        }
      }
      

    });

  ;


    Polymer('core-icon-button', {

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
       * If true, border is placed around the button to indicate it's
       * active state.
       *
       * @attribute active
       * @type boolean
       * @default false
       */
      active: false,

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

      activeChanged: function() {
        this.classList.toggle('selected', this.active);
      }

    });

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
  ;


  Polymer('core-item', {
    
    /**
     * The URL of an image for the icon.
     *
     * @attribute src
     * @type string
     * @default ''
     */

    /**
     * Specifies the icon from the Polymer icon set.
     *
     * @attribute icon
     * @type string
     * @default ''
     */

    /**
     * Specifies the label for the menu item.
     *
     * @attribute label
     * @type string
     * @default ''
     */

  });

;

  
  (function() {
  
    Polymer('core-layout', {

      isContainer: false,
      /**
       * Controls if the element lays out vertically or not.
       *
       * @attribute vertical
       * @type boolean
       * @default false
       */
      vertical: false,
      /**
       * Controls how the items are aligned in the main-axis direction. For 
       * example for a horizontal layout, this controls how each item is aligned
       * horizontally.
       *
       * @attribute justify
       * @type string start|center|end|between
       * @default ''
       */
      justify: '',
      /**
       * Controls how the items are aligned in cross-axis direction. For 
       * example for a horizontal layout, this controls how each item is aligned
       * vertically.
       *
       * @attribute align
       * @type string start|center|end
       * @default ''
       */
      align: '',
      /**
       * Controls whether or not the items layout in reverse order.
       *
       * @attribute reverse
       * @type boolean
       * @default false
       */
      reverse: false,
      layoutPrefix: 'core-',
  
      // NOTE: include template so that styles are loaded, but remove
      // so that we can decide dynamically what part to include
      registerCallback: function(polymerElement) {
        var template = polymerElement.querySelector('template');
        this.styles = template.content.querySelectorAll('style').array();
        this.styles.forEach(function(s) {
          s.removeAttribute('no-shim');
        })
      },
  
      fetchTemplate: function() {
        return null;
      },
  
      attached: function() {
        this.installScopeStyle(this.styles[0]);
        if (this.children.length) {
          this.isContainer = true;
        }
        var container = this.isContainer ? this : this.parentNode;  
        // detect if laying out a shadowRoot host.
        var forHost = container instanceof ShadowRoot;
        if (forHost) {
          this.installScopeStyle(this.styles[1], 'host');
          container = container.host || document.body;
        }
        this.layoutContainer = container;
      },

      detached: function() {
        this.layoutContainer = null;
      },

      layoutContainerChanged: function(old) {
        this.style.display = this.layoutContainer === this ? null : 'none';
        this.verticalChanged();
        this.alignChanged();
        this.justifyChanged();
      },

      setLayoutClass: function(prefix, old, newValue) {
        if (this.layoutContainer) {
          prefix = this.layoutPrefix + prefix;
          if (old) {
            this.layoutContainer.classList.remove(prefix + old);
          }
          if (newValue) {
            this.layoutContainer.classList.add(prefix + newValue);
          }
        }
      },

      verticalChanged: function(old) {
        old = old ? 'v' : 'h';
        var vertical = this.vertical ? 'v' : 'h';
        this.setLayoutClass('', old, vertical);
      },

      alignChanged: function(old) {
        this.setLayoutClass('align-', old, this.align);
      },

      justifyChanged: function(old) {
        this.setLayoutClass('justify-', old, this.justify);
      },

      reverseChanged: function(old) {
        old = old ? 'reverse' : '';
        var newValue = this.reverse ? 'reverse' : '';
        this.setLayoutClass('', old, newValue);
      }

    });

  })();
  ;

  (function() {

    Polymer('core-layout-grid', {

      nodes: null,
      layout: null,
      auto: false,

      created: function() {
        this.layout = [];
      },

      nodesChanged: function() {
        this.invalidate();
      },

      layoutChanged: function() {
        this.invalidate();
      },

      autoNodes: function() {
        this.nodes = this.parentNode.children.array().filter(
          function(node) {
            switch(node.localName) {
              case 'core-layout-grid':
              case 'style':
                return false;
            }
            return true;
          }
        );
      },

      invalidate: function() {
        if (this.layout && this.layout.length) {
          // job debounces layout, only letting it occur every N ms
          this.layoutJob = this.job(this.layoutJob, this.relayout);
        }
      },

      relayout: function() {
        if (!this.nodes || this.auto) {
          this.autoNodes();
        }
        layout(this.layout, this.nodes);
        this.asyncFire('core-layout');
      }

    });

    //

    var lineParent;

    function line(axis, p, d) {
      var l = document.createElement('line');
      var extent = (axis === 'left' ? 'width' : 
        (axis === 'top' ? 'height' : axis));
      l.setAttribute('extent', extent);
      if (d < 0) {
        axis = (axis === 'left' ? 'right' : 
          (axis === 'top' ? 'bottom' : axis));
      }
      p = Math.abs(p);
      l.style[axis] = p + 'px';
      l.style[extent] = '0px';
      lineParent.appendChild(l);
    }

    var colCount, colOwners, rowCount, rowOwners;

    function matrixillate(matrix) {
      // mesaure the matrix, must be rectangular
      rowCount = matrix.length;
      colCount = rowCount && matrix[0].length || 0;
      // transpose matrix
      var transpose = [];
      for (var i=0; i<colCount; i++) {
        var c = [];
        for (var j=0; j<rowCount; j++) {
          c.push(matrix[j][i]);
        }
        transpose.push(c);
      }
      // assign sizing control
      colOwners = findOwners(matrix);
      rowOwners = findOwners(transpose);
      //console.log('colOwners', colOwners);
      //console.log('rowOwners', rowOwners);
    }

    function findOwners(matrix) {
      var majCount = matrix.length;
      var minCount = majCount && matrix[0].length || 0;
      var owners = [];
      // for each column (e.g.)
      for (var i=0; i<minCount; i++) {
        // array of contained areas
        var contained = {};
        // look at each row to find a containing area
        for (var j=0; j<majCount; j++) {
          // get the row vector
          var vector = matrix[j]
          // node index at [i,j]
          var nodei = vector[i];
          // if a node is there
          if (nodei) {
            // determine if it bounds this column
            var owns = false;
            if (i === 0) {
              owns = (i === minCount-1) || (nodei !== vector[i+1]);
            } else if (i === minCount - 1) {
              owns = (i === 0) || (nodei !== vector[i-1]);
            } else {
              owns = nodei !== vector[i-1] && nodei !== vector[i+1];
            }
            if (owns) {
              contained[nodei] = 1;
            }
          }
          // store the owners for this column
          owners[i] = contained;
        }
      }
      return owners;
    }

    var nodes;

    function colWidth(i) {
      for (var col in colOwners[i]) {
        col = Number(col);
        if (col === 0) {
          return 96;
        }
        var node = nodes[col - 1];
        if (node.hasAttribute('h-flex') || node.hasAttribute('flex')) {
          return -1;
        }
        var w = node.offsetWidth;
        //console.log('colWidth(' + i + ') ==', w);
        return w;
      }
      return -1;
    }

    function rowHeight(i) {
      for (var row in rowOwners[i]) {
        row = Number(row);
        if (row === 0) {
          return 96;
        }
        var node = nodes[row - 1];
        if (node.hasAttribute('v-flex') || node.hasAttribute('flex')) {
          return -1;
        }
        var h = node.offsetHeight;
        //console.log('rowHeight(' + i + ') ==', h);
        return h;
      }
      return -1;
    }

    var m = 0;

    function railize(count, sizeFn) {
      //
      // create rails for `count` tracks using 
      // sizing function `sizeFn(trackNo)`
      //
      // for n tracks there are (n+1) rails
      //
      //   |track|track|track|
      //  0|->sz0|->sz1|<-sz2|0
      //
      //   |track|track|track|
      //  0|->sz0|     |<-sz2|0
      //
      // there can be one elastic track per set
      //
      //   |track|track|track|track|
      //  0|-->s0|-->s1|<--s1|<--s2|0
      //
      // sz1 spans multiple  tracks which makes
      // it elastic (it's underconstrained)
      //
      var rails = [];
      var a = 0;
      for (var i=0, x; i<count; i++) {
        rails[i] = {p: a, s: 1};
        x = sizeFn(i) + m + m;
        if (x == -1) {
          break;
        }
        a += x;
      }
      if (i === count) {
        rails[i] = {p: 0, s: -1};
      }
      var b = 0;
      for (var ii=count, x; ii>i; ii--) {
        rails[ii] = {p: b, s: -1};
        x = sizeFn(ii - 1) + m + m;
        if (x !== -1) {
          b += x;
        }
      }
      return rails;
    }

    // TODO(sjmiles): this code tries to preserve actual position,
    // so 'unposition' is really 'naturalize' or something
    function unposition(box) {
      var style = box.style;
      //style.right = style.bottom = style.width = style.height = '';
      style.position = 'absolute';
      style.display = 'inline-block';
      style.boxSizing = style.mozBoxSizing = 'border-box';
    }

    function _position(style, maj, min, ext, a, b) {
      style[maj] = style[min] = '';
      style[ext] = 'auto';
      if (a.s < 0 && b.s < 0) {
        var siz = a.p - b.p - m - m;
        style[ext] = siz + 'px';
        var c = 'calc(100% - ' + (b.p + siz + m) + 'px' + ')';
        style[maj] = '-webkit-' + c;
        style[maj] = c;
      } else if (b.s < 0) {
        style[maj] = a.p + m + 'px';
        style[min] = b.p + m + 'px';
      } else {
        style[maj] = a.p + m + 'px';
        style[ext] = b.p - a.p - m - m + 'px';
      }
    }

    function position(elt, left, right, top, bottom) {
      _position(elt.style, 'top', 'bottom', 'height', rows[top], 
          rows[bottom]);
      _position(elt.style, 'left', 'right', 'width', columns[left], 
          columns[right]);
    }

    function layout(matrix, anodes, alineParent) {
      //console.group('layout');

      lineParent = alineParent;
      nodes = anodes;
      matrixillate(matrix);

      nodes.forEach(unposition);

      columns = railize(colCount, colWidth);
      rows = railize(rowCount, rowHeight);

      if (alineParent) {
        //console.group('column rails');
        columns.forEach(function(c) {
          //console.log(c.p, c.s);
          line('left', c.p, c.s);
        });
        //console.groupEnd();

        //console.group('row rails');
        rows.forEach(function(r) {
          //console.log(r.p, r.s);
          line('top', r.p, r.s);
        });
        //console.groupEnd();
      }

      //console.group('rail boundaries');
      nodes.forEach(function(node, i) {
        // node indices are 1-based
        var n = i + 1;
        // boundary rails
        var l, r, t = 1e10, b = -1e10;
        matrix.forEach(function(vector, i) {
          var f = vector.indexOf(n);
          if (f > -1) {
            l = f;
            r = vector.lastIndexOf(n) + 1;
            t = Math.min(t, i);
            b = Math.max(b, i) + 1;
          }
        });
        if (l == undefined) {
          //console.log('unused');
          node.style.position = 'absolute';
          var offscreen = node.getAttribute('offscreen');
          switch (offscreen) {
            case 'basement':
              node.style.zIndex = 0;
              break;
            case 'left':
            case 'top':
              node.style[offscreen] = node.offsetWidth * -2 + 'px';
              break;
            case 'right':
              node.style.left = node.offsetParent.offsetWidth 
                  + node.offsetWidth + 'px';
              break;
            case 'bottom':
              node.style.top = node.parentNode.offsetHeight 
                  + node.offsetHeight + 'px';
              break;
            default:
              node.style[Math.random() >= 0.5 ? 'left' : 'top'] = '-110%';
          }
          //node.style.opacity = 0;
          node.style.pointerEvents = 'none';
        } else {
          node.style.pointerEvents = '';
          //node.style.opacity = '';
          //console.log(l, r, t, b);
          position(node, l, r, t, b);
        }
      });
      //console.groupEnd();
      //console.groupEnd();
    }

  })();
;


    Polymer('core-layout-trbl', {

      vertical: false,

      ready: function() {
        this.setAttribute('nolayout', '');
      },

      attached: function() {
        this.asyncMethod(function() {
          this.prepare();
          this.layout();
        });
      },

      prepare: function() {
        var parent = this.parentNode.host || this.parentNode;
        // explicit position harmful on <body>
        if (parent.localName !== 'body') {
        // may recalc
          var cs = window.getComputedStyle(parent);
          if (cs.position === 'static') {
            parent.style.position = 'relative';
          }
          //parent.style.overflow = 'hidden';
        }
        // changes will cause another recalc at next validation step
        var stylize = this.stylize, vertical;
        this.parentNode.childNodes.array().forEach(function(c, i) {
          if (c.nodeType === Node.ELEMENT_NODE && !c.hasAttribute('nolayout')) {
            stylize(c, {
              position: 'absolute',
              boxSizing: 'border-box',
              MozBoxSizing: 'border-box',
            });
            // test for auto-vertical
            if (vertical === undefined) {
              vertical = (c.offsetWidth == 0 && c.offsetHeight !== 0);
            }
          }
        });
        this.vertical = this.vertical || vertical;
      },

      /**
       * Arrange sibling nodes end-to-end in one dimension.
       *
       * Arrangement is horizontal unless the `vertical`
       * attribute is applied on this node.
       *
       * @method layout
       */
      layout: function() {
        var parent = this.parentNode.host || this.parentNode;
        var vertical = this.vertical;
        var ww = 0, hh = 0, pre = [], fit, post = [];
        var list = pre;
        // gather element information (at most one recalc)
        this.parentNode.childNodes.array().forEach(function(c, i) {
          if (c.nodeType===Node.ELEMENT_NODE && !c.hasAttribute('nolayout')) {
            var info = {
              element: c,
              w: c.offsetWidth,
              h: c.offsetHeight
            };
            if (!c.hasAttribute('fit') && !c.hasAttribute('flex')) {
              ww += c.offsetWidth;
              hh += c.offsetHeight;
              list.push(info);
            } else {
              fit = c;
              list = post;
              ww = hh = 0;
            }
          }
        });
        // update layout styles (invalidate, no recalc)
        var v = 0;
        var mxp = 0, myp = 0;
        var stylize = this.stylize;
        pre.forEach(function(info) {
          if (vertical) {
            stylize(info.element, {
              top: v + 'px', right: mxp, height: info.h + 'px', left: mxp
            });
          } else {
            stylize(info.element, {
              top: myp, width: info.w + 'px', bottom: myp, left: v + 'px'
            });
          }
          v += vertical ? info.h : info.w;
        });
        if (fit) {
          if (vertical) {
            stylize(fit, {
              top: v + 'px', right: mxp, bottom: hh + 'px', left: mxp
            });
          } else {
            stylize(fit, {
              top: myp, right: ww + 'px', bottom: myp, left: v + 'px'
            });
          }
          v = vertical ? hh : ww;
          post.forEach(function(info) {
            v -= vertical ? info.h : info.w;
            if (vertical) {
              stylize(info.element, {
                height: info.h + 'px', right: mxp, bottom: v + 'px', left: mxp
              });
            } else {
              stylize(info.element, {
                top: myp, right: v + 'px', bottom: myp, width: info.w + 'px'
              });
            }
          });
        }
      },

      stylize: function(element, styles) {
        var style = element.style;
        Object.keys(styles).forEach(function(k){
          style[k] = styles[k];
        });
      }

  });

  ;

    Polymer('core-selection', {
      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,
      ready: function() {
        this.clear();
      },
      clear: function() {
        this.selection = [];
      },
      /**
       * Retrieves the selected item(s).
       * @method getSelection
       * @returns Returns the selected item(s). If the multi property is true,
       * getSelection will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
      */
      getSelection: function() {
        return this.multi ? this.selection : this.selection[0];
      },
      /**
       * Indicates if a given item is selected.
       * @method isSelected
       * @param {any} item The item whose selection state should be checked.
       * @returns Returns true if `item` is selected.
      */
      isSelected: function(item) {
        return this.selection.indexOf(item) >= 0;
      },
      setItemSelected: function(item, isSelected) {
        if (item !== undefined && item !== null) {
          if (isSelected) {
            this.selection.push(item);
          } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
              this.selection.splice(i, 1);
            }
          }
          this.fire("core-select", {isSelected: isSelected, item: item});
        }
      },
      /**
       * Set the selection state for a given `item`. If the multi property
       * is true, then the selected state of `item` will be toggled; otherwise
       * the `item` will be selected.
       * @method select
       * @param {any} item: The item to select.
      */
      select: function(item) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.getSelection() !== item) {
          this.setItemSelected(this.getSelection(), false);
          this.setItemSelected(item, true);
        }
      },
      /**
       * Toggles the selection state for `item`.
       * @method toggle
       * @param {any} item: The item to toggle.
      */
      toggle: function(item) {
        this.setItemSelected(item, !this.isSelected(item));
      }
    });
  ;

(function() {

  Polymer('core-list', {
    
    publish: {
      /**
       * Fired when an item element is tapped.
       * 
       * @event core-activate
       * @param {Object} detail
       *   @param {Object} detail.item the item element
       */

      /**
       * 
       * An array of source data for the list to display.
       *
       * @attribute data
       * @type array
       * @default null
       */
      data: null,

      /**
       * 
       * An optional element on which to listen for scroll events.
       *
       * @attribute scrollTarget
       * @type Element
       * @default core-list
       */
      scrollTarget: null,

      /**
       * 
       * The height of a list item. `core-list` currently supports only fixed-height
       * list items. This height must be specified via the height property.
       *
       * @attribute height
       * @type number
       * @default 80
       */
      height: 80,

      /**
       * 
       * The number of extra items rendered above the minimum set required to
       * fill the list's height.
       *
       * @attribute extraItems
       * @type number
       * @default 30
       */
      extraItems: 30,

      /**
       * 
       * The property set on the list view data to represent selection state. 
       * This should set so that it does not conflict with other data properties.
       * Note, selection data is not stored on the data in given in the data property.
       *
       * @attribute selectedProperty
       * @type string
       * @default 'selected'
       */
      selectedProperty: 'selected',

      // TODO(sorvell): experimental
      /**
       * 
       * If true, data is sync'd from the list back to the list's data.
       *
       * @attribute sync
       * @type boolean
       * @default false
       */
      sync: false,

      /**
       * 
       * Set to true to support multiple selection.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false

    },
    
    observe: {
      'data template scrollTarget': 'initialize'
    },

    ready: function() {
      this.clearSelection();
      this._boundScrollHandler = this.scrollHandler.bind(this);
    },

    attached: function() {
      this.template = this.querySelector('template');
    },

    // TODO(sorvell): it'd be nice to dispense with 'data' and just use 
    // template repeat's model. However, we need tighter integration
    // with TemplateBinding for this.
    initialize: function() {
      if (!this.data || !this.template) {
        return;
      }
      var target = this.scrollTarget || this;
      if (this._target !== target) {
        if (this._target) {
          this._target.removeEventListener('scroll', this._boundScrollHandler, false);
        }
        this._target = target;
        this._target.addEventListener('scroll', this._boundScrollHandler, false);
      }

      this.initializeViewport();
      this.initalizeData();
      this.onMutation(this, this.initializeItems);
    },

    // TODO(sorvell): need to handle resizing
    initializeViewport: function() {
      this.$.viewport.style.height = this.height * this.data.length + 'px';
      this._visibleCount = Math.ceil(this._target.offsetHeight / this.height);
      this._physicalCount = Math.min(this._visibleCount + this.extraItems,
          this.data.length);
      this._physicalHeight = this.height * this._physicalCount;
    },

    // TODO(sorvell): selection currently cannot be maintained when
    // items are added or deleted.
    initalizeData: function() {
      var exampleDatum = this.data[0] || {};
      this._propertyNames = Object.getOwnPropertyNames(exampleDatum);
      this._physicalData = new Array(this._physicalCount);
      for (var i = 0; i < this._physicalCount; ++i) {
        this._physicalData[i] = {};
        this.updateItem(i, i);
      }
      this.template.model = this._physicalData;
      this.template.setAttribute('repeat', '');
    },

    initializeItems: function() {
      this._physicalItems = new Array(this._physicalCount);
      for (var i = 0, item = this.template.nextElementSibling;
           item && i < this._physicalCount;
           ++i, item = item.nextElementSibling) {
        this._physicalItems[i] = item;
        item._transformValue = 0;
      }
      this.refresh(false);
    },

    updateItem: function(virtualIndex, physicalIndex) {
      var virtualDatum = this.data[virtualIndex];
      var physicalDatum = this._physicalData[physicalIndex];
      this.pushItemData(virtualDatum, physicalDatum);
      physicalDatum._physicalIndex = physicalIndex;
      physicalDatum._virtualIndex = virtualIndex;
      if (this.selectedProperty) {
        physicalDatum[this.selectedProperty] = this._selectedData.get(virtualDatum);
      }
    },

    pushItemData: function(source, dest) {
      for (var i = 0; i < this._propertyNames.length; ++i) {
        var propertyName = this._propertyNames[i];
        dest[propertyName] = source[propertyName];
      }
    },

    // experimental: push physical data back to this.data.
    // this is optional when scrolling and needs to be called at other times.
    syncData: function() {
      if (this.firstPhysicalIndex === undefined || 
          this.baseVirtualIndex === undefined) {
        return;
      }
      var p, v;
      for (var i = 0; i < this.firstPhysicalIndex; ++i) {
        p = this._physicalData[i];
        v = this.data[this.baseVirtualIndex + this._physicalCount + i];
        this.pushItemData(p, v);
      }
      for (var i = this.firstPhysicalIndex; i < this._physicalCount; ++i) {
        p = this._physicalData[i];
        v = this.data[this.baseVirtualIndex + i];
        this.pushItemData(p, v);
      }
    },

    scrollHandler: function(e, detail) {
      this._scrollTop = e.detail ? e.detail.target.scrollTop : e.target.scrollTop;
      this.refresh(false);
    },

    /**
     * Refresh the list at the current scroll position.
     *
     * @method refresh
     */
    refresh: function(force) {
      var firstVisibleIndex = Math.floor(this._scrollTop / this.height);
      var visibleMidpoint = firstVisibleIndex + this._visibleCount / 2;

      var firstReifiedIndex = Math.max(0, Math.floor(visibleMidpoint - 
          this._physicalCount / 2));
      firstReifiedIndex = Math.min(firstReifiedIndex, this.data.length - 
          this._physicalCount);

      var firstPhysicalIndex = firstReifiedIndex % this._physicalCount;
      var baseVirtualIndex = firstReifiedIndex - firstPhysicalIndex;

      var baseTransformValue = Math.floor(this.height * baseVirtualIndex);
      var nextTransformValue = Math.floor(baseTransformValue + 
          this._physicalHeight);

      var baseTransformString = 'translate3d(0,' + baseTransformValue + 'px,0)';
      var nextTransformString = 'translate3d(0,' + nextTransformValue + 'px,0)';
      // TODO(sorvell): experiemental for sync'ing back to virtual data.
      if (this.sync) {
        this.syncData();
      }
      this.firstPhysicalIndex = firstPhysicalIndex;
      this.baseVirtualIndex = baseVirtualIndex;

      for (var i = 0; i < firstPhysicalIndex; ++i) {
        var item = this._physicalItems[i];
        if (force || item._transformValue != nextTransformValue) {
          this.updateItem(baseVirtualIndex + this._physicalCount + i, i);
          setTransform(item, nextTransformString, nextTransformValue);
        }
      }
      for (var i = firstPhysicalIndex; i < this._physicalCount; ++i) {
        var item = this._physicalItems[i];
        if (force || item._transformValue != baseTransformValue) {
          this.updateItem(baseVirtualIndex + i, i);
          setTransform(item, baseTransformString, baseTransformValue);
        }
      }
    },

    // list selection
    tapHandler: function(e) {
      if (e.target === this) {
        return;
      }
      if (this.sync) {
        this.syncData();
      }
      var n = e.target;
      var model = n.templateInstance && n.templateInstance.model;
      if (model) {
        var vi = model._virtualIndex, pi = model._physicalIndex;
        var data = this.data[vi], item = this._physicalItems[pi];
        this.$.selection.select(data);
        this.asyncFire('core-activate', {data: data, item: item});
      }
    },

    selectedHandler: function(e, detail) {
      if (this.selectedProperty) {
        var i$ = this.indexesForData(detail.item);
        // TODO(sorvell): we should be relying on selection to store the
        // selected data but we want to optimize for lookup.
        this._selectedData.set(detail.item, detail.isSelected);
        if (i$.physical >= 0) {
          this.updateItem(i$.virtual, i$.physical);
        }
      }
    },

    /**
     * Select the list item at the given index.
     *
     * @method selectItem
     * @param {number} index 
     */
    selectItem: function(index) {
      var data = this.data[index];
      if (data) {
        this.$.selection.select(data);
      }
    },

    /**
     * Set the selected state of the list item at the given index.
     *
     * @method setItemSelected
     * @param {number} index 
     * @param {boolean} isSelected 
     */
    setItemSelected: function(index, isSelected) {
      var data = this.data[index];
      if (data) {
        this.$.selection.setItemSelected(data, isSelected);
      }
    },

    indexesForData: function(data) {
      var virtual = this.data.indexOf(data);
      var physical = this.virtualToPhysicalIndex(virtual);
      return { virtual: virtual, physical: physical };
    },

    virtualToPhysicalIndex: function(index) {
      for (var i=0, l=this._physicalData.length; i<l; i++) {
        if (this._physicalData[i]._virtualIndex === index) {
          return i;
        }
      }
      return -1;
    },

    get selection() {
      return this.$.selection.getSelection();
    },

    selectedChanged: function() {
      this.$.selection.select(this.selected);
    },

    clearSelection: function() {
      this._selectedData = new WeakMap();
      if (this.multi) {
        var s$ = this.selection;
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          this.$.selection.setItemSelected(s, false);
        }
      } else {
        this.$.selection.setItemSelected(this.selection, false);
      }
      this.$.selection.clear();
    },

    scrollToItem: function(index) {
      this.scrollTop = index * this.height;
    }

  });

  // determine proper transform mechanizm
  if (document.documentElement.style.transform !== undefined) {
    function setTransform(element, string, value) {
      element.style.transform = string;
      element._transformValue = value;
    }
  } else {
    function setTransform(element, string, value) {
      element.style.webkitTransform = string;
      element._transformValue = value;
    }
  }

})();
;


  Polymer('core-localstorage', {
    
    /**
     * Fired when a value is loaded from localStorage.
     * @event core-localstorage-load
     */
     
    /**
     * The key to the data stored in localStorage.
     *
     * @attribute name
     * @type string
     * @default null
     */
    name: '',
    
    /**
     * The data associated with the specified name.
     *
     * @attribute value
     * @type object
     * @default null
     */
    value: null,
    
    /**
     * If true, the value is stored and retrieved without JSON processing.
     *
     * @attribute useRaw
     * @type boolean
     * @default false
     */
    useRaw: false,
    
    /**
     * If true, auto save is disabled.
     *
     * @attribute autoSaveDisabled
     * @type boolean
     * @default false
     */
    autoSaveDisabled: false,
    
    attached: function() {
      // wait for bindings are all setup
      this.async('load');
    },
    
    valueChanged: function() {
      if (this.loaded && !this.autoSaveDisabled) {
        this.save();
      }
    },
    
    load: function() {
      var v = localStorage.getItem(this.name);
      if (this.useRaw) {
        this.value = v;
      } else {
        // localStorage has a flaw that makes it difficult to determine
        // if a key actually exists or not (getItem returns null if the
        // key doesn't exist, which is not distinguishable from a stored
        // null value)
        // however, if not `useRaw`, an (unparsed) null value unambiguously
        // signals that there is no value in storage (a stored null value would
        // be escaped, i.e. "null")
        // in this case we save any non-null current (default) value
        if (v === null) {
          if (this.value !== null) {
            this.save();
          }
        } else {
          try {
            v = JSON.parse(v);
          } catch(x) {
          }
          this.value = v;
        }
      }
      this.loaded = true;
      this.asyncFire('core-localstorage-load');
    },
    
    /** 
     * Saves the value to localStorage.
     *
     * @method save
     */
    save: function() {
      var v = this.useRaw ? this.value : JSON.stringify(this.value);
      localStorage.setItem(this.name, v);
    }
    
  });

;

    Polymer('core-media-query', {

      /**
       * The Boolean return value of the media query
       *
       * @attribute queryMatches
       * @type Boolean
       * @default false
       */
      queryMatches: false,

      /**
       * The CSS media query to evaulate
       *
       * @attribute query
       * @type string
       * @default ''
       */
      query: '',
      ready: function() {
        this._mqHandler = this.queryHandler.bind(this);
        this._mq = null;
      },
      queryChanged: function() {
        if (this._mq) {
          this._mq.removeListener(this._mqHandler);
        }
        var query = this.query;
        if (query[0] !== '(') {
          query = '(' + this.query + ')';
        }
        this._mq = window.matchMedia(query);
        this._mq.addListener(this._mqHandler);
        this.queryHandler(this._mq);
      },
      queryHandler: function(mq) {
        this.queryMatches = mq.matches;
        this.asyncFire('core-media-change', mq);
      }
    });
  ;


    Polymer('core-selector', {

      /**
       * Gets or sets the selected element.  Default to use the index
       * of the item element.
       *
       * If you want a specific attribute value of the element to be
       * used instead of index, set "valueattr" to that attribute name.
       *
       * Example:
       *
       *     <core-selector valueattr="label" selected="foo">
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       * In multi-selection this should be an array of values.
       *
       * Example:
       *
       *     <core-selector id="selector" valueattr="label" multi>
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       *     this.$.selector.selected = ['foo', 'zot'];
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       * 
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the attribute to set on the selected element to indicate
       * its active state.
       *
       * @attribute selectedAttribute
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'active',

      /**
       * Returns the currently selected element. In multi-selection this returns
       * an array of selected elements.
       * 
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * In single selection, this returns the model associated with the
       * selected element.
       * 
       * @attribute selectedModel
       * @type Object
       * @default null
       */
      selectedModel: null,

      /**
       * In single selection, this returns the selected index.
       *
       * @attribute selectedIndex
       * @type number
       * @default -1
       */
      selectedIndex: -1,

      /**
       * The target element that contains items.  If this is not set 
       * core-selector is the container.
       * 
       * @attribute target
       * @type Object
       * @default null
       */
      target: null,

      /**
       * This can be used to query nodes from the target node to be used for 
       * selection items.  Note this only works if the 'target' property is set.
       *
       * Example:
       *
       *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
       *     <form id="myForm">
       *       <label><input type="radio" name="color" value="red"> Red</label> <br>
       *       <label><input type="radio" name="color" value="green"> Green</label> <br>
       *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
       *       <p>color = {{color}}</p>
       *     </form>
       * 
       * @attribute itemsSelector
       * @type string
       * @default ''
       */
      itemsSelector: '',

      /**
       * The event that would be fired from the item element to indicate
       * it is being selected.
       *
       * @attribute activateEvent
       * @type string
       * @default 'tap'
       */
      activateEvent: 'tap',

      /**
       * Set this to true to disallow changing the selection via the
       * `activateEvent`.
       *
       * @attribute notap
       * @type boolean
       * @default false
       */
      notap: false,

      ready: function() {
        this.activateListener = this.activateHandler.bind(this);
        this.observer = new MutationObserver(this.updateSelected.bind(this));
        if (!this.target) {
          this.target = this;
        }
      },

      get items() {
        if (!this.target) {
          return [];
        }
        var nodes = this.target !== this ? (this.itemsSelector ? 
            this.target.querySelectorAll(this.itemsSelector) : 
                this.target.children) : this.$.items.getDistributedNodes();
        return Array.prototype.filter.call(nodes || [], function(n) {
          return n && n.localName !== 'template';
        });
      },

      targetChanged: function(old) {
        if (old) {
          this.removeListener(old);
          this.observer.disconnect();
          this.clearSelection();
        }
        if (this.target) {
          this.addListener(this.target);
          this.observer.observe(this.target, {childList: true});
          this.updateSelected();
        }
      },

      addListener: function(node) {
        Polymer.addEventListener(node, this.activateEvent, this.activateListener);
      },

      removeListener: function(node) {
        Polymer.removeEventListener(node, this.activateEvent, this.activateListener);
      },

      get selection() {
        return this.$.selection.getSelection();
      },

      selectedChanged: function() {
        this.updateSelected();
      },

      updateSelected: function() {
        this.validateSelected();
        if (this.multi) {
          this.clearSelection();
          this.selected && this.selected.forEach(function(s) {
            this.valueToSelection(s);
          }, this);
        } else {
          this.valueToSelection(this.selected);
        }
      },

      validateSelected: function() {
        // convert to an array for multi-selection
        if (this.multi && !Array.isArray(this.selected) && 
            this.selected !== null && this.selected !== undefined) {
          this.selected = [this.selected];
        }
      },

      clearSelection: function() {
        if (this.multi) {
          this.selection.slice().forEach(function(s) {
            this.$.selection.setItemSelected(s, false);
          }, this);
        } else {
          this.$.selection.setItemSelected(this.selection, false);
        }
        this.selectedItem = null;
        this.$.selection.clear();
      },

      valueToSelection: function(value) {
        var item = (value === null || value === undefined) ? 
            null : this.items[this.valueToIndex(value)];
        this.$.selection.select(item);
      },

      updateSelectedItem: function() {
        this.selectedItem = this.selection;
      },

      selectedItemChanged: function() {
        if (this.selectedItem) {
          var t = this.selectedItem.templateInstance;
          this.selectedModel = t ? t.model : undefined;
        } else {
          this.selectedModel = null;
        }
        this.selectedIndex = this.selectedItem ? 
            parseInt(this.valueToIndex(this.selected)) : -1;
      },

      valueToIndex: function(value) {
        // find an item with value == value and return it's index
        for (var i=0, items=this.items, c; (c=items[i]); i++) {
          if (this.valueForNode(c) == value) {
            return i;
          }
        }
        // if no item found, the value itself is probably the index
        return value;
      },

      valueForNode: function(node) {
        return node[this.valueattr] || node.getAttribute(this.valueattr);
      },

      // events fired from <core-selection> object
      selectionSelect: function(e, detail) {
        this.updateSelectedItem();
        if (detail.item) {
          this.applySelection(detail.item, detail.isSelected);
        }
      },

      applySelection: function(item, isSelected) {
        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }
        if (this.selectedProperty) {
          item[this.selectedProperty] = isSelected;
        }
        if (this.selectedAttribute && item.setAttribute) {
          if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
          } else {
            item.removeAttribute(this.selectedAttribute);
          }
        }
      },

      // event fired from host
      activateHandler: function(e) {
        if (!this.notap) {
          var i = this.findDistributedTarget(e.target, this.items);
          if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
              if (this.selected) {
                this.addRemoveSelected(s);
              } else {
                this.selected = [s];
              }
            } else {
              this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
          }
        }
      },

      addRemoveSelected: function(value) {
        var i = this.selected.indexOf(value);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(value);
        }
        this.valueToSelection(value);
      },

      findDistributedTarget: function(target, nodes) {
        // find first ancestor of target (including itself) that
        // is in nodes, if any
        while (target && target != this) {
          var i = Array.prototype.indexOf.call(nodes, target);
          if (i >= 0) {
            return i;
          }
          target = target.parentNode;
        }
      }
    });
  ;
Polymer('core-menu');;


  Polymer('core-submenu', {

    publish: {
      active: {value: false, reflect: true}
    },

    opened: false,

    get items() {
      return this.$.submenu.items;
    },

    hasItems: function() {
      return !!this.items.length;
    },

    unselectAllItems: function() {
      this.$.submenu.selected = null;
      this.$.submenu.clearSelection();
    },

    activeChanged: function() {
      if (this.hasItems()) {
        this.opened = this.active;
      }
      if (!this.active) {
        this.unselectAllItems();
      }
    },
    
    toggle: function() {
      this.opened = !this.opened;
    },

    activate: function() {
      if (this.hasItems() && this.active) {
        this.toggle();
        this.unselectAllItems();
      }
    }
    
  });

;

    Polymer('core-transition', {
      
      type: 'transition',

      /**
       * Run the animation.
       *
       * @method go
       * @param {Node} node The node to apply the animation on
       * @param {Object} state State info
       */
      go: function(node, state) {
        this.complete(node);
      },

      /**
       * Set up the animation. This may include injecting a stylesheet,
       * applying styles, creating a web animations object, etc.. This
       *
       * @method setup
       * @param {Node} node The animated node
       */
      setup: function(node) {
      },

      /**
       * Tear down the animation.
       *
       * @method teardown
       * @param {Node} node The animated node
       */
      teardown: function(node) {
      },

      /**
       * Called when the animation completes. This function also fires the
       * `core-transitionend` event.
       *
       * @method complete
       * @param {Node} node The animated node
       */
      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      /**
       * Utility function to listen to an event on a node once.
       *
       * @method listenOnce
       * @param {Node} node The animated node
       * @param {string} event Name of an event
       * @param {Function} fn Event handler
       * @param {Array} args Additional arguments to pass to `fn`
       */
      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  ;

    Polymer('core-key-helper', {
      ENTER_KEY: 13,
      ESCAPE_KEY: 27
    });
  ;

(function() {

  Polymer('core-overlay-layer', {
    publish: {
      opened: false
    },
    openedChanged: function() {
      this.classList.toggle('core-opened', this.opened);
    },
    /**
     * Adds an element to the overlay layer
     */
    addElement: function(element) {
      if (!this.parentNode) {
        document.querySelector('body').appendChild(this);
      }
      if (element.parentNode !== this) {
        element.__contents = [];
        var ip$ = element.querySelectorAll('content');
        for (var i=0, l=ip$.length, n; (i<l) && (n = ip$[i]); i++) {
          this.moveInsertedElements(n);
          this.cacheDomLocation(n);
          n.parentNode.removeChild(n);
          element.__contents.push(n);
        }
        this.cacheDomLocation(element);
        this.updateEventController(element);
        var h = this.makeHost();
        h.shadowRoot.appendChild(element);
        element.__host = h;
      }
    },
    makeHost: function() {
      var h = document.createElement('overlay-host');
      h.createShadowRoot();
      this.appendChild(h);
      return h;
    },
    moveInsertedElements: function(insertionPoint) {
      var n$ = insertionPoint.getDistributedNodes();
      var parent = insertionPoint.parentNode;
      insertionPoint.__contents = [];
      for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
        this.cacheDomLocation(n);
        this.updateEventController(n);
        insertionPoint.__contents.push(n);
        parent.appendChild(n);  
      }
    },
    updateEventController: function(element) {
      element.eventController = this.element.findController(element);
    },
    /**
     * Removes an element from the overlay layer
     */
    removeElement: function(element) {
      element.eventController = null;
      this.replaceElement(element);
      var h = element.__host;
      if (h) {
        h.parentNode.removeChild(h);
      }
    },
    replaceElement: function(element) {
      if (element.__contents) {
        for (var i=0, c$=element.__contents, c; (c=c$[i]); i++) {
          this.replaceElement(c);
        }
        element.__contents = null;
      }
      if (element.__parentNode) {
        var n = element.__nextElementSibling && element.__nextElementSibling 
            === element.__parentNode ? element.__nextElementSibling : null;
        element.__parentNode.insertBefore(element, n);
      }
    },
    cacheDomLocation: function(element) {
      element.__nextElementSibling = element.nextElementSibling;
      element.__parentNode = element.parentNode;
    }
  });
  
})();
;

(function() {

  Polymer('core-overlay', {

    publish: {
      /**
       * The target element that will be shown when the overlay is 
       * opened. If unspecified, the core-overlay itself is the target.
       *
       * @attribute target
       * @type Object
       * @default the overlay element
       */
      target: null,


      /**
       * A `core-overlay`'s size is guaranteed to be 
       * constrained to the window size. To achieve this, the sizingElement
       * is sized with a max-height/width. By default this element is the 
       * target element, but it can be specifically set to a specific element
       * inside the target if that is more appropriate. This is useful, for 
       * example, when a region inside the overlay should scroll if needed.
       *
       * @attribute sizingTarget
       * @type Object
       * @default the target element
       */
      sizingTarget: null,
    
      /**
       * Set opened to true to show an overlay and to false to hide it.
       * A `core-overlay` may be made initially opened by setting its
       * `opened` attribute.
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * If true, the overlay has a backdrop darkening the rest of the screen.
       * The backdrop element is attached to the document body and may be styled
       * with the class `core-overlay-backdrop`. When opened the `core-opened`
       * class is applied.
       *
       * @attribute backdrop
       * @type boolean
       * @default false
       */    
      backdrop: false,

      /**
       * If true, the overlay is guaranteed to display above page content.
       *
       * @attribute layered
       * @type boolean
       * @default false
      */
      layered: false,
    
      /**
       * By default an overlay will close automatically if the user
       * taps outside it or presses the escape key. Disable this
       * behavior by setting the `autoCloseDisabled` property to true.
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,

      /**
       * This property specifies an attribute on elements that should
       * close the overlay on tap. Should not set `closeSelector` if this
       * is set.
       *
       * @attribute closeAttribute
       * @type string
       * @default "core-overlay-toggle"
       */
      closeAttribute: 'core-overlay-toggle',

      /**
       * This property specifies a selector matching elements that should
       * close the overlay on tap. Should not set `closeAttribute` if this
       * is set.
       *
       * @attribute closeSelector
       * @type string
       * @default ""
       */
      closeSelector: '',

      /**
       * A `core-overlay` target's size is constrained to the window size.
       * The `margin` property specifies a pixel amount around the overlay 
       * that will be reserved. It's useful for ensuring that, for example, 
       * a shadow displayed outside the target will always be visible.
       *
       * @attribute margin
       * @type number
       * @default 0
       */
      margin: 0,

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default 'core-transition-fade'
       */
      transition: 'core-transition-fade'

    },

    captureEventName: 'tap',
    targetListeners: {
      'tap': 'tapHandler',
      'keydown': 'keydownHandler',
      'core-transitionend': 'transitionend'
    },
    
    registerCallback: function(element) {
      this.layer = document.createElement('core-overlay-layer');
      this.keyHelper = document.createElement('core-key-helper');
      this.meta = document.createElement('core-transition');
      this.scrim = document.createElement('div');
      this.scrim.className = 'core-overlay-backdrop';
    },

    ready: function() {
      this.target = this.target || this;
      // flush to ensure styles are installed before paint
      Platform.flush();
    },

    /** 
     * Toggle the opened state of the overlay.
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    /** 
     * Open the overlay. This is equivalent to setting the `opened`
     * property to true.
     * @method open
     */
    open: function() {
      this.opened = true;
    },

    /** 
     * Close the overlay. This is equivalent to setting the `opened` 
     * property to false.
     * @method close
     */
    close: function() {
      this.opened = false;
    },

    domReady: function() {
      this.ensureTargetSetup();
    },

    targetChanged: function(old) {
      if (this.target) {
        // really make sure tabIndex is set
        if (this.target.tabIndex < 0) {
          this.target.tabIndex = -1;
        }
        this.addElementListenerList(this.target, this.targetListeners);
        this.target.style.display = 'none';
      }
      if (old) {
        this.removeElementListenerList(old, this.targetListeners);
        var transition = this.getTransition();
        if (transition) {
          transition.teardown(old);
        } else {
          old.style.position = '';
          old.style.outline = '';
        }
        old.style.display = '';
      }
    },

    // NOTE: wait to call this until we're as sure as possible that target
    // is styled.
    ensureTargetSetup: function() {
      if (!this.target || this.target.__overlaySetup) {
        return;
      }
      this.target.__overlaySetup = true;
      this.target.style.display = '';
      var transition = this.getTransition();
      if (transition) {
        transition.setup(this.target);
      }
      var computed = getComputedStyle(this.target);
      this.targetStyle = {
        position: computed.position === 'static' ? 'fixed' :
            computed.position
      }
      if (!transition) {
        this.target.style.position = this.targetStyle.position;
        this.target.style.outline = 'none';
      }
      this.target.style.display = 'none';
    },

    openedChanged: function() {
      this.transitioning = true;
      this.ensureTargetSetup();
      this.prepareRenderOpened();
      // continue styling after delay so display state can change
      // without aborting transitions
      // note: we wait a full frame so that transition changes executed
      // during measuring do not cause transition
      this.async(function() {
        this.target.style.display = '';
        this.async('renderOpened');
      });
      this.fire('core-overlay-open', this.opened);
    },

    // tasks which must occur before opening; e.g. making the element visible
    prepareRenderOpened: function() {
      if (this.opened) {
        addOverlay(this);
      }
      this.prepareBackdrop();
      // async so we don't auto-close immediately via a click.
      this.async(function() {
        if (!this.autoCloseDisabled) {
          this.enableElementListener(this.opened, document,
              this.captureEventName, 'captureHandler', true);
        }
      });
      this.enableElementListener(this.opened, window, 'resize',
          'resizeHandler');

      if (this.opened) {
        // TODO(sorvell): force SD Polyfill to render
        forcePolyfillRender(this.target);
        if (!this._shouldPosition) {
          this.target.style.position = 'absolute';
          var computed = getComputedStyle(this.target);
          var t = (computed.top === 'auto' && computed.bottom === 'auto');
          var l = (computed.left === 'auto' && computed.right === 'auto');
          this.target.style.position = this.targetStyle.position;
          this._shouldPosition = {top: t, left: l};
        }
        // if we are showing, then take care when measuring
        this.prepareMeasure(this.target);
        this.updateTargetDimensions();
        this.finishMeasure(this.target);
        if (this.layered) {
          this.layer.addElement(this.target);
          this.layer.opened = this.opened;
        }
      }
    },

    // tasks which cause the overlay to actually open; typically play an
    // animation
    renderOpened: function() {
      var transition = this.getTransition();
      if (transition) {
        transition.go(this.target, {opened: this.opened});
      } else {
        this.transitionend();
      }
      this.renderBackdropOpened();
    },

    // finishing tasks; typically called via a transition
    transitionend: function(e) {
      // make sure this is our transition event.
      if (e && e.target !== this.target) {
        return;
      }
      this.transitioning = false;
      if (!this.opened) {
        this.resetTargetDimensions();
        this.target.style.display = 'none';
        this.completeBackdrop();
        removeOverlay(this);
        if (this.layered) {
          if (!currentOverlay()) {
            this.layer.opened = this.opened;
          }
          this.layer.removeElement(this.target);
        }
      }
      this.applyFocus();
    },

    prepareBackdrop: function() {
      if (this.backdrop && this.opened) {
        if (!this.scrim.parentNode) {
          document.body.appendChild(this.scrim);
          this.scrim.style.zIndex = currentOverlayZ() - 1;
        }
        trackBackdrop(this);
      }
    },

    renderBackdropOpened: function() {
      if (this.backdrop && getBackdrops().length < 2) {
        this.scrim.classList.toggle('core-opened', this.opened);
      }
    },

    completeBackdrop: function() {
      if (this.backdrop) {
        trackBackdrop(this);
        if (getBackdrops().length === 0) {
          this.scrim.parentNode.removeChild(this.scrim);
        }
      }
    },

    prepareMeasure: function(target) {
      target.style.transition = target.style.webkitTransition = 'none';
      target.style.transform = target.style.webkitTransform = 'none';
      target.style.display = '';
    },

    finishMeasure: function(target) {
      target.style.display = 'none';
      target.style.transform = target.style.webkitTransform = '';
      target.style.transition = target.style.webkitTransition = '';
    },

    getTransition: function() {
      return this.meta.byId(this.transition);
    },

    getFocusNode: function() {
      return this.target.querySelector('[autofocus]') || this.target;
    },

    applyFocus: function() {
      var focusNode = this.getFocusNode();
      if (this.opened) {
        focusNode.focus();
      } else {
        focusNode.blur();
        if (currentOverlay() == this) {
          console.warn('Current core-overlay is attempting to focus itself as next! (bug)');
        } else {
          focusOverlay();
        }
      }
    },

    updateTargetDimensions: function() {
      this.positionTarget();
      this.sizeTarget();
      //
      if (this.layered) {
        var rect = this.target.getBoundingClientRect();
        this.target.style.top = rect.top + 'px';
        this.target.style.left = rect.left + 'px';
        this.target.style.right = this.target.style.bottom = 'auto';
      }
    },

    sizeTarget: function() {
      var sizer = this.sizingTarget || this.target;
      var rect = sizer.getBoundingClientRect();
      var mt = rect.top === this.margin ? this.margin : this.margin * 2;
      var ml = rect.left === this.margin ? this.margin : this.margin * 2;
      var h = window.innerHeight - rect.top - mt;
      var w = window.innerWidth - rect.left - ml;
      sizer.style.maxHeight = h + 'px';
      sizer.style.maxWidth = w + 'px';
      sizer.style.boxSizing = 'border-box';
    },

    positionTarget: function() {
      // vertically and horizontally center if not positioned
      if (this._shouldPosition.top) {
        var t = Math.max((window.innerHeight - 
            this.target.offsetHeight - this.margin*2) / 2, this.margin);
        this.target.style.top = t + 'px';
      }
      if (this._shouldPosition.left) {
        var l = Math.max((window.innerWidth - 
            this.target.offsetWidth - this.margin*2) / 2, this.margin);
        this.target.style.left = l + 'px';
      }
    },

    resetTargetDimensions: function() {
      this.target.style.top = this.target.style.left = '';
      this.target.style.right = this.target.style.bottom = '';
      this.target.style.width = this.target.style.height = '';
      this._shouldPosition = null;
    },

    tapHandler: function(e) {
      // closeSelector takes precedence since closeAttribute has a default non-null value.
      if (e.target &&
          (this.closeSelector && e.target.matches(this.closeSelector)) ||
          (this.closeAttribute && e.target.hasAttribute(this.closeAttribute))) {
        this.toggle();
      } else {
        if (this.autoCloseJob) {
          this.autoCloseJob.stop();
          this.autoCloseJob = null;
        }
      }
    },
    
    // We use the traditional approach of capturing events on document
    // to to determine if the overlay needs to close. However, due to 
    // ShadowDOM event retargeting, the event target is not useful. Instead
    // of using it, we attempt to close asynchronously and prevent the close
    // if a tap event is immediately heard on the target.
    // TODO(sorvell): This approach will not work with modal. For
    // this we need a scrim.
    captureHandler: function(e) {
      if (!this.autoCloseDisabled && (currentOverlay() == this)) {
        this.autoCloseJob = this.job(this.autoCloseJob, function() {
          this.close();
        });
      }
    },

    keydownHandler: function(e) {
      if (!this.autoCloseDisabled && (e.keyCode == this.keyHelper.ESCAPE_KEY)) {
        this.close();
        e.stopPropagation();
      }
    },

    /**
     * Extensions of core-overlay should implement the `resizeHandler`
     * method to adjust the size and position of the overlay when the 
     * browser window resizes.
     * @method resizeHandler
     */
    resizeHandler: function() {
      this.updateTargetDimensions();
    },

    // TODO(sorvell): these utility methods should not be here.
    addElementListenerList: function(node, events) {
      for (var i in events) {
        this.addElementListener(node, i, events[i]);
      }
    },

    removeElementListenerList: function(node, events) {
      for (var i in events) {
        this.removeElementListener(node, i, events[i]);
      }
    },

    enableElementListener: function(enable, node, event, methodName, capture) {
      if (enable) {
        this.addElementListener(node, event, methodName, capture);
      } else {
        this.removeElementListener(node, event, methodName, capture);
      }
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        }
      }
      return this[bound];
    },
  });

  function forcePolyfillRender(target) {
    if (window.ShadowDOMPolyfill) {
      target.offsetHeight;
    }
  }

  // TODO(sorvell): This should be an element with private state so it can
  // be independent of overlay.
  // track overlays for z-index and focus managemant
  var overlays = [];
  function addOverlay(overlay) {
    var z0 = currentOverlayZ();
    overlays.push(overlay);
    var z1 = currentOverlayZ();
    if (z1 <= z0) {
      applyOverlayZ(overlay, z0);
    }
  }

  function removeOverlay(overlay) {
    var i = overlays.indexOf(overlay);
    if (i >= 0) {
      overlays.splice(i, 1);
      setZ(overlay, '');
    }
  }
  
  function applyOverlayZ(overlay, aboveZ) {
    setZ(overlay.target, aboveZ + 2);
  }
  
  function setZ(element, z) {
    element.style.zIndex = z;
  }

  function currentOverlay() {
    return overlays[overlays.length-1];
  }
  
  var DEFAULT_Z = 10;
  
  function currentOverlayZ() {
    var z;
    var current = currentOverlay();
    if (current) {
      var z1 = window.getComputedStyle(current.target).zIndex;
      if (!isNaN(z1)) {
        z = Number(z1);
      }
    }
    return z || DEFAULT_Z;
  }
  
  function focusOverlay() {
    var current = currentOverlay();
    // We have to be careful to focus the next overlay _after_ any current
    // transitions are complete (due to the state being toggled prior to the
    // transition). Otherwise, we risk infinite recursion when a transitioning
    // (closed) overlay becomes the current overlay.
    //
    // NOTE: We make the assumption that any overlay that completes a transition
    // will call into focusOverlay to kick the process back off. Currently:
    // transitionend -> applyFocus -> focusOverlay.
    if (current && !current.transitioning) {
      current.applyFocus();
    }
  }

  var backdrops = [];
  function trackBackdrop(element) {
    if (element.opened) {
      backdrops.push(element);
    } else {
      var i = backdrops.indexOf(element);
      if (i >= 0) {
        backdrops.splice(i, 1);
      }
    }
  }

  function getBackdrops() {
    return backdrops;
  }
})();
;

    Polymer('core-menu-button', {
      /**
       * The icon to display.
       * @attribute icon
       * @type string
       */
      icon: 'dots',
      src: '',
      /**
       * The index of the selected menu item.
       * @attribute selected
       * @type number
       */
      selected: '',
      /**
       * Set to true to open the menu.
       * @attribute opened
       * @type boolean
       */
      opened: false,
      /**
       * Set to true to cause the menu popup to be displayed inline rather 
       * than in its own layer.
       * @attribute inlineMenu
       * @type boolean
       */
      inlineMenu: false,
      /**
       * Horizontally align the overlay with the button. Accepted values are
       * ["left", "center", "right"].
       * @attribute halign
       * @type string
       */
      halign: 'center',
      /**
       * Display the overlay on top or below the button. Accepted values are
       * ["top", "bottom"].
       * @attribute valign
       * @type string
       */
      valign: 'bottom',
      multi: false,
      closeAction: function() {
        this.opened = false;
      },
      /**
       * Toggle the opened state of the dropdown.
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      },
      /**
       * The selected menu item.
       * @property selection
       * @type Node
       */
      get selection() {
        return this.$.menu.selection;
      }
    });
  ;
Polymer('core-pages');;


  Polymer('core-range', {
    
    /**
     * The number that represents the current value.
     *
     * @attribute value
     * @type number
     * @default 0
     */
    value: 0,
    
    /**
     * The number that indicates the minimum value of the range.
     *
     * @attribute min
     * @type number
     * @default 0
     */
    min: 0,
    
    /**
     * The number that indicates the maximum value of the range.
     *
     * @attribute max
     * @type number
     * @default 100
     */
    max: 100,
    
    /**
     * Specifies the value granularity of the range's value.
     *
     * @attribute step
     * @type number
     * @default 1
     */
    step: 1,
    
    /**
     * Returns the ratio of the value.
     *
     * @attribute ratio
     * @type number
     * @default 0
     */
    ratio: 0,
    
    observe: {
      'value min max step': 'update'
    },
    
    calcRatio: function(value) {
      return (this.clampValue(value) - this.min) / (this.max - this.min);
    },
    
    clampValue: function(value) {
      return Math.min(this.max, Math.max(this.min, this.calcStep(value)));
    },
    
    calcStep: function(value) {
      return this.step ? (Math.round(value / this.step) / (1 / this.step)) : value;
    },
    
    validateValue: function() {
      var v = this.clampValue(this.value);
      this.value = this.oldValue = isNaN(v) ? this.oldValue : v;
      return this.value !== v;
    },
    
    update: function() {
      this.validateValue();
      this.ratio = this.calcRatio(this.value) * 100;
    }
    
  });
  
;
Polymer('core-toolbar');;


  Polymer('core-scaffold', {
    
    publish: {
      /**
       * When the browser window size is smaller than the `responsiveWidth`, 
       * `core-drawer-panel` changes to a narrow layout. In narrow layout, 
       * the drawer will be stacked on top of the main panel.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '600px'
       */    
      responsiveWidth: '600px',
  
      /**
       * Used to control the header and scrolling behaviour of `core-header-panel`
       *
       * @attribute mode
       * @type string
       * @default 'seamed'
       */     
      mode: {value: 'seamed', reflect: true}
    },

    /**
      * Toggle the drawer panel
      * @method togglePanel
      */    
    togglePanel: function() {
      this.$.drawerPanel.togglePanel();
    },

    /**
      * Open the drawer panel
      * @method openDrawer
      */      
    openDrawer: function() {
      this.$.drawerPanel.openDrawer();
    },

    /**
      * Close the drawer panel
      * @method closeDrawer
      */     
    closeDrawer: function() {
      this.$.drawerPanel.closeDrawer();
    }
    
  });

;


  Polymer('core-scroll-header-panel', {
    
    /**
     * Fired when the content has been scrolled.
     *
     * @event scroll
     */
     
    /**
     * Fired when the header is transformed.
     *
     * @event core-header-transform
     */
     
    publish: {
      /**
       * If true, the header's height will condense to `_condensedHeaderHeight`
       * as the user scrolls down from the top of the content area.
       *
       * @attribute condenses
       * @type boolean
       * @default false
       */
      condenses: false,

      /**
       * If true, no cross-fade transition from one background to another.
       *
       * @attribute noDissolve
       * @type boolean
       * @default false
       */
      noDissolve: false,

      /**
       * If true, the header doesn't slide back in when scrolling back up.
       *
       * @attribute noReveal
       * @type boolean
       * @default false
       */
      noReveal: false,

      /**
       * If true, the header is fixed to the top and never moves away.
       *
       * @attribute fixed
       * @type boolean
       * @default false
       */
      fixed: false,
      
      /**
       * If true, the condensed header is always shown and does not move away.
       *
       * @attribute keepCondensedHeader
       * @type boolean
       * @default false
       */
      keepCondensedHeader: false,

      /**
       * The height of the header when it is at its full size.
       *
       * By default, the height will be measured when it is ready.  If the height
       * changes later the user needs to either set this value to reflect the
       * new height or invoke `measureHeaderHeight()`.
       *
       * @attribute headerHeight
       * @type number
       */
      headerHeight: 0,

      /**
       * The height of the header when it is condensed.
       *
       * By default, `_condensedHeaderHeight` is 1/3 of `headerHeight` unless
       * this is specified.
       *
       * @attribute condensedHeaderHeight
       * @type number
       */
      condensedHeaderHeight: 0
    },

    prevScrollTop: 0,
    
    headerMargin: 0,
    
    y: 0,
    
    observe: {
      'headerMargin fixed': 'setup'
    },
    
    domReady: function() {
      this.async('measureHeaderHeight');
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    get scroller() {
      return this.$.mainContainer;
    },
    
    measureHeaderHeight: function() {
      var header = this.header;
      if (this.header) {
        this.headerHeight = header.offsetHeight;
      }
    },
    
    headerHeightChanged: function() {
      if (!this.condensedHeaderHeight) {
        // assume _condensedHeaderHeight is 1/3 of the headerHeight
        this._condensedHeaderHeight = this.headerHeight * 1 / 3;
      }
      this.condensedHeaderHeightChanged();
    },
    
    condensedHeaderHeightChanged: function() {
      if (this.condensedHeaderHeight) {
        this._condensedHeaderHeight = this.condensedHeaderHeight;
      }
      if (this.headerHeight) {
        this.headerMargin = this.headerHeight - this._condensedHeaderHeight;
      }
    },
    
    condensesChanged: function() {
      if (this.condenses) {
        this.scroll();
      } else {
        // reset transform/opacity set on the header
        this.condenseHeader(null);
      }
    },
    
    setup: function() {
      var s = this.scroller.style;
      s.paddingTop = this.fixed ? '' : this.headerHeight + 'px';
      s.top = this.fixed ? this.headerHeight + 'px' : '';
      if (this.fixed) {
        this.transformHeader(null);
      } else {
        this.scroll();
      }
    },
    
    transformHeader: function(y) {
      var s = this.$.headerContainer.style;
      this.translateY(s, -y);
      
      if (this.condenses) {
        this.condenseHeader(y);
      }
      
      this.fire('core-header-transform', {y: y, height: this.headerHeight, 
          condensedHeight: this._condensedHeaderHeight});
    },
    
    condenseHeader: function(y) {
      var reset = y == null;
      // adjust top bar in core-header so the top bar stays at the top
      if (this.header.$ && this.header.$.topBar) {
        this.translateY(this.header.$.topBar.style, 
            reset ? null : Math.min(y, this.headerMargin));
      }
      // transition header bg
      var hbg = this.$.headerBg.style;
      if (!this.noDissolve) {
        hbg.opacity = reset ? '' : (this.headerMargin - y) / this.headerMargin;
      }
      // adjust header bg so it stays at the center
      this.translateY(hbg, reset ? null : y / 2);
      // transition condensed header bg
      var chbg = this.$.condensedHeaderBg.style;
      if (!this.noDissolve) {
        chbg = this.$.condensedHeaderBg.style;
        chbg.opacity = reset ? '' : y / this.headerMargin;
        // adjust condensed header bg so it stays at the center
        this.translateY(chbg, reset ? null : y / 2);
      }
    },
    
    translateY: function(s, y) {
      s.transform = s.webkitTransform = y == null ? '' : 
          'translate3d(0, ' + y + 'px, 0)';
    },
    
    scroll: function(event) {
      if (!this.header) {
        return;
      }
      
      var sTop = this.scroller.scrollTop;
      
      var y = Math.min(this.keepCondensedHeader ? 
          this.headerMargin : this.headerHeight, Math.max(0, 
          (this.noReveal ? sTop : this.y + sTop - this.prevScrollTop)));
      
      if (this.condenses && this.prevScrollTop >= sTop && sTop > this.headerMargin) {
        y = Math.max(y, this.headerMargin);
      }
      
      if (!event || !this.fixed && y !== this.y) {
        requestAnimationFrame(this.transformHeader.bind(this, y));
      }
      
      this.prevScrollTop = sTop;
      this.y = y;
      
      if (event) {
        this.fire('scroll', {target: this.scroller}, this, false);
      }
    }

  });

;

(function() {
  
  Polymer('core-shared-lib',{
    
    notifyEvent: 'core-shared-lib-load',
    
    ready: function() {
      if (!this.url && this.defaultUrl) {
        this.url = this.defaultUrl;
      }
    },
    
    urlChanged: function() {
      require(this.url, this, this.callbackName);
    },
    
    provide: function() {
      this.async('notify');
    },
    
    notify: function() {
      this.fire(this.notifyEvent, arguments);
    }
    
  });

  var apiMap = {};
  
  function require(url, notifiee, callbackName) {
    // make hashable string form url
    var name = nameFromUrl(url);
    // lookup existing loader instance
    var loader = apiMap[name];
    // create a loader as needed
    if (!loader) {
      loader = apiMap[name] = new Loader(name, url, callbackName);
    }
    loader.requestNotify(notifiee);
  }
  
  function nameFromUrl(url) {
    return url.replace(/[\:\/\%\?\&\.\=\-]/g, '_') + '_api';
  }

  var Loader = function(name, url, callbackName) {
    this.instances = [];
    this.callbackName = callbackName;
    if (this.callbackName) {
      window[this.callbackName] = this.success.bind(this);
    } else {
      if (url.indexOf(this.callbackMacro) >= 0) {
        this.callbackName = name + '_loaded';
        window[this.callbackName] = this.success.bind(this);
        url = url.replace(this.callbackMacro, this.callbackName);
      } else {
        // TODO(sjmiles): we should probably fallback to listening to script.load
        throw 'core-shared-api: a %%callback%% parameter is required in the API url';
      }
    }
    //
    this.addScript(url);
  };
  
  Loader.prototype = {
    
    callbackMacro: '%%callback%%',
    loaded: false,
    
    addScript: function(src) {
      var script = document.createElement('script');
      script.src = src;
      script.onerror = this.error.bind(this);
      var s = document.querySelector('script');
      s.parentNode.insertBefore(script, s);
      this.script = script;
    },
    
    removeScript: function() {
      if (this.script.parentNode) {
        this.script.parentNode.removeChild(this.script);
      }
      this.script = null;
    },
    
    error: function() {
      this.cleanup();
    },
    
    success: function() {
      this.loaded = true;
      this.cleanup();
      this.result = Array.prototype.slice.call(arguments);
      this.instances.forEach(this.provide, this);
      this.instances = null;
    },
    
    cleanup: function() {
      delete window[this.callbackName];
    },

    provide: function(instance) {
      instance.notify(instance, this.result);
    },
    
    requestNotify: function(instance) {
      if (this.loaded) {
        this.provide(instance);
      } else {
        this.instances.push(instance);
      }
    }
    
  };
  
})();
;

(function(){
  
  Polymer('core-signals',{
    attached: function() {
      signals.push(this);
    },
    removed: function() {
      var i = signals.indexOf(this);
      if (i >= 0) {
        signals.splice(i, 1);
      }
    }
  });

  // private shared database
  var signals = [];

  // signal dispatcher
  function notify(name, data) {
    // convert generic-signal event to named-signal event
    var signal = new CustomEvent('core-signal-' + name, {
      // if signals bubble, it's easy to get confusing duplicates
      // (1) listen on a container on behalf of local child
      // (2) some deep child ignores the event and it bubbles 
      //     up to said container
      // (3) local child event bubbles up to container
      // also, for performance, we avoid signals flying up the
      // tree from all over the place
      bubbles: false,
      detail: data
    });
    // dispatch named-signal to all 'signals' instances,
    // only interested listeners will react
    signals.forEach(function(s) {
      s.dispatchEvent(signal);
    });
  }

  // signal listener at document
  document.addEventListener('core-signal', function(e) {
    notify(e.detail.name, e.detail.data);
  });
  
})();
;


  Polymer('core-splitter', {

    /**
     * Possible values are "left", "right", "up" and "down".
     *
     * @attribute direction
     * @type string
     * @default 'left'
     */
    direction: 'left',

    /**
     * Minimum width to which the splitter target can be sized
     *
     * @attribute minSize
     * @type number
     * @default 0
     */
    minSize: 0,

    /**
     * Locks the split bar so it can't be dragged.
     *
     * @attribute locked
     * @type boolean
     * @default false
     */
    locked: false,

    /**
     * By default the parent and siblings of the splitter are set to overflow hidden. This helps
     * avoid elements bleeding outside the splitter regions. Set this property to true to allow
     * these elements to overflow.
     *
     * @attribute allowOverflow
     * @type boolean
     * @default false
     */
    allowOverflow: false,

    ready: function() {
      this.directionChanged();
    },

    domReady: function() {
      if (!this.allowOverflow) {
        this.parentNode.style.overflow = this.nextElementSibling.style.overflow =
            this.previousElementSibling.style.overflow = 'hidden';
      }
    },

    directionChanged: function() {
      this.isNext = this.direction === 'right' || this.direction === 'down';
      this.horizontal = this.direction === 'up' || this.direction === 'down';
      this.update();
    },

    update: function() {
      this.target = this.isNext ? this.nextElementSibling : this.previousElementSibling;
      this.dimension = this.horizontal ? 'height' : 'width';
      this.classList.toggle('horizontal', this.horizontal);
    },

    targetChanged: function(old) {
      if (old) {
        old.style[old.__splitterMinSize] = '';
      }
      var min = this.target.__splitterMinSize = this.horizontal ? 'minHeight' : 'minWidth';
      this.target.style[min] = this.minSize + 'px';
    },

    trackStart: function() {
      this.update();
      this.size = parseInt(getComputedStyle(this.target)[this.dimension]);
    },

    track: function(e) {
      if (this.locked) {
        return;
      }
      var d = e[this.horizontal ? 'dy' : 'dx'];
      this.target.style[this.dimension] =
          this.size + (this.isNext ? -d : d) + 'px';
    },

    preventSelection: function(e) {
      e.preventDefault();
    }
  });

;

(function() {

window.CoreStyle = window.CoreStyle || {
  g: {},
  list: {},
  refMap: {}
};

Polymer('core-style', {
  /**
   * The `id` property should be set if the `core-style` is a producer
   * of styles. In this case, the `core-style` should have text content
   * that is cssText.
   *
   * @attribute id
   * @type string
   * @default ''
   */


  publish: {
    /**
     * The `ref` property should be set if the `core-style` element is a 
     * consumer of styles. Set it to the `id` of the desired `core-style`
     * element.
     *
     * @attribute ref
     * @type string
     * @default ''
     */
    ref: ''
  },

  // static
  g: CoreStyle.g,
  refMap: CoreStyle.refMap,

  /**
   * The `list` is a map of all `core-style` producers stored by `id`. It 
   * should be considered readonly. It's useful for nesting one `core-style`
   * inside another.
   *
   * @attribute list
   * @type object (readonly)
   * @default {map of all `core-style` producers}
   */
  list: CoreStyle.list,

  // if we have an id, we provide style
  // if we have a ref, we consume/require style
  ready: function() {
    if (this.id) {
      this.provide();
    } else {
      this.registerRef(this.ref);
      if (!window.ShadowDOMPolyfill) {
        this.require();
      }  
    }
  },

  // can't shim until attached if using SD polyfill because need to find host
  attached: function() {
    if (!this.id && window.ShadowDOMPolyfill) {
      this.require();
    }
  },

  /****** producer stuff *******/

  provide: function() {
    this.register();
    // we want to do this asap, especially so we can do so before definitions
    // that use this core-style are registered.
    if (this.textContent) {
      this._completeProvide();
    } else {
      this.async(this._completeProvide);
    }
  },

  register: function() {
    var i = this.list[this.id];
    if (i) {
      if (!Array.isArray(i)) {
        this.list[this.id] = [i];
      }
      this.list[this.id].push(this);
    } else {
      this.list[this.id] = this;  
    }
  },

  // stamp into a shadowRoot so we can monitor dom of the bound output
  _completeProvide: function() {
    this.createShadowRoot();
    this.domObserver = new MutationObserver(this.domModified.bind(this))
        .observe(this.shadowRoot, {subtree: true, 
        characterData: true, childList: true});
    this.provideContent();
  },

  provideContent: function() {
    this.ensureTemplate();
    this.shadowRoot.textContent = '';
    this.shadowRoot.appendChild(this.instanceTemplate(this.template));
    this.cssText = this.shadowRoot.textContent;
  },

  ensureTemplate: function() {
    if (!this.template) {
      this.template = this.querySelector('template:not([repeat]):not([bind])');
      // move content into the template
      if (!this.template) {
        this.template = document.createElement('template');
        var n = this.firstChild;
        while (n) {
          this.template.content.appendChild(n.cloneNode(true));
          n = n.nextSibling;
        }
      }
    }
  },

  domModified: function() {
    this.cssText = this.shadowRoot.textContent;
    this.notify();
  },

  // notify instances that reference this element
  notify: function() {
    var s$ = this.refMap[this.id];
    if (s$) {
      for (var i=0, s; (s=s$[i]); i++) {
        s.require();
      }
    }
  },

  /****** consumer stuff *******/

  registerRef: function(ref) {
    //console.log('register', ref);
    this.refMap[this.ref] = this.refMap[this.ref] || [];
    this.refMap[this.ref].push(this);
  },

  applyRef: function(ref) {
    this.ref = ref;
    this.registerRef(this.ref);
    this.require();
  },

  require: function() {
    var cssText = this.cssTextForRef(this.ref);
    //console.log('require', this.ref, cssText);
    if (cssText) {
      this.ensureStyleElement();
      // do nothing if cssText has not changed
      if (this.styleElement._cssText === cssText) {
        return;
      }
      this.styleElement._cssText = cssText;
      if (window.ShadowDOMPolyfill) {
        this.styleElement.textContent = cssText;
        cssText = Platform.ShadowCSS.shimStyle(this.styleElement,
            this.getScopeSelector());
      }
      this.styleElement.textContent = cssText;
    }
  },

  cssTextForRef: function(ref) {
    var s$ = this.byId(ref);
    var cssText = '';
    if (s$) {
      if (Array.isArray(s$)) {
        var p = [];
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          p.push(s.cssText);
        }
        cssText = p.join('\n\n');
      } else {
        cssText = s$.cssText;
      }
    }
    if (s$ && !cssText) {
      console.warn('No styles provided for ref:', ref);
    }
    return cssText;
  },

  byId: function(id) {
    return this.list[id];
  },

  ensureStyleElement: function() {
    if (!this.styleElement) {
      this.styleElement = window.ShadowDOMPolyfill ? 
          this.makeShimStyle() :
          this.makeRootStyle();
    }
    if (!this.styleElement) {
      console.warn(this.localName, 'could not setup style.');
    }
  },

  makeRootStyle: function() {
    var style = document.createElement('style');
    this.appendChild(style);
    return style;
  },

  makeShimStyle: function() {
    var host = this.findHost(this);
    if (host) {
      var name = host.localName;
      var style = document.querySelector('style[' + name + '=' + this.ref +']');
      if (!style) {
        style = document.createElement('style');
        style.setAttribute(name, this.ref);
        document.head.appendChild(style);
      }
      return style;
    }
  },

  getScopeSelector: function() {
    if (!this._scopeSelector) {
      var selector = '', host = this.findHost(this);
      if (host) {
        var typeExtension = host.hasAttribute('is');
        var name = typeExtension ? host.getAttribute('is') : host.localName;
        selector = Platform.ShadowCSS.makeScopeSelector(name, 
            typeExtension);
      }
      this._scopeSelector = selector;
    }
    return this._scopeSelector;
  },

  findHost: function(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host || wrap(document.documentElement);
  },

  /* filters! */
  // TODO(dfreedm): add more filters!

  cycle: function(rgb, amount) {
    if (rgb.match('#')) {
      var o = this.hexToRgb(rgb);
      if (!o) {
        return rgb;
      }
      rgb = 'rgb(' + o.r + ',' + o.b + ',' + o.g + ')';
    }

    function cycleChannel(v) {
      return Math.abs((Number(v) - amount) % 255);
    }

    return rgb.replace(/rgb\(([^,]*),([^,]*),([^,]*)\)/, function(m, a, b, c) {
      return 'rgb(' + cycleChannel(a) + ',' + cycleChannel(b) + ', ' 
          + cycleChannel(c) + ')';
    });
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

});


})();
;


  Polymer('core-tooltip', {

    /**
     * A simple string label for the tooltip to display. To display a rich
     * that includes HTML, use the `tip` attribute on the content.
     *
     * @attribute label
     * @type string
     * @default null
     */
    label: null,

    /**
     * If true, the tooltip an arrow pointing towards the content.
     *
     * @attribute noarrow
     * @type boolean
     * @default false
     */
    noarrow: false,

    /**
     * If true, the tooltip displays by default.
     *
     * @attribute show
     * @type boolean
     * @default false
     */
    show: false,

    /**
     * Positions the tooltip to the top, right, bottom, left of its content.
     *
     * @attribute position
     * @type string
     * @default 'bottom'
     */
    position: 'bottom',

    attached: function() {
      this.setPosition();
    },

    labelChanged: function(oldVal, newVal) {
      // Run if we're not after attached().
      if (oldVal) {
        this.setPosition();
      }
    },

    setPosition: function() {
      var controlWidth = this.clientWidth;
      var controlHeight = this.clientHeight;

      var styles = getComputedStyle(this.$.tooltip);
      var toolTipWidth = parseFloat(styles.width);
      var toolTipHeight = parseFloat(styles.height);

      switch (this.position) {
        case 'top':
        case 'bottom':
          this.$.tooltip.style.left = (controlWidth - toolTipWidth) / 2 + 'px';
          break;
        case 'left':
        case 'right':
          this.$.tooltip.style.top = (controlHeight - toolTipHeight) / 2 + 'px';
          break;
      }
    }
  });
