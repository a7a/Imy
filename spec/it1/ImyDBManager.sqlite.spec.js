var ImyDBRdbms = require("../dist/js/node/ImyDBRdbms.js").ImyDBRdbms;
var ImyDBManager = require("../dist/js/node/ImyDBManager.js").ImyDBManager;
var rdbms = null;

describe('test - ImyManager.sqlite', function() {

  it("001 - ImyManager.sqlite - create and drop", function(done) {
    rdbms = new ImyDBRdbms(null);
    rdbms.useConfig({
      "client": "sqlite3",
      "connection": {
        "filename": ":memory:"
      },
      "useNullAsDefault": true
    });
    rdbms.debug = true;
    rdbms.setDebugger(function(args) {
      console.log("QUERY: " + args.query.toString());
    });

    ImyDBManager.createTables(rdbms.db)
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.checkObject(rdbms.db, "table", table_names)
        .then(function(ret) {
          var exist_tables = [];

          for(var i = 0, l = ret.length; i < l; i = i + 1) {
            exist_tables[exist_tables.length] = ret[i].name;
          }
          for(var i = 0, l = table_names.length; i < l; i = i + 1) {
            expect(!!~exist_tables.indexOf(table_names[i])).toEqual(true, "create table " + table_names[i]);
          }

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expext(0).toEqual(1, "create table NG");

          fulfill();
        });
      });
    })

    .then(function() {
      return ImyDBManager.createIndices(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"/*, "imy_data_idx2*/];

        ImyDBManager.checkObject(rdbms.db, "index", index_names)
        .then(function(ret) {
          var exist_indices = [];

          for(var i = 0, l = ret.length; i < l; i = i + 1) {
            exist_indices[exist_indices.length] = ret[i].name;
          }
          for(var i = 0, l = index_names.length; i < l; i = i + 1) {
            expect(!!~exist_indices.indexOf(index_names[i])).toEqual(true, "create index " + index_names[i]);
          }

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(0).toEqual(1, "create index NG");

          fulfill();
        });
      });
    })

    .then(function() {
      return ImyDBManager.dropIndices(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"/*, "imy_data_idx2*/];

        ImyDBManager.checkObject(rdbms.db, "index", index_names)
        .then(function(ret) {
          expect(ret.length).toEqual(0, "drop index");

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(0).toEqual(1, "drop index NG");

          fulfill();
        });
      });
    })

    .then(function() {
      return ImyDBManager.dropTables(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.checkObject(rdbms.db, "table", table_names)
        .then(function(ret) {
          expect(ret.length).toEqual(0, "drop index");

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(0).toEqual(1, "drop table NG");

          fulfill();
        });
      });
    })

    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.createTablesIfNotExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "table", table_names)
          .then(function(rows) {
            var compared = false,
                test_result = true;

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              compared = true;

              if(!~table_names.indexOf(rows[i].name)) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "createTablesIfNotExist OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "createTablesIfNotExist NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "createTablesIfNotExist NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.createTablesIfNotExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "table", table_names)
          .then(function(rows) {
            var compared = false,
                test_result = true;

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              compared = true;

              if(!~table_names.indexOf(rows[i].name)) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "createTablesIfNotExist - 2 OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "createTablesIfNotExist - 2 NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "createTablesIfNotExist - 2 NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"];

        ImyDBManager.createIndicesIfNotExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "index", index_names)
          .then(function(rows) {
            var compared = false,
                test_result = true;

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              compared = true;

              if(!~index_names.indexOf(rows[i].name)) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "createIndicesIfNotExist OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "createIndicesIfNotExist NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "createIndicesIfNotExist NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"];

        ImyDBManager.createIndicesIfNotExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "index", index_names)
          .then(function(rows) {
            var compared = false,
                test_result = true;

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              compared = true;

              if(!~index_names.indexOf(rows[i].name)) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "createIndicesIfNotExist - 2 OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "createIndicesIfNotExist - 2 NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "createIndicesIfNotExist - 2 NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"];

        ImyDBManager.dropIndicesIfExist(rdbms.db)
          .then(function() {
          ImyDBManager.checkObject(rdbms.db, "index", index_names)
            .then(function(rows) {
            expect(rows.length).toEqual(0, "dropIndicesIfExist OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "dropIndicesIfExist NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "dropIndicesIfExist NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_names = ["imy_idx_parameter_idx1", "imy_data_idx1"];

        ImyDBManager.dropIndicesIfExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "index", index_names)
          .then(function(rows) {
            expect(rows.length).toEqual(0, "dropIndicesIfExist - 2 OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "dropIndicesIfExist - 2 NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "dropIndicesIfExist - 2 NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.dropTablesIfExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "table", table_names)
          .then(function(rows) {
            expect(rows.length).toEqual(0, "dropTablesIfExist OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "dropTablesIfExist NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "dropTablesIfExist NG");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_names = ["imy_idx_fragments", "imy_idx_parameters", "imy_data"];

        ImyDBManager.dropTablesIfExist(rdbms.db)
        .then(function() {
          ImyDBManager.checkObject(rdbms.db, "table", table_names)
          .then(function(rows) {
            expect(rows.length).toEqual(0, "dropTablesIfExist OK");

            fulfill();
          })
          .catch(function(err) {
            console.error(err);

            expect(1).toEqual(0, "dropTablesIfExist NG");

            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "dropTablesIfExist NG");

          fulfill();
        });
      });
    })

    .then(done);
  });
});
