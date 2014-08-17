
  
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

    
    var progress = document.querySelector('paper-progress');
    var button = document.querySelector('paper-button');
    
    var repeat, maxRepeat = 5, animating = false;
    
    function nextProgress() {
      animating = true;
      if (progress.value < progress.max) {
        progress.value += (progress.step || 1);
      } else {
        if (++repeat >= maxRepeat) {
          animating = false;
          button.disabled = false;
          return;
        }
        progress.value = progress.min;
      }
      progress.async(nextProgress);
    }
    
    function startProgress() {
      repeat = 0;
      progress.value = progress.min;
      button.disabled = true;
      if (!animating) {
        nextProgress();
      }
    }
    
    addEventListener('polymer-ready', function() {
      startProgress();
    });
    
  