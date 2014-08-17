
      var single = document.getElementById('single');
      single.addEventListener('change', function() {
        console.log('single: value committed: ', single.value);
      });
    ;

      var password = document.getElementById('password');
      password.addEventListener('change', function() {
        console.log('password: value committed: ', password.value);
      });
    ;

      document.querySelector('.validation').addEventListener('input-invalid', function(e, value, s) {
        console.log(e.target.id, 'invalid, inputValue:', e.detail.value, e.target.validity);
      });
      document.querySelector('.validation').addEventListener('input-valid', function(e, value, s) {
        console.log(e.target.id, 'valid, inputValue:', e.detail.value, e.target.validity);
      });
    