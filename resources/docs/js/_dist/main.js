(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//
// Home lib
//
var Home = /*#__PURE__*/function () {
  /**
   * Class constructor
   *
   * @return void
   */
  function Home() {
    _classCallCheck(this, Home);
  }
  /**
   * Init
   *
   * @return mixed
   */


  _createClass(Home, [{
    key: "init",
    value: function init() {}
  }]);

  return Home;
}();

var _default = Home;
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _Home = _interopRequireDefault(require("./includes/Home"));

var _states = _interopRequireDefault(require("../../../js/src/states"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//
// Main JS
//
// Setup all states
(0, _states["default"])();

(function ($) {
  'use strict';

  $(document).ready(function () {
    //Home script
    new _Home["default"]().init();
  });
})(jQuery);

},{"../../../js/src/states":4,"./includes/Home":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapse = collapse;
exports.expand = expand;
exports.toggle = toggle;

// This is the important part!
function collapse(element) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!parent) {
    parent = element;
  } // get the height of the element's inner content, regardless of its actual size


  var sectionHeight = element.scrollHeight; // temporarily disable all css transitions

  var elementTransition = element.style.transition;
  element.style.transition = ''; // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'

  requestAnimationFrame(function () {
    element.style.height = "".concat(sectionHeight, "px");
    element.style.transition = elementTransition; // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0

    requestAnimationFrame(function () {
      element.style.height = "".concat(0, "px");
    });
  }); // mark the section as "currently collapsed"

  parent.setAttribute('data-collapsed', 'true');
}

function expand(element) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!parent) {
    parent = element;
  } // get the height of the element's inner content, regardless of its actual size


  var sectionHeight = element.scrollHeight; // have the element transition to the height of its inner content

  element.style.height = "".concat(sectionHeight, "px"); // when the next css transition finishes (which should be the one we just triggered)

  element.addEventListener('transitionend', function () {
    // remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', arguments.callee); // remove "height" from the element's inline styles, so it can return to its initial value

    element.style.height = null;
  }); // mark the section as "currently not collapsed"

  parent.setAttribute('data-collapsed', 'false');
}

function toggle() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.toggle';
  // Setup
  document.querySelectorAll('.collapsible').forEach(function (contentEl) {
    if (!contentEl.hasAttribute('data-collapsed')) {
      contentEl.setAttribute('data-collapsed', true);
      contentEl.querySelector('.collapsible__content').style.height = '0px';
    }
  }); // Event: click

  if (document.querySelector(selector)) {
    document.querySelector(selector).addEventListener('click', function (e) {
      e.preventDefault();
      var button = e.currentTarget;
      var section = button.closest('.collapsible');
      var content = section.classList.contains('collapsible__content') ? section : section.querySelector('.collapsible__content');
      var isCollapsed = section.getAttribute('data-collapsed') === 'true';

      if (isCollapsed) {
        expand(content, section);
        section.setAttribute('data-collapsed', 'false');
      } else {
        collapse(content, section);
      }
    });
  }
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = states;

var _collapse = require("./collapse");

/**
 * js/states/index.js
 */
function states() {
  // Setup toggle
  (0, _collapse.toggle)();
}

},{"./collapse":3}]},{},[2]);
