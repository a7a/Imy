/* calculateScore.js */

(function(cxt) {
  "use strict";

  var calcFragmentNum = require("./calcFragmentNum.js").calcFragmentNum;


  var range_buffer = [],
      range_last_item = {},
      current_data_id = 0,
      p1 = -1,
      p2 = -1;


  var calculateScore = function calculateScore(rows, fragments, content_length, spos, param) {
    var results = [],
        result = null,
        range = [];

    range_buffer = [];
    range_last_item = {};
    current_data_id = 0;
    p1 = -1;
    p2 = -1;

    if(rows.length === 0) {
      return results;
    }

    /*
     最短一致長 = 検索文字長*最長一致倍率
     最長一致長 = 検索文字長*最長一致倍率
     p1 = 一致開始位置
     p2 = 最短一致位置 [p1とp1-nの差]が[最短一致長]以上となるp1-n
     p3 = 最長一致位置 [p1とp1-nの差]が[最長一致長]以上となるp1-n

         ↓[cursor] →
     |a, b, c, d, e, f, g, h, i|
      p1

     開始位置を決定したら、1つずつ前を検索し、p2、p3を決定

                           ↓[cursor]
     |a, b, c, d, e, f, g, h, i|
      p1             p2    p3
                     ↑最低ここから一致
                           ↑最大ここまで一致

                              ↓[cursor]
     |a, b, c, d, e, f, g, h, i|
      p1             p2    p3

     カーソルが一致範囲を超えたら

     |a, b, c, d, e, f, g, h, i|
        →p1         ←p2→

     開始位置を一つずらして、最短一致位置を計算

                           ↓[cursor] →
     |a, b, c, d, e, f, g, h, i|
         p1             p2

     最短一致位置が決定したら、そこから再度計算
    */

    // 1つ目の要素を取得
    range_last_item = _cursorNext(range, rows);

    // 一致開始位置を決定
    p1 = range_last_item.start;

    current_data_id = range_last_item.data_id;
//console.log("~~~~~");
//console.log(param);
//console.log(content_length + " " + param.matching_min_ratio + " " + param.matching_max_ratio);
//console.log(content_length * param.matching_min_ratio);
//console.log(content_length * param.matching_max_ratio);

    while(true) {
//console.log(range);
//console.log("* range length= " + _getRangeLength(range));
//console.log(range_last_item);
//console.log("");
      if(
        p2 === -1 &&
        _getRangeLength(range) >= content_length * param.matching_min_ratio &&
        _getRangeLength(range) < content_length * param.matching_max_ratio
      ) {
        // 最短一致位置が未決定、かつ、[p1とp1-nの差]が[最短一致位置]以上

        // あいまい値を計算
        result = _createResult(range, spos, content_length, param);
        results = _mergeResult(results, result);

        if(result.weight === 1) {
          // ある開始位置で完全一致した

          // 一致開始位置を前に進めて、最短一致位置を計算する
          _nextStartPosition(range, rows, content_length, param);

          if(p2 === -1) {
            if(range.length === 0) {
              break;
            }
            // 最短一致位置を決定できなかった
            _nextData(range);
          }

        } else {
          // 最短一致位置を決定
          p2 = range_last_item.start;
          // カーソルを前に進める
          range_last_item = _cursorNext(range, rows);
        }

      } else if(
        // [p1とp1-nの差]が[最長一致位置]より大きい
        _getRangeLength(range) > content_length * param.matching_max_ratio
        // 最終要素に達した
        || (rows.length === 0 && range_buffer.length === 0)
        // data_idが変わった
        || range_last_item.data_id !== current_data_id
      ) {
        if(_getRangeLength(range) > content_length * param.matching_max_ratio) {
          range_last_item = _cursorPrevious(range);

          // 一致開始位置を前に進めて、最短一致位置を計算する
          _nextStartPosition(range, rows, content_length, param);

          if(p2 === -1) {
            if(range.length === 0) {
              break;
            }
            // 最短一致位置を決定できなかった
            _nextData(range);
          }

        } else if(p2 === -1) {
          // 最短一致位置が未決定

          if(rows.length !== 0) {
            // 最短一致長で一致しないということはそのデータでは一致しないので
            // 次のデータに進める
            _nextData(range);

          } else {
            // 次のデータが存在しなければ終了
            break;
          }

        } else {
          // 最短一致位置が決定済み

          // 最終要素に達した
          if (rows.length === 0 && range_buffer.length === 0) {
            // あいまい値を計算
            result = _createResult(range, spos, content_length, param);
            results = _mergeResult(results, result);
          }

          if(range.length > 2) {
            range_last_item = _cursorPrevious(range);
          }

          // 一致開始位置を前に進めて、最短一致位置を計算する
          _nextStartPosition(range, rows, content_length, param);

          if(p2 === -1) {
            if(range.length === 0) {
              break;
            }
            // 最短一致位置を決定できなかった
            _nextData(range);
          }
        }

      } else if(
        p2 !== -1
        && _getRangeLength(range) <= content_length * param.matching_max_ratio
      ) {
        // 最短一致位置が決定済み、かつ、[p1とp1-nの差]が[最長一致位置]以下

        // あいまい値を計算
        result = _createResult(range, spos, content_length, param);
        results = _mergeResult(results, result);

        if(result.weight === 1) {
          // ある開始位置で完全一致した

          // 一致開始位置を前に進めて、最短一致位置を計算する
          _nextStartPosition(range, rows, content_length, param);

        } else {
          // カーソルを前に進める
          range_last_item = _cursorNext(range, rows);
        }

      } else {
        // カーソルを前に進める
        range_last_item = _cursorNext(range, rows);
      }
    }

    return results;
  };


  // ######################################################

  /**
   * @private
   * @function
   */
  var _cursorNext = function _cursorNext(_range, rows) {
    // カーソルを進める
    var ret = {
      data_id: 0,
      start: 0,
      items: []
    };

    if(range_buffer.length > 0) {
      // バッファが存在する場合、バッファから取得
      ret = range_buffer.pop();

    } else if(rows.length > 0) {
      // rowsが存在する場合、rowsから取得
      while(rows.length > 0) {
        if(ret.data_id === 0 || (rows[0].data_id === ret.data_id && rows[0].d_content_pos1 === ret.start)) {
          ret.data_id = rows[0].data_id;
          ret.start = rows[0].d_content_pos1;
          ret.items[ret.items.length] = rows.shift();

        } else {
          break;
        }
      }

    } else {
      // バッファがない、かつ、rowsにもない
      return null;
    }

    if(ret.data_id === 0) {
      // 取得できなかった（data_idが変わってしまう）
      return null;
    }

    _range[_range.length] = ret;

    return ret;
  };

  /**
   * @private
   * @function
   */
  var _cursorPrevious = function _cursorPrevious(_range) {
    range_buffer[range_buffer.length] = _range.pop();

    return _last(_range);
  };

  /**
   * @private
   * @function
   */
  var _first = function _first(_range) {
    return _range[0];
  };

  /**
   * @private
   * @function
   */
  var _last = function _last(_range) {
    return _range[_range.length - 1];
  };

  /**
   * @private
   * @function
   */
  var _new = function _new(_range) {
    _range.splice(0, _range.length - 1);

    return _last(_range);
  };

  /**
   * @private
   * @function
   */
  var _getRangeLength = function _getRangeLength(_range) {
    if(_range.length === 0) {
      return 0;
    }

    return _range[_range.length - 1].start - _range[0].start + 2;
  };

  /**
   * @private
   * @function
   */
  var _nextStartPosition = function _nextStartPosition(_range, rows, content_length, param) {
    // 一致開始位置を前に進める
    _range.shift();

    if(_range.length < 2) {
      // 1つ目の要素を取得
      range_last_item = _cursorNext(_range, rows);

      if(
        // 最終要素の場合
        range_last_item === null
        // data_idが変わる場合
        || range_last_item.data_id !== current_data_id
      ) {
        p2 = -1;

        return;
      }

      current_data_id = range_last_item.data_id;
    }

    p1 = _first(_range).start;

    // 最短一致位置を検索

    if(_getRangeLength(_range) >= content_length * param.matching_min_ratio) {
      // [p1とp1-nの差]が[最短一致位置]より後ろ

      // 後ろに戻って、最短一致位置を求める
      while(_getRangeLength(_range) > content_length * param.matching_min_ratio) {
        range_last_item = _cursorPrevious(_range);
        p2 = range_last_item.start;

        if(p1 === p2) {
          p2 = -1;

          return;
        }
      }

    } else {
      // [p1とp1-nの差]が[最短一致位置]より前

      // 前に進んで、最短一致位置を求める
      while(_getRangeLength(_range) < content_length * param.matching_min_ratio) {
        range_last_item = _cursorNext(_range, rows);
        if(range_last_item === null) {
          p2 = -1;

          return;
        }

        if(range_last_item.data_id !== current_data_id) {
          // data_idが変わったら、次のデータに進める

          p1 = p2;
          p2 = -1;
          current_data_id = range_last_item.data_id;

          return;

        } else if(rows.length === 0) {
          if(_getRangeLength(_range) >= content_length * param.matching_min_ratio) {
            p2 = range_last_item.start;
          } else {
            p2 = -1;
          }

          return;
        }
      }

      p2 = range_last_item.start;
    }
  };

  /**
   * @private
   * @function
   */
  var _nextData = function _nextData(_range) {
    range_last_item = _new(_range);
    p1 = range_last_item.start;
    p2 = -1;

    current_data_id = range_last_item.data_id;
  };

  /**
   * @private
   * @function
   */
  var _createResult = function _createResult(_range, spos, content_length, param ) {
    var id = _first(_range).data_id,
        // DB側一致開始位置（比較用）
        start_d_pos = Number.MAX_SAFE_INTEGER,
        // DB側一致終了位置（比較用）
        end_d_pos = 0,
        // DB側一致開始位置（実際の位置）
        start_d_pos2 = Number.MAX_SAFE_INTEGER,
        // DB側一致終了位置（実際の位置）
        end_d_pos2 = 0,
        // 入力側一致開始位置
        start_s_pos = Number.MAX_SAFE_INTEGER,
        // 入力側一致終了位置
        end_s_pos = 0,
        item_start_s_pos = 0,
        item_end_s_pos = 0,
        idx = 0,
        fragments_num = 0,
        sort_num = 0,
        vcount = {},
        match = true,
        i = 0, l = 0,
        j = 0, l2 = 0;

    for(i = 0, l = _range.length; i < l; i = i + 1) {
      var items = _range[i].items;

      for(j = 0, l2 = items.length; j < l2; j = j + 1) {
        var item = items[j],
            value = item.value;

        if(vcount[value] === void 0) {
          vcount[value] = 0;
        } else {
          vcount[value] = vcount[value] + 1;
        }

        if(spos[value][vcount[value]] !== void 0) {
          idx = vcount[value];
          match = true;
        } else {
          idx = spos[value].length - 1;
          match = false;
        }
        item_start_s_pos = spos[value][idx].pos1;
        item_end_s_pos = spos[value][idx].pos2;

        // 一致数
        fragments_num += 1;

        // 一致の開始(DB側)
        if(start_d_pos > item.d_content_pos1) {
          start_d_pos = item.d_content_pos1;

          if(match) {
            start_d_pos2 = item.d_content_pos1;
          }
        }
        // 一致の終了(DB側)
        if(end_d_pos < item.d_content_pos2) {
          end_d_pos = item.d_content_pos2;

          if(match) {
            end_d_pos2 = item.d_content_pos2;
          }
        }

        // 一致の開始(入力側)
        if(start_s_pos > item_start_s_pos) {
          start_s_pos = item_start_s_pos;
        }
        // 一致の終了（入力側)
        if(end_s_pos < item_end_s_pos) {
          end_s_pos = item_end_s_pos;
        }

        sort_num = sort_num + (item.sort_flag ^ spos[value][idx].sort_flag);
      }
    }

    var range_diff_num = (end_d_pos - start_d_pos) - (end_s_pos - start_s_pos),
        score = 0;

    if(range_diff_num > 0) {
      score = fragments_num / calcFragmentNum(param.skip, content_length + range_diff_num);
    } else {
      score = fragments_num / calcFragmentNum(param.skip, content_length);
    }

    while(score > 1) {
      score -= 1;
    }

    if(param.limit_min_score && score < param.limit_min_score) {
      return null;
    }

    return {
      id: id,
      start_pos: start_d_pos2,
      end_pos: end_d_pos2,
      weight: score,
      sort_num: sort_num
    };
  };

  /**
   * @private
   * @function
   */
  var _mergeResult = function _mergeResult(results, result) {
    if(!result) {
      return results;
    }

    for(var i = 0, l = results.length; i < l; i = i + 1) {
      if(results[i].id === result.id && results[i].start_pos === result.start_pos) {
        if(results[i].weight < result.weight) {
          results[i] = result;
        }

        return results;
      }
    }

    results[results.length] = result;

    return results;
  };


  cxt.calculateScore = calculateScore;

}(this));
