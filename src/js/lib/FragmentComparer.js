/* FragmentComparer.js */

(function(cxt) {
  'use strict';

  var FragmentComparer = function FragmentComparer() {
    this._frags = {};
  };

  FragmentComparer.prototype.addLeft = function addLeft(frag) {
    var _frag = frag + '';

    if(!this._frags[_frag]) {
      this._frags[_frag] = 1;
    } else {
      this._frags[_frag] += 1;
    }
  };

  FragmentComparer.prototype.addRight = function addRight(frag) {
    var _frag = frag + '';

    if(!this._frags[_frag]) {
      this._frags[_frag] = -1;
    } else {
      this._frags[_frag] -= 1;
    }
  };

  FragmentComparer.prototype.checkLimitExistion = function checkLimitExistion() {
    for(var frag in this._frags) {
      if(this._frags[frag] <= 0) {
        return true;
      }
    }

    return false;
  };

  FragmentComparer.prototype.clone = function clone() {
    var ret = new FragmentComparer();

    for(var i in this._frags) {
      ret._frags[i] = this._frags[i];
    }

    return ret;
  };

  FragmentComparer.prototype.getDiffSum = function getDiffSum() {
    var sum = 0;

    for(var i in this._frags) {
      sum += Math.abs(this._frags[i] || 0);
    }

    return sum;
  };

  cxt.FragmentComparer = FragmentComparer;

})(this);
