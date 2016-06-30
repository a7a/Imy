/* ImyDBManager.js */

(function(cxt) {
  "use strict";

  var SLI2 = cxt.SLI2 || require("sli2").SLI2 || cxt.SLI2,
      SyncPromise = require("./lib/SyncPromise.js").SyncPromise,
      sql_knex = require("./param/ImyDBKnex.param.js").ImyDBKnex,
      sql_sli2 = require("./param/ImyDBSLI2.param.js").ImyDBSLI2,
      ERROR = require("./param/ERROR.js").ERROR;

  var isKnex = function isKnex(db) {
    return db.name === "knex";
    //return db.client && db.client.config && db.client.config.client ? true : false;
  };
  var isSli2 = function isSli2(db) {
    return db instanceof SLI2;
  };
  var getSQLByDB = function getSQLByDB(db) {
    return new SyncPromise(function(fulfill, reject) {
      if(isKnex(db)) {
        fulfill(sql_knex);

      } else if(isSli2(db)) {
        fulfill(sql_sli2);

      } else {
        reject(ERROR.database_error("ImyDBManager", "getSQLByDB"));
      }
    });
  };

  /**
  * @namespace
  */
  var ImyDBManager = {};

  /**
   * @public
   * @static
   * @funiton
   * @param {Knex|SLI2} db -
   * @param {String} type -
   * @param {String[]} names -
   * @returns {Promise}
   */
  ImyDBManager.checkObject = function checkObject(db, type, names) {
    if(isKnex(db)) {
      return this._checkObjectForKnex(db, type, names);

    } else if(isSli2(db)) {
      return this._checkObjectForSli2(db, type, names);

    } else {
      return new SyncPromise(function(fulfill, reject) {
        reject(ERROR.database_error("ImyDBManager", "checkObject"));
      });
    }
  };

  /**
   * @private
   * @static
   * @function
   * @param {SLI2} db -
   * @param {String} type -
   * @param {String[]} names -
   * @returns {Promise}
   */
  ImyDBManager._checkObjectForSli2 = function _checkObjectForSli2(db, type, names) {
    var tables = [].slice.apply(db.db.objectStoreNames),
        i = 0, l = 0,
        j = 0, l2 = 0;

    if(tables.length === 0) {
      return new SyncPromise(function(fulfill) {
        fulfill([]);
      });

    } else {
      return new SyncPromise(function(fulfill) {
        var ret = [];

        db.beginTransaction(tables, "readonly", function() {
          var indices = [];

          for(i = 0, l = tables.length; i < l; i = i + 1) {
            var idx_names = db.tables[tables[i]].store.indexNames;

            for(j = 0, l2 = idx_names.length; j < l2; j = j + 1) {
              indices[indices.length] = idx_names[j];
            }
          }

          if(!type || type === "table") {
            for(i = 0, l = tables.length; i < l; i = i + 1) {
              if(names.length === 0 || !!~names.indexOf(tables[i])) {
                ret[ret.length] = { type: "table", name: tables[i] };
              }
            }
          }
          if(!type || type === "index") {
            for(i = 0, l = indices.length; i < l; i = i + 1) {
              if(names.length === 0 || !!~names.indexOf(indices[i])) {
                ret[ret.length] = { type: "index", name: indices[i] };
              }
            }
          }
        })
        .then(function() {
          fulfill(ret);
        });
      });
    }
  };

  /**
   * @private
   * @static
   * @funiton
   * @param {Knex} db -
   * @param {String} type -
   * @param {String[]} names -
   * @returns {Promise}
   */
  ImyDBManager._checkObjectForKnex = function _checkObjectForKnex(db, type, names) {
    var config = db.client.config,
        client = config.client,
        query = null;

    switch(client) {
      case "mysql":
        var database = config.connection.database;

        if(type === "table") {
          query = db.withSchema('information_schema')
            .select(db.raw("distinct 'table' type, table_name name"))
            .from('statistics')
            .where('table_schema', database);

          if(names) {
            query = query.whereIn('table_name', names);
          }

        } else if(type === "index") {
          query = db.withSchema('information_schema')
            .select(db.raw("distinct 'index' type, index_name name"))
            .from('statistics')
            .where('index_schema', database);

          if(names) {
            query = query.whereIn('index_name', names);
          }

        } else if(!type) {
          query = db.withSchema('information_schema')
            .select(db.raw("distinct 'table' type, table_name name"))
            .from('statistics')
            .where('table_schema', database)
            .union(function() {
              this.withSchema('information_schema')
                .select(db.raw("distinct 'index' type, index_name name"))
                .from('statistics')
                .where('index_schema', database);

              if(names) {
                this.whereIn('index_name', names);
              }
            });

          if(names) {
            query = query.whereIn('table_name', names);
          }
        }

        return query;

      case "pg":
        var search_path = config.searchPath.split(",").map(function(e) {
          return e.replace(/^\s*/, "").replace(/\s*$/, "");
        });

        if(type === "table") {
          query = db
            .select(db.raw("'table' as type, tablename as name"))
            .from('pg_tables')
            .whereIn('schemaname', search_path);

          if(names) {
            query = query.whereIn('tablename', names);
          }

        } else if(type === "index") {
          query = db
            .select(db.raw("'index' as type, indexname as name"))
            .from('pg_indexes')
            .whereIn('schemaname', search_path);

          if(names) {
            query = query.whereIn('indexname', names);
          }

        } else if(!type) {
          query = db
            .select(db.raw("'table' as type, tablename as name"))
            .from('pg_tables')
            .whereIn('schemaname', search_path)
            .union(function() {
              this
                .select(db.raw("'index' as type, indexname as name"))
                .from('pg_indexes')
                .whereIn('schemaname', search_path);

              if(names) {
                this.whereIn('indexname', names);
              }
            });

          if(names) {
            query = query.whereIn('tablename', names);
          }
        }

        return query;

      case "sqlite3":
        query = db
          .select(db.raw("type, name"))
          .from('sqlite_master');

        if(type) {
          query = query.where('type', type);
        }
        if(names) {
          query = query.whereIn('name', names);
        }

        return query;

      default:
        return new SyncPromise(function(fulfill, reject) {
          reject(ERROR.unsupported_client(client));
        });

    }
  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.createTables = function createTables(db) {

    return getSQLByDB(db)
    .then(function(sql) {

      if(isKnex(db)) {
        return db.transaction(function(trx) {
          return SyncPromise.all([
            sql.fr.create(trx),
            sql.pa.create(trx),
            sql.da.create(trx)
          ])
          .then(trx.commit)
          .catch(trx.rollback);
        });

      } else if(isSli2(db)) {
        return db.upgrade(function() {
          sql.fr.create(db);
          sql.pa.create(db);
          sql.da.create(db);
        });

      } else {
        return new SyncPromise(function(fulfill, reject) {
          reject(ERROR.database_error("ImyDBManager", "createTables"));
        });
      }
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.createTablesIfNotExist = function createTablesIfNotExist(db) {
    var that = this;

    return getSQLByDB(db)
    .then(function(sql) {

      return that.checkObject(db, "table", [ sql.fr.name, sql.pa.name, sql.da.name ])
      .then(function(ret) {
        if(isKnex(db)) {
          return db.transaction(function(trx) {
            return SyncPromise.all([
              !ret[0] ? sql.fr.create(trx) : 0,
              !ret[1] ? sql.pa.create(trx) : 0,
              !ret[2] ? sql.da.create(trx) : 0
            ])
            .then(trx.commit)
            .catch(trx.rollback);
          });

        } else if(isSli2(db)) {
          return db.upgrade(function() {
            if(!ret[0]) {
              sql.fr.create(db);
            }
            if(!ret[1]) {
              sql.pa.create(db);
            }
            if(!ret[2]) {
              sql.da.create(db);
            }
          })
          .catch(db.rollback);

        } else {
          return new SyncPromise(function(fulfill, reject) {
            reject(ERROR.database_error("ImyDBManager", "createTablesIfNotExist"));
          });
        }
      });
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.dropTables = function dropTables(db) {

    return getSQLByDB(db)
    .then(function(sql) {

      if(isKnex(db)) {
        return db.transaction(function(trx) {
          return SyncPromise.all([
            sql.fr.drop(trx),
            sql.pa.drop(trx),
            sql.da.drop(trx)
          ])
          .then(trx.commit)
          .catch(trx.rollback);
        });

      } else if(isSli2(db)) {
        return db.upgrade(function() {
          sql.fr.drop(db);
          sql.pa.drop(db);
          sql.da.drop(db);
        });

      } else {
        return new SyncPromise(function(fulfill, reject) {
          reject(ERROR.database_error("ImyDBManager", "dropTables"));
        });
      }
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.dropTablesIfExist = function dropTablesIfExist(db) {
    var that = this;

    return getSQLByDB(db)
    .then(function(sql) {

      return that.checkObject(db, "table", [ sql.fr.name, sql.pa.name, sql.da.name ])
      .then(function(ret) {
        if(isKnex(db)) {
          return db.transaction(function(trx) {
            return SyncPromise.all([
              ret[0] ? sql.fr.drop(trx) : 0,
              ret[1] ? sql.pa.drop(trx) : 0,
              ret[2] ? sql.da.drop(trx) : 0
            ])
            .then(trx.commit)
            .catch(trx.rollback);
          });

        } else if(isSli2(db)) {
          return db.upgrade(function() {
            if(ret[0]) {
              sql.fr.drop(db);
            }
            if(ret[1]) {
              sql.pa.drop(db);
            }
            if(ret[2]) {
              sql.da.drop(db);
            }
          })
            .catch(db.rollback);

        } else {
          return new SyncPromise(function(fulfill, reject) {
            reject(ERROR.database_error("ImyDBManager", "dropTablesIfExist"));
          });
        }
      });
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.createIndices = function createIndices(db) {

    return getSQLByDB(db)
    .then(function(sql) {

      if(isKnex(db)) {
        return db.transaction(function(trx) {
          var target = [],
              i = 0, l = 0;

          for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
            target[target.length] = sql.fr.index[i].create(trx);
          }
          for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
            target[target.length] = sql.pa.index[i].create(trx);
          }
          for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
            target[target.length] = sql.da.index[i].create(trx);
          }

          return SyncPromise.all(target)
          .then(trx.commit)
          .catch(trx.rollback);
        });

      } else if(isSli2(db)) {
        return db.upgrade(function() {
          var i = 0, l = 0;

          for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
            sql.fr.index[i].create(db);
          }
          for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
            sql.pa.index[i].create(db);
          }
          for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
            sql.da.index[i].create(db);
          }
        });

      } else {
        return new SyncPromise(function(fulfill, reject) {
          reject(ERROR.database_error("ImyDBManager", "createIndices"));
        });
      }
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.createIndicesIfNotExist = function createIndicesIfNotExist(db) {
    var that = this;

    return getSQLByDB(db)
    .then(function(sql) {

      var index_names = [],
          indices = {},
          i = 0, l = 0;

      for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.fr.index[i].name;
        indices[sql.fr.index[i].name] = sql.fr.index[i];
      }
      for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.pa.index[i].name;
        indices[sql.pa.index[i].name] = sql.pa.index[i];
      }
      for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.da.index[i].name;
        indices[sql.da.index[i].name] = sql.da.index[i];
      }

      return that.checkObject(db, "index", index_names)
      .then(function(ret) {
        if(isKnex(db)) {
          return db.transaction(function(trx) {
            var target = [];

            for(i = 0, l = ret.length; i < l; i = i + 1) {
              var idx = index_names.indexOf(ret[i].name);

              if(idx !== -1) {
                index_names.splice(idx, 1);
              }
            }
            for(i = 0, l = index_names.length; i < l; i = i + 1) {
              target[target.length] = indices[index_names[i]].create(trx);
            }

            return SyncPromise.all(target)
            .then(trx.commit)
            .catch(trx.rollback);
          });

        } else if(isSli2(db)) {
          return db.upgrade(function() {
            for(i = 0, l = ret.length; i < l; i = i + 1) {
              var idx = index_names.indexOf(ret[i].name);

              if(idx !== -1) {
                index_names.splice(idx, 1);
              }
            }
            for(i = 0, l = index_names.length; i < l; i = i + 1) {
              indices[index_names[i]].create(db);
            }
          })
          .catch(db.rollback);

        } else {
          return new SyncPromise(function(fulfill, reject) {
            reject(ERROR.database_error("ImyDBManager", "createIndicesIfNotExist"));
          });
        }
      });
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.dropIndices = function dropIndices(db) {

    return getSQLByDB(db)
    .then(function(sql) {

      if(isKnex(db)) {
        return db.transaction(function(trx) {
          var target = [],
              i = 0, l = 0;

          for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
            target[target.length] = sql.fr.index[i].drop(trx);
          }
          for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
            target[target.length] = sql.pa.index[i].drop(trx);
          }
          for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
            target[target.length] = sql.da.index[i].drop(trx);
          }

          return SyncPromise.all(target)
          .then(trx.commit)
          .catch(trx.rollback);
        });

      } else if(isSli2(db)) {
        return db.upgrade(function() {
          var i = 0, l = 0;

          for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
            sql.fr.index[i].drop(db);
          }
          for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
            sql.pa.index[i].drop(db);
          }
          for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
            sql.da.index[i].drop(db);
          }
        });

      } else {
        return new SyncPromise(function(fulfill, reject) {
          reject(ERROR.database_error("ImyDBManager", "dropIndices"));
        });
      }
    });

  };

  /**
   * @public
   * @static
   * @function
   * @param {Knex|SLI2} db -
   * @returns {Promise}
   */
  ImyDBManager.dropIndicesIfExist = function dropIndicesIfExist(db) {
    var that = this;

    return getSQLByDB(db)
    .then(function(sql) {

      var index_names = [],
          indices = {},
          i = 0, l = 0;

      for(i = 0, l = sql.fr.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.fr.index[i].name;
        indices[sql.fr.index[i].name] = sql.fr.index[i];
      }
      for(i = 0, l = sql.pa.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.pa.index[i].name;
        indices[sql.pa.index[i].name] = sql.pa.index[i];
      }
      for(i = 0, l = sql.da.index.length; i < l; i = i + 1) {
        index_names[index_names.length] = sql.da.index[i].name;
        indices[sql.da.index[i].name] = sql.da.index[i];
      }

      return that.checkObject(db, "index", index_names)
      .then(function(ret) {
        if(isKnex(db)) {
          return db.transaction(function(trx) {
            var target = [];

            for(i = 0, l = ret.length; i < l; i = i + 1) {
              var name = ret[i].name;

              if(indices[name]) {
                target[target.length] = indices[name].drop(trx);
              }
            }

            return SyncPromise.all(target)
            .then(trx.commit)
            .catch(trx.rollback);
          });

        } else if(isSli2(db)) {
          return db.upgrade(function() {
            for(i = 0, l = ret.length; i < l; i = i + 1) {
              var name = ret[i].name;

              if(indices[name]) {
                indices[name].drop(db);
              }
            }
          })
          .catch(db.rollback);

        } else {
          return new SyncPromise(function(fulfill, reject) {
            reject(ERROR.database_error("ImyDBManager", "dropIndicesIfExist"));
          });
        }
      });
    });

  };

  /**
  * @public
  * @static
  * @function
  * @param {Knex|SLI2} db -
  * @returns {Promise}
  */
  ImyDBManager.initialize = function initialize(db) {
    var that = this;

    return this.createTables(db)
    .then(function() {
      return that.createIndices(db);
    });
  };

  cxt.ImyDBManager = ImyDBManager;

}((0, eval)("this").window || this));
