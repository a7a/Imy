/* arrayAddSuffix.js */
(function(cxt) {
  'use strict';

  /**
  * @function
  * @param {Array} arr
  * @param {Object.<{String} omit>} opt
  * @returns {Array.<InputArrayElement, {Number}>}
  * @description
  */
  var arrayAddSuffix = function arrayAddSuffix(arr, opt) {
    var ret = [],
        omit = opt && Array.isArray(opt.omit) ? opt.omit : [];

    for(var i = 0, l = arr.length; i < l; i += 1) {
      if(!~omit.indexOf(arr[i])) {
        ret[ret.length] = [arr[i], i];
      }
    }

    return ret;
  };

  cxt.arrayAddSuffix = arrayAddSuffix;

})(this);
