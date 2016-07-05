/* Imy.js */

(function(cxt, global) {
  "use strict";

  var stringToFragments = require("./lib/stringToFragments.js").stringToFragments,
      ImyDBRdbms = require("./ImyDBRdbms.js").ImyDBRdbms,
      ImyDBIndexedDB = require("./ImyDBIndexedDB.js").ImyDBIndexedDB,
      ERROR = require("./param/Error.js").ERROR,
      SyncPromise = require("./lib/SyncPromise.js").SyncPromise,
      async = require("./lib/asyncLoop").asyncLoop;

  var global_conf = require("./conf/conf.json"),
      db_conf = require("./conf/database.json");

  /**
  * @public
  * @class
  */
  var Imy = function Imy() {
    this.db = null;
    this._lang = global_conf.default_lang || "ja";
    this._driver = global_conf.driver;
    this._dbconf = db_conf[this._driver];
    this._conf = null;
  };
  Imy._name_ = "Imy";

  /**
   * @public
   * @function
   * @returns {void}
   */
  Imy.prototype.initialize = function initialize() {
    var config_error = ERROR.config_error(this.constructor._name_, "initialize"),
        driver_error = ERROR.driver_error;

    if(!this._conf) {
      if(!global_conf[this._lang]) {
        throw config_error("default config is not support lang '" + this._lang + ".");
      }

      this._conf = global_conf[this._lang];
    }
    if(!this._conf.skip) {
      throw config_error("config has no 'skip' parameter for lang '" + this._lang + "'.");

    } else if(!Array.isArray(this._conf.omit)) {
      throw config_error("'omit' parameter (of conf) must be Array.");
    }

    if(this._dbconf) {
      if(this._driver === "mysql" || this._driver === "pg" || this._driver === "sqlite3") {
        this.db = new ImyDBRdbms(this._conf);

      } else if(this._driver === "idb") {
        this.db = new ImyDBIndexedDB(this._conf);

      } else {
        throw driver_error(this._driver);
      }

      this.db.useConfig(this._dbconf);

    } else {
      throw config_error("no database config");
    }

  };

  /**
   * @private
   * @function
   * @returns {Promise}
   */
  Imy.prototype._isInitialize = function _isInitialize() {
    var that = this,
        is_not_initialize = ERROR.is_not_initialize;

    return new SyncPromise(function(fulfill, reject) {
      if(that.db) {
        fulfill();

      } else {
        reject(is_not_initialize("Imy"));
      }
    });
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  Imy.prototype.open = function open() {
    var that = this;

    return this._isInitialize()
    .then(function() {
      return that.db.open();
    });
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  Imy.prototype.close = function close() {
    return this.db.close();
  };

  /**
  * @public
  * @static
  * @function
  * @param {String} sentence -
  * @param {String} search -
  * @returns
  * @description
  */
  //Imy.staticSearch = function staticSearch(sentence, search) {
  //};

  /**
  * @public
  * @function
  * @param {String} lang -
  * @returns {void}
  * @description
  */
  Imy.prototype.useLang = function useLang(lang) {
    this.lang = lang;
  };

  /**
   * @public
   * @function
   * @param {String} driver -
   * @param {Object} conf -
   * @returns {void}
   */
  Imy.prototype.useDatabaseConfig = function useDatabaseConfig(driver, conf) {
    if(driver) {
      this._driver = driver;
    }
    this._dbconf = conf;
  };

  /**
   * @public
   * @function
   * @param {Object} conf -
   * @returns {void}
   */
  Imy.prototype.useConfig = function useConfig(conf) {
    this._conf = conf;
  };

  /**
   * @public
   * @function
   * @returns {Mixed(Knex|SLI2)}
   */
  Imy.prototype.getDatabaseObject = function getDatabaseObject() {
    return this.db.db;
  };

  /**
   * @private
   * @function
   * @param {String} value -
   * @param {Object} conf -
   * @returns {Array}
   * @description
   */
  Imy.prototype._createFragment = function _createFragment(value, conf) {
    var fragments = stringToFragments(value, conf),
        data = [];

    for(var i = 0; i < fragments.length; i += 1) {
      var fragment = fragments[i],
      skip = fragment.skip,
      frags = fragment.frags;

      for(var j = 0; j < frags.length; j += 1) {
        var l = data.length;
        data[l] = {};
        data[l].skip = skip;
        data[l].frag = frags[j][0].frag + frags[j][1].frag;
        data[l].pos1 = frags[j][0].pos;
        data[l].pos2 = frags[j][1].pos;
        data[l].sort_flag = fragment.sort_flags[j];
      }
    }

    return data;
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} content -
  * @returns {Promise}
  * @description
  */
  Imy.prototype.save = function save(type, content) {
    var that = this,
        db = this.db,
        error = null;

    return new SyncPromise(function(fulfill, reject) {
      db.transaction(function() {

        // dataの登録確認
        db.getDataForTypeAndContent(type, content)
        .then(function(ret) {

          if(ret === null || ret.length === 0) {
            var fragments = that._createFragment(content, that._conf);

            // dataの登録がされていない
            db.addDatum(type, content)
            .then(function(data_id) {

              // 各テーブルに登録
              async(fragments, function(f, next) {
                var idx_fr_id = 0;

                // idx_fragmentへの登録を確認
                db.getIndexFragmentIdForTypeAndValue(type, f.frag)
                .then(function(ret2) {
                  if(ret2 == null || ret2.length === 0) {
                    // 未登録
                    // idx_fragmentに登録
                    return db.addIndexFragment(type, f.frag)
                    .then(function(ret3) {
                      idx_fr_id = ret3;
                    });

                  } else {
                    // 登録済み
                    idx_fr_id = ret2;
                  }
                })
                .then(function() {
                  // idx_parameterに登録
                  return db.addIndexParameter(
                    type, idx_fr_id, data_id, f.pos1, f.pos2, f.sort_flag, f.skip
                  );
                })
                .then(next)
                .catch(function(err) {
                  error = err;
                  db.rollback();
                });

              })
              .then(function() {
                db.commit();
              })
              .catch(function(err) {
                error = err;
                db.rollback();
              });
            })
            .catch(function(err) {
              console.error(err);
            });

          } else {
            error = ERROR.data_duplicate(type, content);
            db.rollback();
          }
        });

      })
      .then(fulfill)
      .catch(function(err) {
        reject(err || error);
      });
    });
  };

  /**
  * @public
  * @function
  * @param {Object} old_data -
  *   {String} old_data.type -
  *   {String} old_data.content -
  * @param {Object} new_data -
  *   {String} new_data.type -
  *   {String} new_data.content -
  * @returns {Promise}
  * @description
  */
  Imy.prototype.update = function update(old_data, new_data) {
    var that = this,
        db = this.db,
        error = null;

    return new SyncPromise(function(fulfill, reject) {
      db.transaction(function() {

        // dataの登録確認
        db.getDataForTypeAndContent(old_data.type, old_data.content)
        .then(function(ret) {

          if(ret !== null && ret.length !== 0) {
            // dataが登録されている
            var data_id = ret[0].id,
                old_fragments = that._createFragment(old_data.content, that._conf),
                new_fragments = that._createFragment(new_data.content, that._conf);

            // old_dataの削除
            async(old_fragments, function(f, next) {

              db.countIndexParametersOfFragment(old_data.type, f.frag)
              .then(function(n) {
                // 対象のfragmentがidx_parameterに1つしか存在しない場合
                if(n === 1) {
                  // idx_fragmentから削除
                  return db.removeIndexFragments(old_fragments.type, f.frag);
                }
              })
              .then(next)
              .catch(function(err) {
                error = err;
                db.rollback();
              });

            })
            .then(function() {
              // idx_parameterから削除
              return db.removeIndexParameters(data_id);
            })

            // new_dataの登録
            .then(function() {
              return async(new_fragments, function(f, next) {
                var idx_fr_id = 0;

                // idx_fragmentへの登録を確認
                db.getIndexFragmentIdForTypeAndValue(new_data.type, f.frag)
                .then(function(ret2) {
                  if(ret2 == null || ret2.length === 0) {
                    // 未登録
                    // idx_fragmentに登録
                    return db.addIndexFragment(new_data.type, f.frag)
                    .then(function(ret3) {
                      idx_fr_id = ret3;
                    });

                  } else {
                    // 登録済み
                    idx_fr_id = ret2;
                  }
                })
                .then(function() {
                  // idx_parameterに登録
                  return db.addIndexParameter(
                    new_data.type, idx_fr_id, data_id, f.pos1, f.pos2, f.sort_flag, f.skip
                  );
                })
                .then(next)
                .catch(function(err) {
                  error = err;
                  db.rollback();
                });

              });
            })

            // dataの登録
            .then(function() {
              return db.updateData(
                { type: new_data.type, content: new_data.content },
                { id: data_id }
              );
            })

            .then(function() {
              db.commit();
            })
            .catch(function(err) {
              error = err;
              db.rollback();
            });

          } else {
            // dataが登録されていない
            error = ERROR.not_registry_data(old_data.type, old_data.content);
            db.rollback();
          }
        });

      })
      .then(fulfill)
      .catch(function(err) {
        reject(err || error);
      });
    });
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} content -
  * @returns {Promise}
  * @description
  */
  Imy.prototype.remove = function remove(type, content) {
    var that = this,
        db = this.db,
        error = null;

    return new SyncPromise(function(fulfill, reject) {
      db.transaction(function() {

        // dataの登録確認
        db.getDataForTypeAndContent(type, content)
        .then(function(ret) {

          if(ret !== null && ret.length !== 0) {
            // dataが登録されている
            var data_id = ret[0].id,
                fragments = that._createFragment(content, that._conf);

            // 各テーブル編集
            async(fragments, function(f, next) {

              db.countIndexParametersOfFragment(type, f.frag)
              .then(function(n) {
                // 対象のfragmentがidx_parameterに1つしか存在しない場合
                if(n === 1) {
                  // idx_fragmentから削除
                  return db.removeIndexFragments(type, f.frag);
                }
              })
              .then(next)
              .catch(function(err) {
                error = err;
                db.rollback();
              });

            })
            .then(function() {
              // idx_parameterから削除
              return db.removeIndexParameters(data_id);
            })
            .then(function() {
              // dataから削除
              return db.removeData(data_id);
            })
            .then(function() {
              db.commit();
            })
            .catch(function(err) {
              error = err;
              db.rollback();
            });

          } else {
            // dataが登録されていない
            error = ERROR.not_registry_data(type, content);
            db.rollback();
          }
        });

      })
      .then(fulfill)
      .catch(function(err) {
        reject(err || error);
      });

    });
  };

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} value -
  * @returns {Promise}
  * @description
  */
  Imy.prototype.search = function search(type, value) {
    var that = this,
        db = this.db;

    return new SyncPromise(function(fulfill, reject) {
      var ret = [];

      db.search(type, value, that._conf)
      .then(function(searched) {

        async(searched, function(item, next) {
          db.getDatumForId(item.id)
          .then(function(data) {

            ret[ret.length] = {
              data_id: item.id,
              start_pos: item.start_pos,
              end_pos: item.end_pos,
              weight: item.weight,
              sort_num: item.sort_num,
              type: data[0].type,
              content: data[0].content,
              created_at: data[0].created_at,
              updated_at: data[0].updated_at
            };

            next();
          })
          .catch(reject);
        })
        .then(function() {
          fulfill(ret);
        })
        .catch(reject);
      })
      .catch(function(err) {
        console.log(err);
      });
    });
  };

  /**
   * @public
   * @function
   * @returns {Promise}
   */
  Imy.prototype.truncate = function truncate() {
    var db = this.db;

    return new SyncPromise(function(fulfill, reject) {
      db.truncateIndexFragments()
      .then(function() {
        return db.truncateIndexParameters();
      })
      .then(function() {
        return db.truncateData();
      })
      .then(fulfill)
      .catch(reject);
    });
  };

  cxt.Imy = Imy;
  global.Imy = Imy;

}(this, (0, eval)("this")));
