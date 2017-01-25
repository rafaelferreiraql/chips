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

const svgDraw = function(el) {
    return document.createElementNS("http://www.w3.org/2000/svg",el)
}
