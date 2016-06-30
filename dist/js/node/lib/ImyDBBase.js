/* ImyDBBase.js */

(function(cxt) {
  'use strict';

  var stringToFragments = require("./stringToFragments.js").stringToFragments,
      analyzeFragments = require("./analyzeFragments.js").analyzeFragments,
      calculateScore = require("./calculateScore.js").calculateScore;

  var DEFAULT_SKIP = 5,
      DEFAULT_MATCHING_MAX_RATIO = 1.6,
      DEFAULT_MATCHING_MIN_RATIO = 0.6,
      DEFAULT_MIN_SCORE = 0;

  var ImyDBBase = function ImyDBBase(conf) {
    this.db = null;
    this.trx = null;
    this.debug = false;
    this._debugger = null;
    this._conf = conf;
  };

  ImyDBBase.prototype.transaction = function transaction() {};
  ImyDBBase.prototype.commit = function commit() {};
  ImyDBBase.prototype.rollback = function rollback() {};

  ImyDBBase.prototype.getAllIndexFragment = function getAllIndexFragment() {};
  ImyDBBase.prototype.getIndexFragmentIdForTypeAndValue = function getIndexFragmentIdForTypeAndValue() {};
  ImyDBBase.prototype.addIndexFragment = function addIndexFragment() {};
  ImyDBBase.prototype.removeIndexFragment = function removeIndexFragment() {};
  ImyDBBase.prototype.truncateIndexFragments = function truncateIndexFragments() {};

  ImyDBBase.prototype.getAllIndexParameter = function getAllIndexParameter() {};
  ImyDBBase.prototype.addIndexParameter = function addIndexParameter() {};
  ImyDBBase.prototype.removeIndexParameter = function removeIndexParameter() {};
  ImyDBBase.prototype.countIndexParameterOfFragment = function countIndexParameterOfFragment() {};
  ImyDBBase.prototype.truncateIndexParameters = function truncateIndexParameters() {};

  ImyDBBase.prototype.getAllData = function getAllData() {};
  ImyDBBase.prototype.getDataForTypeAndContent = function getDataForTypeAndContent() {};
  ImyDBBase.prototype.getDataForIdAndPage = function getDataForIdAndPage() {};
  ImyDBBase.prototype.getMaxNo = function getMaxNo() {};
  ImyDBBase.prototype.addData = function addData() {};
  ImyDBBase.prototype.removeData = function removeData() {};
  ImyDBBase.prototype.updateData = function updateData() {};
  ImyDBBase.prototype.truncateData = function truncateData() {};

  /**
   * @public
   * @function
   * @returns {void}
   */
  ImyDBBase.prototype.setDebugger = function setDebugger(proc) {
    if(typeof proc === "function") {
      this._debugger = proc;
    }
  };

  /**
   * @protected
   * @function
   * @returns {void}
   */
  ImyDBBase.prototype._doDebugging = function _doDebugging() {
    if(this.debug && this._debugger) {
      this._debugger.apply(this, arguments);
    }
  };

  /**
   * @protected
   * @function
   * @returns {any}
   */
  ImyDBBase.prototype._getInstance = function _getInstance() {
    return this.trx || this.db;
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} str - search string
  * @param {Object} param -
  * @returns
  * @description
  */
  ImyDBBase.prototype.search = function search(type, str, param) {
    var fragments = stringToFragments(str, param),
        analyzed = analyzeFragments(fragments),
        _param = {};

    _param.skip = param.skip
      || this._conf.skip
      || DEFAULT_SKIP;
    _param.matching_max_ratio = param.matching_max_ratio
      || this._conf.matching_max_ratio
      || DEFAULT_MATCHING_MAX_RATIO;
    _param.matching_min_ratio = param.matching_min_ratio
      || this._conf.matching_min_ratio
      || DEFAULT_MATCHING_MIN_RATIO;
    _param.limit_min_score = param.limit_min_score
      || this._conf.limit_min_score
      || DEFAULT_MIN_SCORE;

    return this.getForTypeAndValues(type, analyzed.values)
    .then(function(rows) {
      return calculateScore(rows, fragments, str.length, analyzed.map, _param);
    });
  };


  cxt.ImyDBBase = ImyDBBase;

})(this);
