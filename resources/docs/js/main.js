//
// Main JS
//
import HomeLib from './includes/Home';

(function ($) {
  'use strict';

  $(document).ready(function () {
    //Home script
    new HomeLib().init();
  });
})(jQuery);
