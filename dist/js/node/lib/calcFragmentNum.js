/* calcFragmentNum.js */

(function(cxt) {
  'use strict';

  var isNumber = function isNumber(s) {
    return typeof s === "number" || /^_d+$/.test(s) || s === null || s === void 0 ? true : false;
  };

  var calcFragmentNum = function calcFragmentNum(skip, len) {
    var _skip = skip | 0,
        _len = len | 0,
        score = 0;

    /*
      文字の長さから生成されるべきfragmentsの数を計算する。

      行列で考える。

        a b c d e f g
      a - ? ? ? ? ? ?
      b ? - ? ? ? ? ?
      c ? ? - ? ? ? ?
      d ? ? ? - ? ? ?
      e ? ? ? ? - ? ?
      f ? ? ? ? ? - ?
      g ? ? ? ? ? ? -

      (1) 2文字[ab]の場合、a->bの1つのみfragmentsが発生する。
      a<-bの組み合わせは考慮しない(a->bと同じであるため)。

      行列で考えると、

        a b
      a - o
      b x -

      となる。

      (2) 3文字[abc]の場合、a->b,a->c,b->cの3つのfragmentsが発生する。

        a b c
      a - o o
      b x - o
      c x x -

      つまり、長さlの時、
      fragments_num = (l * l - l) / 2
                    = l * (l - 1) / 2
      である。

      (3) skip=3（前後3文字しか判定しない）の場合、
      6文字であれば、以下のようになる。

        a b c d e f
      a - o o o x x
      b x - o o o x
      c x x - o o o
      d x x x - o o
      e x x x x - o
      f x x x x x -

      skipにより影響がある部分のみを抜粋

        a e f
      a - x x
      e x - x
      f x x -

      これは、
      x = l - skip
      とした時
      x * x - x
      である。

      これより、(3) で生成されるfragmentsの数は
      fragments_num = (l * l - l - (x * x - x)) / 2
                    = (l * (l - 1) - (x * (x - 1))) / 2
      となる。
    */
    if(!isNumber(skip) || _skip <= 0) {
      throw new Error("invalid argument: skip");
    }
    if(!isNumber(len) || _len <= 1) {
      throw new Error("invalid argument: len");
    }

    score = _len * (_len - 1);

    if(len > skip) {
      var x = _len - _skip;
      score = score - (x * (x - 1));
    }

    return score / 2;
  };

  cxt.calcFragmentNum = calcFragmentNum;

})(this);
