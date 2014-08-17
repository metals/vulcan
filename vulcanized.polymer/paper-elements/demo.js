

  Polymer('sampler-scaffold', {
    
    /**
     * When the browser window size is smaller than the `responsiveWidth`, 
     * `sampler-scaffold` changes to a narrow layout. In narrow layout, 
     * the drawer will be stacked on top of the main panel.
     *
     * @attribute responsiveWidth
     * @type string
     */
    responsiveWidth: '860px',
    
    /**
     * Sampler label.
     *
     * @attribute label
     * @type string
     */
    
    ready: function() {
      this.boundResizeFrame = this.resizeFrame.bind(this);
      window.addEventListener('resize', this.updateFrameHeight.bind(this));
      window.addEventListener('hashchange', this.parseLocationHash.bind(this));
    },
    
    domReady: function() {
      this.async(function() {
        this.parseLocationHash();
      }, null, 300);
    },
    
    parseLocationHash: function() {
      var route = window.location.hash.slice(1);
      for (var i = 0, item; item = this.$.menu.items[i]; i++) {
        if (item.getAttribute('tag') === route) {
          this.$.menu.selected = i;
          return;
        }
      }
      this.$.menu.selected = this.$.menu.selected || 0;
    },
    
    menuSelect: function(e, detail) {
      if (detail.isSelected) {
        this.item = detail.item;
        if (this.item.children.length) {
          this.item.selected = 0;
        }
        this.item.tag = this.item.getAttribute('tag');
        var url = this.item.getAttribute('url');
        this.$.frame.contentWindow.location.replace(url);
        window.location.hash = this.item.tag;
        if (this.narrow) {
          this.$.drawerPanel.closeDrawer();
        } else {
          this.animateCard();
        }
      }
    },
    
    animateCard: function() {
      this.$.card.classList.remove('move-up');
      this.$.card.style.display = 'none';
      this.async(function() {
        this.$.card.style.display = 'block';
        this.moveCard(this.$.mainHeaderPanel.offsetHeight);
        this.async(function() {
          this.$.card.classList.add('move-up');
          this.moveCard(null);
        }, null, 300);
      });
    },
    
    moveCard: function(y) {
      var s = this.$.card.style;
      s.webkitTransform = s.transform = 
          y ? 'translate3d(0, ' + y + 'px,0)' : '';
    },
    
    cardTransitionDone: function() {
      if (this.$.card.classList.contains('move-up')) {
        this.$.card.classList.remove('move-up');
        this.updateFrameHeight();
      }
    },
    
    togglePanel: function() {
      this.$.drawerPanel.togglePanel();
    },
    
    frameLoaded: function() {
      if (!this.item) {
        return;
      }
      this.$.frame.contentWindow.addEventListener('polymer-ready', function() {
        setTimeout(this.updateFrameHeight.bind(this), 100);
        this.$.frame.contentWindow.addEventListener('core-resize',
          this.boundResizeFrame, false);
      }.bind(this));
    },

    resizeFrame: function() {
      this.job('resizeFrame', function() {
        this.updateFrameHeight();
      });
    },
    
    updateFrameHeight: function() {
      var frame = this.$.frame;
      var doc = frame.contentDocument;
      if (doc) {
        var docElt = doc.documentElement;
        // TODO(ffu); expose scroll info from header-panel
        var pos = this.$.mainHeaderPanel.$.mainContainer.scrollTop;
        frame.style.height = 'auto';
        frame.style.height = docElt.scrollHeight + 'px';
        if (doc.body) {
          var s = doc.body.style;
          s.overflow = 'hidden';
          // to avoid the 'blinking bug'
          // https://code.google.com/p/chromium/issues/detail?id=332024
          s.webkitTransform = s.transform = 'translateZ(0)';
        }
        this.$.mainHeaderPanel.$.mainContainer.scrollTop = pos;
      }
    },
    
    viewSourceAction: function() {
      window.open('view-source:' + this.$.frame.contentWindow.location.href, 
          this.item.tag);
    }
    
  });

;

  
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

    // Analytics for pp.org
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-39334307-1', 'auto');
    ga('send', 'pageview');
  