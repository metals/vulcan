

    Polymer('core-slide', {

      closed: false,
      open: true,
      vertical: false,
      targetId: '',
      target: null,

      ready: function() {
        this.setAttribute('nolayout', '');
      },

      attached: function() {
        this.target = this.parentNode;
      },

      targetIdChanged: function() {
        var p = this.parentNode;
        while (p.parentNode) {p = p.parentNode;};
        this.target = p.querySelector('#' + this.targetId);
      },

      targetChanged: function() {
        if (this.closed) {
          this.asyncMethod(this.update);
        }
      },

      toggle: function() {
        this.open = !this.open;
      },

      closedChanged: function() {
        this.open = !this.closed;
      },

      openChanged: function() {
        this.asyncMethod(this.update);
      },

      update: function() {
        this.closed = !this.open;
        if (this.target) {
          if (this.vertical) {
            if (this.target.style.top !== '') {
              this.updateTop();
            } else {
              this.updateBottom();
            }
          } else {
            if (this.target.style.left !== '') {
              this.updateLeft();
            } else {
              this.updateRight();
            }
          }
        }
      },

      updateLeft: function() {
        var w = this.target.offsetWidth;
        var l = this.open ? 0 : -w;
        this.target.style.left = l + 'px';
        var s = this.target.nextElementSibling;
        while (s) {
          if (!s.hasAttribute('nolayout')) {
            if (s.style.left === '' && s.style.right !== '') {
              break;
            }
            l += w;
            s.style.left = l + 'px';
            w = s.offsetWidth;
          }
          s = s.nextElementSibling;
        }
      },

      updateRight: function() {
        var w = this.target.offsetWidth;
        var r = this.open ? 0 : -w;
        this.target.style.right = r + 'px';
        //var s = this.target.previousElementSibling;
        var s = previousElementSibling(this.target);
        while (s) {
          if (!s.hasAttribute('nolayout')) {
            if (s.style.right === '' && s.style.left !== '') {
              break;
            }
            r += w;
            s.style.right = r + 'px';  
            w = s.offsetWidth;
          }
          //if (s == s.previousElementSibling) {
          //  console.error(s.localName + ' is its own sibling', s);
          //  break;
          //}
          //s = s.previousElementSibling;
          s = previousElementSibling(s);
        }
      },

      updateTop: function() {
        var h = this.target.offsetHeight;
        var t = this.open ? 0 : -h;
        this.target.style.top = t + 'px';
        var s = this.target.nextElementSibling;
        while (s) {
          if (!s.hasAttribute('nolayout')) {
            if (s.style.top === '' && s.style.bottom !== '') {
              break;
            }
            t += h;
            s.style.top = t + 'px';
            h = s.offsetHeight;
          }
          s = s.nextElementSibling;
        }
      },

      updateBottom: function() {
        var h = this.target.offsetHeight;
        var b = this.open ? 0 : -h;
        this.target.style.bottom = b + 'px';
        //var s = this.target.previousElementSibling;
        var s = previousElementSibling(this.target);
        while (s) {
          if (!s.hasAttribute('nolayout')) {
            if (s.style.bottom === '' && s.style.top !== '') {
              break;
            }
            b = b + h;
            s.style.bottom = b + 'px';  
            h = s.offsetHeight;
          }
          //if (s == s.previousElementSibling) {
          //  console.error(s.localName + ' is its own sibling', s);
          //  break;
          //}
          //s = s.previousElementSibling;
          s = previousElementSibling(s);
        }
      }

    });
    
    // TODO(sjmiles): temporary workaround for b0rked property in ShadowDOMPolyfill
    function previousElementSibling(e) {
      do {
        e = e.previousSibling;
      } while (e && e.nodeType !== Node.ELEMENT_NODE);
      return e;
    };

  