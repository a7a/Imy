/* analyzeFragments.js */

(function(cxt) {
  "use strict";

  var analyzeFragments = function analyzeFragments(fragments) {
    var map = {},
        values = [],
        i = 0, l = 0,
        j = 0, l2 = 0;

    for(i = 0, l = fragments.length; i < l; i = i + 1) {
      var fragment = fragments[i],
          frags = fragment.frags;

      for(j = 0, l2 = frags.length; j < l2; j = j + 1) {
        var frag = frags[j][0].frag + frags[j][1].frag;

        values[values.length] = frag;
        if(map[frag] === void 0) {
          map[frag] = [{
            pos1: frags[j][0].pos,
            pos2: frags[j][1].pos,
            sort_flag: fragment.sort_flags[j]
          }];

        } else {
          map[frag][map[frag].length] = {
            pos1: frags[j][0].pos,
            pos2: frags[j][1].pos,
            sort_flag: fragment.sort_flags[j]
          };
        }
      }
    }

    return {
      map: map,
      values: values
    };
  };


  cxt.analyzeFragments = analyzeFragments;

}(this));
