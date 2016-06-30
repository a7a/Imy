var ImyDBRdbms = require("../dist/js/node/ImyDBRdbms.js").ImyDBRdbms;
var ImyDBManager = require("../dist/js/node/ImyDBManager.js").ImyDBManager;
var rdbms = null;

describe('test - ImyManager.pg', function() {

  it("001 - ImyManager.pg - create and drop", function(done) {
    rdbms = new ImyDBRdbms(null);
    rdbms.useConfig({
      "client": "pg",
      "connection": {
        "host": "192.168.33.10",
        "user": "root",
        "password": "",
        "database": "testdb"
      },
      "searchPath": "public"
    });
    rdbms.debug = true;
    rdbms.setDebugger(function(args) {
      console.log("QUERY: " + args.query.toString());
    });

    ImyDBManager.createTables(rdbms.db)
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_idx_fragments";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret[0].name).toEqual(table_name, "created " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "create table imy_idx_fragments");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_idx_parameters";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret[0].name).toEqual(table_name, "created " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "create table imy_idx_parameters");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_data";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret[0].name).toEqual(table_name, "created " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "create table imy_data");

          fulfill();
        });
      });
    })

    .then(function() {
      return ImyDBManager.createIndices(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_name = "imy_idx_parameter_idx1";

        ImyDBManager.checkObject(rdbms.db, "index", index_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret[0].name).toEqual(index_name, "created " + index_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "create index imy_idx_parameter_idx1");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_name = "imy_data_idx1";

        ImyDBManager.checkObject(rdbms.db, "index", index_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret[0].name).toEqual(index_name, "created " + index_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "create index imy_data_idx1");

          fulfill();
        });
      });
    })
//    .then(function() {
//      return new Promise(function(fulfill, reject) {
//        var index_name = "imy_data_idx2";
//
//        ImyDBManager.checkObject(rdbms.db, "index", index_name)
//        .then(function(ret) {
//          console.log(ret);
//
//          expect(ret[0].name).toEqual(index_name, "created " + index_name);
//
//          fulfill();
//        })
//        .catch(function(err) {
//          console.error(err);
//
//          expect(1).toEqual(0, "create index imy_data_idx2");
//
//          fulfill();
//        });
//      });
//    })

    .then(function() {
      return ImyDBManager.dropIndices(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_name = "imy_idx_parameter_idx1";

        ImyDBManager.checkObject(rdbms.db, "index", index_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret.length).toEqual(0, "droped " + index_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "drop imy_idx_parameter_idx1");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var index_name = "imy_data_idx1";

        ImyDBManager.checkObject(rdbms.db, "index", index_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret.length).toEqual(0, "droped " + index_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "drop imy_data_idx1");

          fulfill();
        });
      });
    })
//    .then(function() {
//      return new Promise(function(fulfill, reject) {
//        var index_name = "imy_data_idx2";
//
//        ImyDBManager.checkObject(rdbms.db, "index", index_name)
//        .then(function(ret) {
//          console.log(ret);
//
//          expect(ret.length).toEqual(0, "droped " + index_name);
//
//          fulfill();
//        })
//        .catch(function(err) {
//          console.error(err);
//
//          expect(1).toEqual(0);
//
//          fulfill();
//        });
//      });
//    })

    .then(function() {
      return ImyDBManager.dropTables(rdbms.db);
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_idx_fragments";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret.length).toEqual(0, "droped " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "drop imy_idx_fragments");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_idx_parameters";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret.length).toEqual(0, "droped " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "drop imy_idx_parameters");

          fulfill();
        });
      });
    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        var table_name = "imy_data";

        ImyDBManager.checkObject(rdbms.db, "table", table_name)
        .then(function(ret) {
          console.log(ret);

          expect(ret.length).toEqual(0, "droped " + table_name);

          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          expect(1).toEqual(0, "drop imy_data");

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
