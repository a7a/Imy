/* ImyDBRdbms.js */

(function(cxt) {
  'use strict';

  var parent = require("./lib/ImyDBBase.js").ImyDBBase;

  var knex = require("knex"),
      sql = require("./param/ImyDBKnex.param.js").ImyDBKnex,
      _util = require("./lib/util.js").util,
      ERROR = require("./param/ERROR.js").ERROR;


  /**
  * @public
  * @class
  */
  var ImyDBRdbms = function ImyDBRdbms(conf) {
    parent.call(this, conf);
  };
  ImyDBRdbms._name_ = 'ImyDBRdbms';

  ImyDBRdbms.prototype = Object.create(parent.prototype, {
    constructor: {
      value: ImyDBRdbms,
      enumerable: true,
      writable: false,
      configurable: true
    }
  });

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  ImyDBRdbms.prototype.open = function open() {
    return new Promise(function() { return true; });
  };

  /**
   * @public
   * @function
   * @returs {Promise}
   */
  ImyDBRdbms.prototype.close = function close() {
    console.log(this.db.destroy);
    return this.db.destroy();
  };

  /**
  * @public
  * @function
  * @pram {Object} conf -
  * @returns {void}
  */
  ImyDBRdbms.prototype.useConfig = function useConfig(conf) {
    this.db = knex(conf);
  };

  /**
   * @public
   * @function
   * @param {Function} proc -
   * @returns {void}
   */
  ImyDBRdbms.prototype.transaction = function transaction(proc) {
    var that = this;

    return this.db.transaction(function(trx) {
      that.trx = trx;

      proc();
    })
    .then(function() {
      that.trx = null;
    })
    .catch(function() {
      that.trx = null;
    });
  };

  /**
   * @public
   * @function
   * @returns {void}
   */
  ImyDBRdbms.prototype.commit = function commit() {
    if(this.trx !== null) {
      this.trx.commit();

    } else {
      ERROR.no_transaction("commit");
    }
  };

  /**
   * @public
   * @function
   * @returns {void}
   */
  ImyDBRdbms.prototype.rollback = function rollback() {
    if(this.trx !== null) {
      this.trx.rollback();

    } else {
      ERROR.no_transaction("rollback");
    }
  };


  /**
   * @public
   * @function
   * @returns {Promise}
   * @description
   */
  ImyDBRdbms.prototype.getAllIndexFragments = function getAllIndexFragments() {
    var query = sql.fr.select.all(this._getInstance());
    this._doDebugging({ name: "getAllIndexFragments", query: query });

    return query;
  };

  /**
   * @public
   * @function
   * @param {String} type
   * @param {String} value
   * @returns {Promise}
   * @description
   */
  ImyDBRdbms.prototype.getIndexFragmentIdForTypeAndValue
  = function getIndexFragmentIdForTypeAndValue(
    type, value
  ) {
    var query = sql.fr.select["id.for_type_value"](this._getInstance(), {
      type: _util._string(type),
      value: _util._string(value)
    });
    this._doDebugging({ name: "getIndexFragmentIdForTypeAndValue", query: query });

    return query.then(function(rows) { return rows[0] ? rows[0].id : null; });
  };

  /**
  * @public
  * @function
  * @param {String} type
  * @param {String} value
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.addIndexFragment = function addIndexFragment(
    type, value
  ) {
    var query = sql.fr.insert(this._getInstance(), {
      type: _util._string(type),
      value: _util._string(value)
    });
    this._doDebugging({ name: "addIndexFragment", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {String} type
  * @param {String} value
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.removeIndexFragments = function removeIndexFragments(
    type, value
  ) {
    var query = sql.fr.delete.for_type_value(this._getInstance(), {
      type: _util._string(type),
      value: _util._string(value)
    });
    this._doDebugging({ name: "removeIndexFragments", query: query });

    return query;
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  ImyDBRdbms.prototype.truncateIndexFragments = function truncateIndexFragments() {
    var query = sql.fr.delete.all(this._getInstance());
    this._doDebugging({ name: "truncateIndexFragments", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.getAllIndexParameters = function getAllIndexParameters() {
    var query = sql.pa.select.all(this._getInstance());
    this._doDebugging({ name: "getAllIndexParameters", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {Number} idx_fragment_id -
  * @param {Number} data_id -
  * @param {Number} content_pos1 -
  * @param {Number} content_pos2 -
  * @param {Number} skip -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.addIndexParameter = function addIndexParameter(
    type, idx_fragment_id, data_id, content_pos1, content_pos2, sort_flag, skip
  ) {
    var query = sql.pa.insert(this._getInstance(), {
      type: _util._string(type),
      idx_fragment_id: _util._double(idx_fragment_id),
      data_id: _util._double(data_id),
      content_pos1: _util._int(content_pos1),
      content_pos2: _util._int(content_pos2),
      sort_flag: _util._int(sort_flag),
      skip: _util._int(skip)
    });
    this._doDebugging({ name: "addIndexParameter", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {Number} data_id -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.removeIndexParameters = function removeIndexParameters(data_id) {
    var query = sql.pa.delete.for_dataid(this._getInstance(), {
      data_id: _util._double(data_id)
    });
    this._doDebugging({ name: "removeIndexParameter", query: query });

    return query;
  };

  /**
   * @public
   * @funciton
   * @param {String} type -
   * @param {String} value -
   * @retuns {Promise}
   * @description
   */
  ImyDBRdbms.prototype.countIndexParametersOfFragment = function countIndexParametersOfFragment(type, value) {
    var query = sql.count["parametered_fragment.for_type_value"](this._getInstance(), {
      type: _util._string(type),
      value: _util._string(value)
    });
    this._doDebugging({ name: "countIndexParametersOfFragment", query: query });

    return query.then(function(ret) { return ret[0] ? ret[0][Object.keys(ret[0])[0]] : 0; });
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  ImyDBRdbms.prototype.truncateIndexParameters = function truncateIndexParameters() {
    var query = sql.pa.delete.all(this._getInstance());
    this._doDebugging({ name: "truncateIndexParameters", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.getAllData = function getAllData() {
    var query = sql.da.select["all.for"](this._getInstance());
    this._doDebugging({ name: "getAllData", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {String} content -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.getDataForTypeAndContent = function getDataForTypeAndContent(type, content) {
    var query = sql.da.select["all.for"](this._getInstance(), {
      type: _util._string(type),
      content: _util._string(content)
    });
    this._doDebugging({ name: "getDataForTypeAndContent", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {Number} id -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.getDatumForId = function getDatumForId(id) {
    var query = sql.da.select["all.for"](this._getInstance(), {
      id: _util._double(id)
    });
    this._doDebugging({ name: "getDatumForId", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} content -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.addDatum = function addDatum(type, content) {
    var query = sql.da.insert(this._getInstance(), {
      type: _util._string(type),
      content: _util._string(content)
    });
    this._doDebugging({ name: "addDatum", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {Number} id -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.removeData = function removeData(id) {
    var query = sql.da.delete.for(this._getInstance(), {
      id: _util._double(id)
    });
    this._doDebugging({ name: "removeData", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {Object} set -
  *   {String} set.type -
  *   {String} set.content -
  * @param {Object} where -
  *   {Number} where.id -
  *   {String} where.type -
  *   {String} where.content -
  * @returns {Promise}
  * @description
  */
  ImyDBRdbms.prototype.updateData = function updateData(set, where) {
    var query = sql.da.update.for(this._getInstance(), {
      type: _util._string(set.type),
      content: _util._string(set.content)
    }, {
      id: _util._double(where.id),
      type: _util._double(where.type),
      content: _util._double(where.type)
    });
    this._doDebugging({ name: "updateData", query: query });

    return query;
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  ImyDBRdbms.prototype.truncateData = function truncateData() {
    var query = sql.da.delete.all(this._getInstance());
    this._doDebugging({ name: "truncateData", query: query });

    return query;
  };

  /**
  * @public
  * @function
  * @param {Stirng} type -
  * @param {String[]} values -
  * @returns
  * @description
  */
  ImyDBRdbms.prototype.getForTypeAndValues = function getForTypeAndValues(type, values) {
    var query = sql.search["parametered_fragment.for_type_values"](this._getInstance(), {
      type: _util._string(type),
      values: values
    });
    this._doDebugging({ name: "getForTypeAndValues", query: query });

    return query;
  };


  cxt.ImyDBRdbms = ImyDBRdbms;

}(this));
