//
// Main JS
//
import HomeLib from './includes/Home';
import states from '../../../js/src/states';

// Setup all states
states();

(function ($) {
  'use strict';

  $(document).ready(function () {
    //Home script
    new HomeLib().init();
  });
})(jQuery);
