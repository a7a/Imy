/* stringToFragments.js */
(function(cxt) {
  'use strict';

  var arrayAddSuffix = require('./arrayAddSuffix.js').arrayAddSuffix;

  /**
  * @function
  * @param {String} str -
  * @param {Object.<{Number} start, {Number} skip, {Array} omit>} opt -
  * @returns {Array.<Object.<Number skip, Array.<Object.<Number pos, String frag>> frags>>}
  *            [{ skip: n, frags: [[{ pos: m, frag: c1 }, { pos: m+a, frag: c2 }, sort_flag<0|1>]*] }*]
  * @description
  */
  var stringToFragments = function stringToFragments(str, opt){
    var ret = [],
        arr = [],
        start = +(opt && opt.start !== void 0 ? opt.start : 0),
        skip = +(opt && opt.skip !== void 0 ? opt.skip : 1),
        omit = opt && opt.omit !== void 0 ? opt.omit : [],
        weiting_function = opt && typeof opt.weiting_function === 'function' ? opt.weiting_function : null;

    if(typeof str !== 'string' && !(str instanceof String)) {
      throw new Error('argument error: arguments[0] must be string');
    }

    if(start < 0 || !!~(start + "").indexOf(".")) {
      throw new Error('argument error: arguments[1] opt.start must be integer over 0');
    }

    if(skip < 1 || !!~(skip + "").indexOf(".")) {
      throw new Error('argument error: arguments[1] opt.skip must be integer over 1');
    }

    if(!Array.isArray(omit)) {
      throw new Error('argument error: arguments[1] opt.omit must be Array');
    }

    arr = arrayAddSuffix(str.split(''), { omit: omit });

    for(var i = 1; i <= skip; i += 1) {
      var last = ret.length,
          _frags = [],
          _sort_flags = [];

      ret[last] = { skip: i, weight: null, frags: [], sort_flags: [] };

      if(weiting_function) {
        ret[last].weight = weiting_function(i);
      }

      for(var j = 0, l = arr.length; j < l - i; j += 1) {

        if(arr[j][0] < arr[j + i][0] || arr[j][0] === arr[j + i][0] && arr[j][1] < arr[j + i][1]) {
          _frags[_frags.length] = [
            { pos: arr[j][1] + start, frag: arr[j][0] },
            { pos: arr[j + i][1] + start, frag: arr[j + i][0] }
          ];
          _sort_flags[_sort_flags.length] = 0;

        } else {
          _frags[_frags.length] = [
            { pos: arr[j][1] + start, frag: arr[j + i][0] },
            { pos: arr[j + i][1] + start, frag: arr[j][0] }
//            { pos: arr[j + i][1] + start, frag: arr[j + i][0] },
//            { pos: arr[j][1] + start, frag: arr[j][0] }
        ];
          _sort_flags[_sort_flags.length] = 1;
        }
      }

      ret[last].frags = _frags;
      ret[last].sort_flags = _sort_flags;
    }

    return ret;
  };

  cxt.stringToFragments = stringToFragments;

})(this);
