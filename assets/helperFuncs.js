// Range function from underscore.js
const range = function(start, stop, step) {
   if (stop == null) {
     stop = start || 0;
     start = 0;
   }
   step = step || 1;

   var length = Math.max(Math.ceil((stop - start) / step), 0);
   var range = Array(length);

   for (var idx = 0; idx < length; idx++, start += step) {
     range[idx] = start;
   }

   return range;
 };

// Get average of array elements
const sum = function(array) {
    if(array.length === 0) return 0;
    else return array.reduce(function(total,el) {
        return total + el
    })

}

const svgDraw = function(el) {
    return document.createElementNS("http://www.w3.org/2000/svg",el)
};

// Lunar by Todd Motto
/*! lunar.js v1.1.0 | (c) 2016 @toddmotto | https://github.com/toddmotto/lunar */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.lunar = factory();
  }
})(this, function () {

  'use strict';

  function get(el) {
    var cl = el.getAttribute('class');
    return (cl === null ? "" : cl);
  }

  function has(elem, name) {
    return new RegExp('(\\s|^)' + name + '(\\s|$)').test(get(elem));
  }

  function add(elem, name) {
    !has(elem, name) && elem.setAttribute('class', (get(elem) && get(elem) + ' ') + name);
  }

  function remove(elem, name) {
    var news = get(elem).replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
    has(elem, name) && elem.setAttribute('class', news);
  }

  function toggle(elem, name) {
    (has(elem, name) ? remove : add)(elem, name);
  }

  return {
    hasClass: has,
    addClass: add,
    removeClass: remove,
    toggleClass: toggle
  };
});

// Array.includes() polyfill
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

function onResize(callback) {
    window.addEventListener("resize",callback);
}
