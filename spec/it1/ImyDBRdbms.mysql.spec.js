var ImyDBRdbms = require("../dist/js/node/ImyDBRdbms.js").ImyDBRdbms;
var ImyDBManager = require("../dist/js/node/ImyDBManager.js").ImyDBManager;
var fs = require('fs');
var rdbms = null;

describe('test - ImyDBRdbms.mysql', function() {

  it("001 - ImyDBRdbms.mysql", function(done) {
    rdbms = new ImyDBRdbms(null);
    rdbms.useConfig({
      "client": "mysql",
      "connection": {
        "host": "192.168.33.10",
        "user": "root",
        "password": "",
        "database": "testdb"
      }
    });
    rdbms.debug = true;
    rdbms.setDebugger(function(args) {
      console.log("QUERY: " + args.query.toString());
    });

    ImyDBManager.dropTablesIfExist(rdbms.db)
    .then(function() {
      return new Promise(function(fulfill, reject) {
        ImyDBManager.createTablesIfNotExist(rdbms.db)
        .then(function() {

          ImyDBManager.checkObject(rdbms.db)
          .then(function(ret) {
            console.log(ret);
          })
          .then(function() {
            fulfill();
          });
        })
        .catch(function(err) {
          console.error(err);

          reject();
        });
      });
    })

    .then(function() {
      return new Promise(function(fulfill, reject) {
        var test_data = [
          { type: "type_aaa", value: "10" },
          { type: "type_aaa", value: "11" },
          { type: "type_aaa", value: "12" }
        ];

        rdbms.addIndexFragment(test_data[0].type, test_data[0].value)
        .then(function(ret) {
          console.log("addIndexFragment OK");
          console.log(ret);
        })
        .then(function() {
          return rdbms.addIndexFragment(test_data[1].type, test_data[1].value)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addIndexFragment(test_data[2].type, test_data[2].value)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getIndexFragmentIdForTypeAndValue(test_data[1].type, test_data[1].value)
          .then(function(id) {
            console.log("getIndexFragmentIdForTypeAndValue OK");
            console.log(id);

            expect(id).toEqual(2, "getIndexFragmentIdForTypeAndValue OK");
          })
        })
        .then(function() {
          return rdbms.removeIndexFragments(test_data[1].type, test_data[1].value)
          .then(function(ret) {
            console.log("removeIndexFragment OK");
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getAllIndexFragments()
          .then(function(rows) {
            var compared = false,
                test_result = true;

            console.log("getAllIndexFragments OK");
            console.log(rows);

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              var row = rows[i],
                  test_datum = test_data[row.id - 1];

              compared = true;

              if(row.type !== test_datum.type || row.value !== test_datum.value) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "getAllIndexFragments OK");

          });
        })

        .then(function() {
          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          reject();
        });
      });
    })

    .then(function() {
      return new Promise(function(fulfill, reject) {
        var test_data = [
          { type: 'type_aaa', idx_fragment_id: 1, data_id: 1, content_pos1: 1, content_pos2: 2, sort_flag: 0, skip: 1 },
          { type: 'type_aaa', idx_fragment_id: 2, data_id: 2, content_pos1: 2, content_pos2: 3, sort_flag: 0, skip: 2 },
          { type: 'type_aaa', idx_fragment_id: 3, data_id: 3, content_pos1: 3, content_pos2: 4, sort_flag: 0, skip: 3 }
        ];

        rdbms.addIndexParameter(
          test_data[0].type, test_data[0].idx_fragment_id, test_data[0].data_id,
          test_data[0].content_pos1, test_data[0].content_pos2, test_data[0].sort_flag, test_data[0].skip
        )
        .then(function(ret) {
          console.log("addIndexParameter OK");
          console.log(ret);
        })
        .then(function() {
          return rdbms.addIndexParameter(
            test_data[1].type, test_data[1].idx_fragment_id, test_data[1].data_id,
            test_data[1].content_pos1, test_data[1].content_pos2, test_data[1].sort_flag, test_data[1].skip
          )
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addIndexParameter(
            test_data[2].type, test_data[2].idx_fragment_id, test_data[2].data_id,
            test_data[2].content_pos1, test_data[2].content_pos2, test_data[2].sort_flag, test_data[2].skip
          )
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getAllIndexParameters()
          .then(function(rows) {
            var compared = false,
                test_result = true;

            console.log("getAllIndexParameters OK");
            console.log(rows);

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              var row = rows[i],
                  test_datum = test_data[i];

              compared = true;

              if(row.type !== test_datum.type || row.idx_fragment_id !== test_datum.idx_fragment_id
                || row.data_id !== test_datum.data_id || row.content_pos1 !== test_datum.content_pos1
                || row.content_pos2 !== test_datum.content_pos2 || row.skip !== test_datum.skip
              ) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "getAllIndexParameters OK");

          });
        })
        .then(function() {
          return rdbms.removeIndexParameters(
            test_data[1].data_id
          )
          .then(function(ret) {
            console.log("removeIndexParameters OK");
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getAllIndexParameters()
          .then(function(rows) {
            var compared = false,
                test_result = true,
                _test_data = [];

            _test_data.push(test_data[0]);
            _test_data.push(test_data[2]);

            console.log("getAllIndexParameters OK");
            console.log(rows);

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              var row = rows[i],
                  test_datum = _test_data[i];

              compared = true;

              if(row.type !== test_datum.type || row.idx_fragment_id !== test_datum.idx_fragment_id
                || row.data_id !== test_datum.data_id || row.content_pos1 !== test_datum.content_pos1
                || row.content_pos2 !== test_datum.content_pos2 || row.skip !== test_datum.skip
              ) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "getAllIndexParameters OK");

          });
        })
        .then(function() {
          return rdbms.countIndexParametersOfFragment(test_data[0].type, "10")
          .then(function(cnt) {
            console.log(cnt);

            expect(cnt).toEqual(1, "countIndexParametersOfFragment OK");
          });
        })

        .then(function() {
          fulfill();
        })
        .catch(function(err) {
          console.log(err);

          reject();
        });
      });
    })

    .then(function() {
      return new Promise(function(fulfill, reject) {
        var test_data = [
          { type: "type_aaa", content: "abcdefg" },
          { type: "type_aaa", content: "aaaabbb" },
          { type: "type_aaa", content: "qqwweerr" },
          { type: "type_aaa", content: "ttyuuuioo" },
          { type: "type_aaa", content: "zxcc" },
          { type: "type_aaa", content: "fffgggghh" },
        ];

        rdbms.addDatum(test_data[0].type, test_data[0].content)
        .then(function(ret) {
          console.log("addDatum OK");
          console.log(ret);
        })
        .then(function() {
          return rdbms.addDatum(test_data[1].type, test_data[1].content)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addDatum(test_data[2].type, test_data[2].content)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addDatum(test_data[3].type, test_data[3].content)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addDatum(test_data[4].type, test_data[4].content)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.addDatum(test_data[5].type, test_data[5].content)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getAllData()
          .then(function(rows) {
            var compared = false,
                test_result = true,
                _test_data = [];

            console.log("getAllData OK")
            console.log(rows);

            for(var i = 0, l = rows.length; i < l; i = i + 1) {
              var row = rows[i],
                  test_datum = test_data[row.id - 1];

              compared = true;

              if(row.type !== test_datum.type || row.content !== test_datum.content
                || row.no !== test_datum.no || row.page !== test_datum.page
              ) {
                test_result = false;
                break;
              }
            }

            expect(compared && test_result).toEqual(true, "getAllData OK");

          });
        })
        .then(function() {
          return rdbms.removeData(test_data.indexOf(test_data[1]) + 1)
          .then(function(ret) {
            console.log("removeData OK");
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.removeData(test_data.indexOf(test_data[3]) + 1)
          .then(function(ret) {
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.updateData(
            { type: "type_bbb", content: "update_abc" },
            { id: test_data.indexOf(test_data[0]) + 1 }
          )
          .then(function(ret) {
            console.log("updateData OK");
            console.log(ret);
          });
        })
        .then(function() {
          return rdbms.getDataForTypeAndContent(test_data[0].type, test_data[0].content)
          .then(function(rows) {
            console.log("getDataForTypeAndContent OK");
            console.log(rows);

            expect(rows.length).toEqual(0, "getDataForTypeAndContent OK");
          });
        })
        .then(function() {
          //return rdbms.getDataForNoAndPage(test_data[1].no, test_data[1].page)
          return rdbms.getDatumForId(test_data.indexOf(test_data[1]) + 1)
          .then(function(rows) {
            console.log("getDatumForId OK");
            console.log(rows);

            expect(rows.length).toEqual(0, "getDatumForId OK - 1");
          });
        })
        .then(function() {
          //return rdbms.getDataForNoAndPage(test_data[3].no, test_data[3].page)
          return rdbms.getDatumForId(test_data.indexOf(test_data[3]) + 1)
          .then(function(rows) {
            console.log(rows);

            expect(rows.length).toEqual(0, "getDatumForId OK - 2");
          });
        })
        .then(function() {
          //return rdbms.getDataForNoAndPage(test_data[2].no, test_data[2].page)
          return rdbms.getDatumForId(test_data.indexOf(test_data[2]) + 1)
          .then(function(rows) {
            console.log(rows);

            var row = rows[0],
                test_datum = test_data[2],
                test_result = true;

            if(!row || row.type !== test_data[2].type || row.content !== test_datum.content
               || row.no !== test_datum.no || row.page !== test_datum.page
            ) {
              test_result = false;
            }

            expect(test_result).toEqual(true, "getDatumForId OK - 3");

          });
        })
        .then(function() {
          return rdbms.truncateIndexFragments()
          .then(function(ret) {
            console.log(ret);

            return rdbms.getAllIndexFragments()
            .then(function(rows) {
              expect(rows.length).toEqual(0, "truncateIndexFragments OK");
            });
          });
        })
        .then(function() {
          return rdbms.truncateIndexParameters()
          .then(function(ret) {
            console.log(ret);

            return rdbms.getAllIndexParameters()
            .then(function(rows) {
              expect(rows.length).toEqual(0, "truncateIndexParameters OK");
            });
          });
        })
        .then(function() {
          return rdbms.truncateData()
          .then(function(rows) {
            console.log(rows);

            return rdbms.getAllData()
            .then(function(rows) {
              expect(rows.length).toEqual(0, "truncateData OK");
            });
          });
        })

        .then(function() {
          fulfill();
        })
        .catch(function(err) {
          console.error(err);

          reject();
        });
      });
    })

    .then(function() {
      rdbms.close();

      done();
    })
    .catch(function() {
      rdbms.close();

      done();
    });

  });
});
