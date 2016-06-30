/* createResult.js */

(function(cxt) {
  "use strict";

  var calcFragmentNum = require("./calcFragmentNum.js").calcFragmentNum;

  var createResult = function createResult(
    id,
    range,
    spos,
    content_length,
    target_end,
    param
  ) {
    var score = 0,
        start_d_pos = Number.MAX_SAFE_INTEGER,
        end_d_pos = 0,
        start_s_pos = Number.MAX_SAFE_INTEGER,
        end_s_pos = 0,
        item_start_s_pos = 0,
        item_end_s_pos = 0,
        idx = 0,
        fragments_num = 0,
        sort_num = 0,
        vcount = {};

    for(var i = 0; i < range.length; i += 1) {
      var items = range[i].item;

      for(var j = 0; j < items.length; j += 1) {
        var item = items[j],
            value = item.value;

        if(vcount[value] === void 0) {
          vcount[value] = 0;
        } else {
          vcount[value] = vcount[value] + 1;
        }
        if(spos[value][vcount[value]] !== void 0) {
          idx = vcount[value];
        } else {
          idx = spos[value].length - 1;
        }
        item_start_s_pos = spos[value][idx].pos1;
        item_end_s_pos = spos[value][idx].pos2;

        if(item.end_d_pos < target_end) {
          // 一致数
          fragments_num += 1;

          // 一致の開始(DB側)
          if(start_d_pos > item.start_d_pos) {
            start_d_pos = item.start_d_pos;
          }
          // 一致の終了(DB側)
          if(end_d_pos < item.end_d_pos) {
            end_d_pos = item.end_d_pos;
          }

          // 一致の開始(入力側)
          //if(item.start_s_pos !== null && start_s_pos > item.start_s_pos) {
          if(item_start_s_pos !== null && start_s_pos > item_start_s_pos) {
            start_s_pos = item_start_s_pos;
          }
          // 一致の終了（入力側)
          //if(item.end_s_pos !== null && end_s_pos < item.end_s_pos) {
          if(item_end_s_pos !== null && end_s_pos < item_end_s_pos) {
            end_s_pos = item_end_s_pos;
          }
        }

console.log(value + " : " + item.s_flag + " " + spos[value][idx].sort_flag);
        sort_num = sort_num + (item.s_flag ^ spos[value][idx].sort_flag);
console.log("sort_num: " + sort_num);
      }
    }
console.log("===");

    var range_diff_num = (end_d_pos - start_d_pos) - (end_s_pos - start_s_pos);

    if(range_diff_num > 0) {
      score = fragments_num / (calcFragmentNum(param.skip, content_length + range_diff_num) / 2);
    } else {
      score = fragments_num / (calcFragmentNum(param.skip, content_length) / 2);
    }

    while(score > 1) {
      score -= 1;
    }

    return {
      id: id,
      start_pos: start_d_pos,
      end_pos: end_d_pos,
      weight: score,
      sort_num: sort_num
    };
  };

  cxt.createResult = createResult;

}(this));
