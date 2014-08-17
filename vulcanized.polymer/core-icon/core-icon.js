

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
