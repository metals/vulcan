
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


  Polymer('core-drawer-panel', {
    /**
     * Fired when the narrow layout changes.
     * 
     * @event core-responsive-change
     * @param {Object} detail
     * @param {boolean} detail.narrow true if the panel is in narrow layout.
     */

    publish: {
      
      /**
       * Width of the drawer panel.
       *
       * @attribute drawerWidth
       * @type string
       * @default '256px'
       */
      drawerWidth: '256px',
      
      /**
       * Max-width when the panel changes to narrow layout.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '640px'
       */
      responsiveWidth: '640px',
      
      /**
       * The panel that is being selected. `drawer` for the drawer panel and
       * `main` for the main panel.
       *
       * @attribute selected
       * @type string
       * @default null
       */
      selected: {value: null, reflect: true},
      
      /**
       * The panel to be selected when `core-drawer-panel` changes to narrow 
       * layout.
       *
       * @attribute defaultSelected
       * @type string
       * @default 'main'
       */
      defaultSelected: 'main',
    
      /**
       * Returns true if the panel is in narrow layout.  This is useful if you
       * need to show/hide elements based on the layout.
       *
       * @attribute narrow
       * @type boolean
       * @default false
       */
      narrow: {value: false, reflect: true},
      
      /**
       * If true, position the drawer to the right.
       *
       * @attribute rightDrawer
       * @type boolean
       * @default false
       */
      rightDrawer: false,
      
      /**
       * If true, swipe to open/close the drawer is disabled.
       *
       * @attribute disableSwipe
       * @type boolean
       * @default false
       */
      disableSwipe: false
    },
    
    eventDelegates: {
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd'
    },
    
    transition: false,

    edgeSwipeSensitivity : 15,
    
    dragging : false,
    
    domReady: function() {
      // to avoid transition at the beginning e.g. page loads
      // NOTE: domReady is already raf delayed and delaying another frame
      // ensures a layout has occurred.
      this.async(function() {
        this.transition = true;
      });
    },

    /**
     * Toggles the panel open and closed.
     * 
     * @method togglePanel
     */
    togglePanel: function() {
      this.selected = this.selected === 'main' ? 'drawer' : 'main';
    },
    
    /**
     * Opens the drawer.
     * 
     * @method openDrawer
     */
    openDrawer: function() {
      this.selected = 'drawer';
    },
    
    /**
     * Closes the drawer.
     * 
     * @method closeDrawer
     */
    closeDrawer: function() {
      this.selected = 'main';
    },

    queryMatchesChanged: function() {
      if (this.queryMatches) {
        this.selected = this.defaultSelected;
      }
      this.narrow = this.queryMatches;
      this.setAttribute('touch-action', 
          this.narrow && !this.disableSwipe ? 'pan-y' : '');
      this.fire('core-responsive-change', {narrow: this.narrow});
    },
    
    // swipe support for the drawer, inspired by
    // https://github.com/Polymer/core-drawer-panel/pull/6
    trackStart : function(e) {
      if (this.narrow && !this.disableSwipe) {
        this.dragging = true;

        if (this.selected === 'main') {
          this.dragging = this.rightDrawer ?
              e.pageX >= this.offsetWidth - this.edgeSwipeSensitivity :
              e.pageX <= this.edgeSwipeSensitivity;
        }

        if (this.dragging) {
          this.width = this.$.drawer.offsetWidth;
          this.transition = false;
          e.preventTap();
        }
      }
    },

    trackx : function(e) {
      if (this.dragging) {
        var x;
        if (this.rightDrawer) {
          x = Math.max(0, (this.selected === 'main') ? this.width + e.dx : e.dx);
        } else {
          x = Math.min(0, (this.selected === 'main') ? e.dx - this.width : e.dx);
        }
        this.moveDrawer(x);
      }
    },

    trackEnd : function(e) {
      if (this.dragging) {
        this.dragging = false;
        this.transition = true;
        this.moveDrawer(null);

        if (this.rightDrawer) {
          this.selected = e.xDirection > 0 ? 'main' : 'drawer';
        } else {
          this.selected = e.xDirection > 0 ? 'drawer' : 'main';
        }
      }
    },
    
    moveDrawer: function(translateX) {
      var s = this.$.drawer.style;
      s.webkitTransform = s.transform = 
          translateX === null ? '' : 'translate3d(' + translateX + 'px, 0, 0)';
    }

  });

