Polymer('my-toolbar');;

  CoreStyle.g.columns = 3;
;
Polymer('my-panel');;


  CoreStyle.g.theme = {
    colorOne: '#abcdef',
    colorTwo: '#123456',
    colorThree: '#224433'
  }
;

  (function() {

    addEventListener('polymer-ready', function() {
      var items = [];
        for (var i=0; i < 100; i++) {
          items.push(i);
        }

      CoreStyle.g.items = items;

      addEventListener('template-bound', function(e) {
        e.target.g = CoreStyle.g;
        e.target.items = items;
      });
    });

  })();
  