var Imy = require("../dist/js/node/Imy.js").Imy;
var ImyDBManager = require("../dist/js/node/ImyDBManager.js").ImyDBManager;
var imy = null;

var sort_func = function(a,b) {
  if(a.weight < b.weight) { return 1; }
  else if(a.weight > b.weight) { return -1; }
  else if(a.sort_num > b.sort_num) { return 1; }
  else if(a.sort_num < b.sort_num) { return -1; }
  else if(a.data_id > b.data_id) { return 1; }
  else if(a.data_id < b.data_id) { return -1; }
  else { return 0; }
};

describe('test - Imy.mysql', function() {

  var viewAllData = function() {
    var ret1 = [],
        ret2 = [],
        ret3 = [];

    return imy.db.getAllIndexFragments()
      .then(function(ret) {
      console.log("imy_idx_fragment");
      console.log(ret);
      ret1 = ret;
    })
      .then(function() {
      return imy.db.getAllIndexParameters()
        .then(function(ret) {
        console.log("imy_idx_parameter");
        console.log(ret);
        ret2 = ret;
      });
    })
      .then(function() {
      return imy.db.getAllData()
        .then(function(ret) {
        console.log("imy_data");
        console.log(ret);
        ret3 = ret;
      });
    })
      .then(function() {
      return [ret1, ret2, ret3];
    });
  };

  var matchProp = function matchProp(obj, prop) {
    for(var key in prop) {
      if(obj[key] !== prop[key]) {
        return false;
      }
    }

    return true;
  };

  it("001 - Imy.mysql", function(done) {
    imy = new Imy();
    imy.useLang("ja");
    imy.useDatabaseConfig("mysql", {
      "client": "mysql",
      "connection": {
        "host": "192.168.33.10",
        "user": "root",
        "password": "",
        "database": "testdb"
      }
    });
    imy.initialize();
//    imy.db.debug = true;
//    imy.db.setDebugger(function(args) {
//      console.log(args.query.toString());
//    });

    var test_data1 = [
      /*  1 */ { type: "aaa", content: "abxde" },
      /*  2 */ { type: "aaa", content: "axcye" },
      /*  3 */ { type: "aaa", content: "abcye" },
      /*  4 */ { type: "aaa", content: "abcde" }
    ];
    var search_data1 = { type: "aaa", content: "abcde" };
    var update_data1 = { type: "aaa", content: "ayycde" };


    ImyDBManager.dropTablesIfExist(imy.getDatabaseObject())
    .then(function() {
      return ImyDBManager.initialize(imy.getDatabaseObject())
      .then(function() {
        return imy.save(test_data1[0].type, test_data1[0].content)
        .then(function(ret) {
          return viewAllData()
          .then(function(ret2) {
            expect(ret2[0].length).not.toEqual(0, "save result check 1");
            expect(ret2[1].length).not.toEqual(0, "save result check 2");
            expect(ret2[2].length).not.toEqual(0, "save result check 3");
          });

        })
        .catch(function(err) {
          console.log(err);
        });
      });
    })

    .then(function() {
      return imy.save(test_data1[1].type, test_data1[1].content)
      .then(function() { return imy.save(test_data1[2].type, test_data1[2].content); })
      .then(function() { return imy.save(test_data1[3].type, test_data1[3].content); });
    })

    .then(function() {
      return imy.search(search_data1.type, search_data1.content)
      .then(function(res) {
        console.log("#########");

        res = res.sort(sort_func);
//        console.log(res);

        expect(res.length).toEqual(8, "search result length check");
        // data_id=4 is diff 0
        // data_id=1 is diff 1
        // data_id=3 is diff 2
        // data_id=2 is diff 2
        expect(
          matchProp(res[0], { data_id: 4, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 1");
        expect(
          matchProp(res[1], { data_id: 1, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 2");
        expect(
          matchProp(res[2], { data_id: 3, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 3");
        expect(
          matchProp(res[3], { data_id: 4, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "search result check 4");
        expect(
          matchProp(res[4], { data_id: 1, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "search result check 5");
        expect(
          matchProp(res[5], { data_id: 2, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 6");
        expect(
          matchProp(res[6], { data_id: 3, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "search result check 7");
        expect(
          matchProp(res[7], { data_id: 4, start_pos: 2, end_pos: 4 })
        ).toEqual(true, "search result check 8");

        console.log("#########");
      });
    })

    .then(function() {
      return imy.update(test_data1[0], update_data1);
    })
    .then(function() {
      return imy.search(search_data1.type, search_data1.content)
      .then(function(res) {
        console.log("#########");

        res = res.sort(sort_func);
//        console.log(res);

        expect(res.length).toEqual(8, "update result length check");
        expect(
          matchProp(res[0], { data_id: 4, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "update result check 1");
        expect(
          matchProp(res[1], { data_id: 3, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "update result check 2");
        expect(
          matchProp(res[2], { data_id: 4, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "update result check 3");
        expect(
          matchProp(res[3], { data_id: 1, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "update result check 4");
        expect(
          matchProp(res[4], { data_id: 1, start_pos: 3, end_pos: 5 })
        ).toEqual(true, "update result check 5");
        expect(
          matchProp(res[5], { data_id: 2, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "update result check 6");
        expect(
          matchProp(res[6], { data_id: 3, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "update result check 7");
        expect(
          matchProp(res[7], { data_id: 4, start_pos: 2, end_pos: 4 })
        ).toEqual(true, "update result check 8");

        console.log("#########");
      });
    })

    .then(function() {
      return imy.remove(test_data1[2].type, test_data1[2].content);
    })
    .then(function() {
      return imy.search(search_data1.type, search_data1.content)
      .then(function(res) {
        console.log("#########");

        res = res.sort(sort_func);
//        console.log(res);

        expect(res.length).toEqual(6, "remove result length check");
        expect(
          matchProp(res[0], { data_id: 4 })
        ).toEqual(true, "remove result check 1");
        expect(
          matchProp(res[1], { data_id: 4, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "remove result check 2");
        expect(
          matchProp(res[2], { data_id: 1, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "remove result check 3");
        expect(
          matchProp(res[3], { data_id: 1, start_pos: 3, end_pos: 5 })
        ).toEqual(true, "remove result check 4");
        expect(
          matchProp(res[4], { data_id: 2, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "remove result check 5");
        expect(
          matchProp(res[5], { data_id: 4, start_pos: 2, end_pos: 4 })
        ).toEqual(true, "remove result check 6");

        console.log("#########");
      });
    })

    .then(function() {
      return imy.truncate();
    })
    .then(function() {
      return viewAllData()
      .then(function(ret) {
        expect(ret[0].length).toEqual(0, "truncate result check 1");
        expect(ret[1].length).toEqual(0, "truncate result check 2");
        expect(ret[2].length).toEqual(0, "truncate result check 3");
      });
    })

    .then(function() {
      var test_data2 = [
        /*  5 */ { type: "aaa", content: "ababcde" },
        /*  6 */ { type: "aaa", content: "abab" },
        /*  7 */ { type: "aaa", content: "abcde" },
        /*  8 */ { type: "aaa", content: "xyzababcde" },
        /*  9 */ { type: "aaa", content: "ababcdexyz" },
        /* 10 */ { type: "aaa", content: "abxyzabcde" },
        /* 11 */ { type: "aaa", content: "abaxyzbcde" },
        /* 12 */ { type: "aaa", content: "babcde" },
        /* 13 */ { type: "aaa", content: "ababcd" }
      ];

      return imy.save(test_data2[0].type, test_data2[0].content)
        .then(function() { return imy.save(test_data2[1].type, test_data2[1].content); })
        .then(function() { return imy.save(test_data2[2].type, test_data2[2].content); })
        .then(function() { return imy.save(test_data2[3].type, test_data2[3].content); })
        .then(function() { return imy.save(test_data2[4].type, test_data2[4].content); })
        .then(function() { return imy.save(test_data2[5].type, test_data2[5].content); })
        .then(function() { return imy.save(test_data2[6].type, test_data2[6].content); })
        .then(function() { return imy.save(test_data2[7].type, test_data2[7].content); })
        .then(function() { return imy.save(test_data2[8].type, test_data2[8].content); });
    })
    .then(function() {
      var search_data2 = { type: "aaa", content: "ababcde" };

      return imy.search(search_data2.type, search_data2.content)
      .then(function(res) {
        console.log("#########");

        res = res.sort(sort_func);
//        console.log(res);

        expect(res.length).toEqual(20, "search result length check");

//        // weight= 1
//        expect(
//          matchProp(res[0], { data_id: 5, start_pos: 0, end_pos: 6 })
//        ).toEqual(true, "search result check 1");
//        expect(
//          matchProp(res[1], { data_id: 8, start_pos: 3, end_pos: 9 })
//        ).toEqual(true, "search result check 2");
//        expect(
//          matchProp(res[2], { data_id: 9, start_pos: 0, end_pos: 6 })
//        ).toEqual(true, "search result check 3");
//
//        // weight= 0.75
//        expect(
//          matchProp(res[3], { data_id: 5, start_pos: 1, end_pos: 6 })
//        ).toEqual(true, "search result check 4");
//        expect(
//          matchProp(res[4], { data_id: 8, start_pos: 4, end_pos: 9 })
//        ).toEqual(true, "search result check 5");
//        expect(
//          matchProp(res[5], { data_id: 9, start_pos: 1, end_pos: 6 })
//        ).toEqual(true, "search result check 6");
//        expect(
//          matchProp(res[6], { data_id: 12, start_pos: 0, end_pos: 5 })
//        ).toEqual(true, "search result check 7");
//        expect(
//          matchProp(res[7], { data_id: 13, start_pos: 0, end_pos: 5 })
//        ).toEqual(true, "search result check 8");
//
//        // weight= 0.5
//        expect(
//          matchProp(res[8], { data_id: 5, start_pos: 2, end_pos: 6 })
//        ).toEqual(true, "search result check 9");
//        expect(
//          matchProp(res[9], { data_id: 7, start_pos: 0, end_pos: 4 })
//        ).toEqual(true, "search result check 10");
//        expect(
//          matchProp(res[10], { data_id: 8, start_pos: 5, end_pos: 9 })
//        ).toEqual(true, "search result check 11");
//        expect(
//          matchProp(res[11], { data_id: 9, start_pos: 2, end_pos: 6 })
//        ).toEqual(true, "search result check 12");
//        expect(
//          matchProp(res[12], { data_id: 10, start_pos: 5, end_pos: 9 })
//        ).toEqual(true, "search result check 13");
//        expect(
//          matchProp(res[13], { data_id: 12, start_pos: 1, end_pos: 5 })
//        ).toEqual(true, "search result check 14");
//        expect(
//          matchProp(res[14], { data_id: 13, start_pos: 1, end_pos: 5 })
//        ).toEqual(true, "search result check 15");
//
//        // other
//        expect(
//          matchProp(res[15], { data_id: 10, start_pos: 0, end_pos: 9 })
//        ).toEqual(true, "search result check 16");
//        expect(
//          matchProp(res[16], { data_id: 10, start_pos: 1, end_pos: 9 })
//        ).toEqual(true, "search result check 17");
//        expect(
//          matchProp(res[17], { data_id: 11, start_pos: 0, end_pos: 9 })
//        ).toEqual(true, "search result check 18");
//        expect(
//          matchProp(res[18], { data_id: 11, start_pos: 1, end_pos: 9 })
//        ).toEqual(true, "search result check 19");
//        expect(
//          matchProp(res[19], { data_id: 11, start_pos: 2, end_pos: 9 })
//        ).toEqual(true, "search result check 20");


        ///*  5 */ { type: "aaa", content: "ababcde" },
        expect(
          matchProp(res[0], { data_id: 5, start_pos: 0, end_pos: 6 })
        ).toEqual(true, "search result check 1");
        expect(
          matchProp(res[3], { data_id: 5, start_pos: 1, end_pos: 6 })
        ).toEqual(true, "search result check 4");
        expect(
          matchProp(res[8], { data_id: 5, start_pos: 2, end_pos: 6 })
        ).toEqual(true, "search result check 9");

        ///*  8 */ { type: "aaa", content: "xyzababcde" },
        expect(
          matchProp(res[1], { data_id: 8, start_pos: 3, end_pos: 9 })
        ).toEqual(true, "search result check 2");
        expect(
          matchProp(res[4], { data_id: 8, start_pos: 4, end_pos: 9 })
        ).toEqual(true, "search result check 5");
        expect(
          matchProp(res[10], { data_id: 8, start_pos: 5, end_pos: 9 })
        ).toEqual(true, "search result check 11");

        ///*  9 */ { type: "aaa", content: "ababcdexyz" },
        expect(
          matchProp(res[2], { data_id: 9, start_pos: 0, end_pos: 6 })
        ).toEqual(true, "search result check 3");
        expect(
          matchProp(res[5], { data_id: 9, start_pos: 1, end_pos: 6 })
        ).toEqual(true, "search result check 6");
        expect(
          matchProp(res[11], { data_id: 9, start_pos: 2, end_pos: 6 })
        ).toEqual(true, "search result check 12");

        ///* 12 */ { type: "aaa", content: "babcde" },
        expect(
          matchProp(res[6], { data_id: 12, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "search result check 7");
        expect(
          matchProp(res[13], { data_id: 12, start_pos: 1, end_pos: 5 })
        ).toEqual(true, "search result check 14");

        ///* 13 */ { type: "aaa", content: "ababcd" }
        expect(
          matchProp(res[7], { data_id: 13, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "search result check 8");
        expect(
          matchProp(res[14], { data_id: 13, start_pos: 1, end_pos: 5 })
        ).toEqual(true, "search result check 15");

        ///*  7 */ { type: "aaa", content: "abcde" },
        expect(
          matchProp(res[9], { data_id: 7, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 10");

        ///* 10 */ { type: "aaa", content: "abxyzabcde" },
        expect(
          matchProp(res[12], { data_id: 10, start_pos: 5, end_pos: 9 })
        ).toEqual(true, "search result check 13");
        expect(
          matchProp(res[15], { data_id: 10, start_pos: 0, end_pos: 9 })
        ).toEqual(true, "search result check 16");
        expect(
          matchProp(res[16], { data_id: 10, start_pos: 1, end_pos: 9 })
        ).toEqual(true, "search result check 17");

        ///* 11 */ { type: "aaa", content: "abaxyzbcde" },
        expect(
          matchProp(res[17], { data_id: 11, start_pos: 0, end_pos: 9 })
        ).toEqual(true, "search result check 18");
        expect(
          matchProp(res[18], { data_id: 11, start_pos: 1, end_pos: 9 })
        ).toEqual(true, "search result check 19");
        expect(
          matchProp(res[19], { data_id: 11, start_pos: 2, end_pos: 9 })
        ).toEqual(true, "search result check 20");

        console.log("#########");
      });
    })

    .then(function() {
      var search_data3 = { type: "aaa", content: "abcde" };

      return imy.search(search_data3.type, search_data3.content)
      .then(function(res) {
        console.log("#########");

        res = res.sort(sort_func);
//        console.log(res);

//        // weight= 1
//        expect(
//          matchProp(res[0], { data_id: 5, start_pos: 2, end_pos: 6 })
//        ).toEqual(true, "search result check 1");
//        expect(
//          matchProp(res[1], { data_id: 7, start_pos: 0, end_pos: 4 })
//        ).toEqual(true, "search result check 2");
//        expect(
//          matchProp(res[2], { data_id: 8, start_pos: 5, end_pos: 9 })
//        ).toEqual(true, "search result check 3");
//        expect(
//          matchProp(res[3], { data_id: 9, start_pos: 2, end_pos: 6 })
//        ).toEqual(true, "search result check 4");
//        expect(
//          matchProp(res[4], { data_id: 10, start_pos: 5, end_pos: 9 })
//        ).toEqual(true, "search result check 5");
//        expect(
//          matchProp(res[5], { data_id: 12, start_pos: 1, end_pos: 5 })
//        ).toEqual(true, "search result check 6");
//
//        // weight= 0.93
//        expect(
//          matchProp(res[6], { data_id: 5, start_pos: 1, end_pos: 6 })
//        ).toEqual(true, "search result check 7");
//        expect(
//          matchProp(res[7], { data_id: 8, start_pos: 4, end_pos: 9 })
//        ).toEqual(true, "search result check 8");
//        expect(
//          matchProp(res[8], { data_id: 9, start_pos: 1, end_pos: 6 })
//        ).toEqual(true, "search result check 9");
//        expect(
//          matchProp(res[9], { data_id: 12, start_pos: 0, end_pos: 5 })
//        ).toEqual(true, "search result check 10");
//
//        // weight= 0.9
//        expect(
//          matchProp(res[10], { data_id: 5, start_pos: 0, end_pos: 6 })
//        ).toEqual(true, "search result check 11");
//        expect(
//          matchProp(res[11], { data_id: 8, start_pos: 3, end_pos: 9 })
//        ).toEqual(true, "search result check 12");
//        expect(
//          matchProp(res[12], { data_id: 9, start_pos: 0, end_pos: 6 })
//        ).toEqual(true, "search result check 13");
//
//        // weight=0.65
//        expect(
//          matchProp(res[13], { data_id: 13, start_pos: 0, end_pos: 5 })
//        ).toEqual(true, "search result check 14");
//        expect(
//          matchProp(res[14], { data_id: 5, start_pos: 3, end_pos: 6 })
//        ).toEqual(true, "search result check 15");
//        expect(
//          matchProp(res[15], { data_id: 7, start_pos: 1, end_pos: 4 })
//        ).toEqual(true, "search result check 16");
//        expect(
//          matchProp(res[16], { data_id: 8, start_pos: 6, end_pos: 9 })
//        ).toEqual(true, "search result check 17");
//        expect(
//          matchProp(res[17], { data_id: 9, start_pos: 3, end_pos: 6 })
//        ).toEqual(true, "search result check 18");
//        expect(
//          matchProp(res[18], { data_id: 10, start_pos: 6, end_pos: 9 })
//        ).toEqual(true, "search result check 19");
//        expect(
//          matchProp(res[19], { data_id: 11, start_pos: 6, end_pos: 9 })
//        ).toEqual(true, "search result check 20");
//        expect(
//          matchProp(res[20], { data_id: 12, start_pos: 2, end_pos: 5 })
//        ).toEqual(true, "search result check 21");
//        expect(
//          matchProp(res[21], { data_id: 13, start_pos: 2, end_pos: 5 })
//        ).toEqual(true, "search result check 22");
//        expect(
//          matchProp(res[22], { data_id: 13, start_pos: 1, end_pos: 5 })
//        ).toEqual(true, "search result check 23");
//
//        // other
//        expect(
//          matchProp(res[23], { data_id: 10, start_pos: 1, end_pos: 9 })
//        ).toEqual(true, "search result check 24");
//        expect(
//          matchProp(res[24], { data_id: 11, start_pos: 2, end_pos: 9 })
//        ).toEqual(true, "search result check 25");
//        expect(
//          matchProp(res[25], { data_id: 5, start_pos: 4, end_pos: 6 })
//        ).toEqual(true, "search result check 26");
//        expect(
//          matchProp(res[26], { data_id: 7, start_pos: 2, end_pos: 4 })
//        ).toEqual(true, "search result check 27");
//        expect(
//          matchProp(res[27], { data_id: 8, start_pos: 7, end_pos: 9 })
//        ).toEqual(true, "search result check 28");
//        expect(
//          matchProp(res[28], { data_id: 9, start_pos: 4, end_pos: 6 })
//        ).toEqual(true, "search result check 29");
//        expect(
//          matchProp(res[29], { data_id: 10, start_pos: 7, end_pos: 9 })
//        ).toEqual(true, "search result check 30");
//        expect(
//          matchProp(res[30], { data_id: 11, start_pos: 7, end_pos: 9 })
//        ).toEqual(true, "search result check 31");
//        expect(
//          matchProp(res[31], { data_id: 12, start_pos: 3, end_pos: 5 })
//        ).toEqual(true, "search result check 32");
//        expect(
//          matchProp(res[32], { data_id: 13, start_pos: 3, end_pos: 5 })
//        ).toEqual(true, "search result check 33");
//        expect(
//          matchProp(res[33], { data_id: 11, start_pos: 1, end_pos: 9 })
//        ).toEqual(true, "search result check 34");
//        expect(
//          matchProp(res[34], { data_id: 10, start_pos: 0, end_pos: 9 })
//        ).toEqual(true, "search result check 35");
//        expect(
//          matchProp(res[35], { data_id: 6, start_pos: 0, end_pos: 1 })
//        ).toEqual(true, "search result check 36");
//        expect(
//          matchProp(res[36], { data_id: 11, start_pos: 0, end_pos: 9 })
//        ).toEqual(true, "search result check 37");
//        expect(
//          matchProp(res[37], { data_id: 6, start_pos: 1, end_pos: 2 })
//        ).toEqual(true, "search result check 38");


        ///*  5 */ { type: "aaa", content: "ababcde" },
        expect(
          matchProp(res[0], { data_id: 5, start_pos: 2, end_pos: 6 })
        ).toEqual(true, "search result check 1");
        expect(
          matchProp(res[6], { data_id: 5, start_pos: 1, end_pos: 6 })
        ).toEqual(true, "search result check 7");
        expect(
          matchProp(res[10], { data_id: 5, start_pos: 0, end_pos: 6 })
        ).toEqual(true, "search result check 11");
        expect(
          matchProp(res[14], { data_id: 5, start_pos: 3, end_pos: 6 })
        ).toEqual(true, "search result check 15");
        expect(
          matchProp(res[25], { data_id: 5, start_pos: 4, end_pos: 6 })
        ).toEqual(true, "search result check 26");

        ///*  7 */ { type: "aaa", content: "abcde" },
        expect(
          matchProp(res[1], { data_id: 7, start_pos: 0, end_pos: 4 })
        ).toEqual(true, "search result check 2");
        expect(
          matchProp(res[15], { data_id: 7, start_pos: 1, end_pos: 4 })
        ).toEqual(true, "search result check 16");
        expect(
          matchProp(res[26], { data_id: 7, start_pos: 2, end_pos: 4 })
        ).toEqual(true, "search result check 27");

        ///*  8 */ { type: "aaa", content: "xyzababcde" },
        expect(
          matchProp(res[2], { data_id: 8, start_pos: 5, end_pos: 9 })
        ).toEqual(true, "search result check 3");
        expect(
          matchProp(res[7], { data_id: 8, start_pos: 4, end_pos: 9 })
        ).toEqual(true, "search result check 8");
        expect(
          matchProp(res[11], { data_id: 8, start_pos: 3, end_pos: 9 })
        ).toEqual(true, "search result check 12");
        expect(
          matchProp(res[16], { data_id: 8, start_pos: 6, end_pos: 9 })
        ).toEqual(true, "search result check 17");
        expect(
          matchProp(res[27], { data_id: 8, start_pos: 7, end_pos: 9 })
        ).toEqual(true, "search result check 28");

        ///*  9 */ { type: "aaa", content: "ababcdexyz" },
        expect(
          matchProp(res[3], { data_id: 9, start_pos: 2, end_pos: 6 })
        ).toEqual(true, "search result check 4");
        expect(
          matchProp(res[8], { data_id: 9, start_pos: 1, end_pos: 6 })
        ).toEqual(true, "search result check 9");
        expect(
          matchProp(res[12], { data_id: 9, start_pos: 0, end_pos: 6 })
        ).toEqual(true, "search result check 13");
        expect(
          matchProp(res[17], { data_id: 9, start_pos: 3, end_pos: 6 })
        ).toEqual(true, "search result check 18");
        expect(
          matchProp(res[28], { data_id: 9, start_pos: 4, end_pos: 6 })
        ).toEqual(true, "search result check 29");

        ///* 10 */ { type: "aaa", content: "abxyzabcde" },
        expect(
          matchProp(res[4], { data_id: 10, start_pos: 5, end_pos: 9 })
        ).toEqual(true, "search result check 5");
        expect(
          matchProp(res[18], { data_id: 10, start_pos: 6, end_pos: 9 })
        ).toEqual(true, "search result check 19");
        expect(
          matchProp(res[23], { data_id: 10, start_pos: 1, end_pos: 9 })
        ).toEqual(true, "search result check 24");
        expect(
          matchProp(res[29], { data_id: 10, start_pos: 7, end_pos: 9 })
        ).toEqual(true, "search result check 30");
        expect(
          matchProp(res[34], { data_id: 10, start_pos: 0, end_pos: 9 })
        ).toEqual(true, "search result check 35");

        ///* 12 */ { type: "aaa", content: "babcde" },
        expect(
          matchProp(res[5], { data_id: 12, start_pos: 1, end_pos: 5 })
        ).toEqual(true, "search result check 6");
        expect(
          matchProp(res[9], { data_id: 12, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "search result check 10");
        expect(
          matchProp(res[20], { data_id: 12, start_pos: 2, end_pos: 5 })
        ).toEqual(true, "search result check 21");
        expect(
          matchProp(res[31], { data_id: 12, start_pos: 3, end_pos: 5 })
        ).toEqual(true, "search result check 32");

        ///* 13 */ { type: "aaa", content: "ababcd" }
        expect(
          matchProp(res[13], { data_id: 13, start_pos: 0, end_pos: 5 })
        ).toEqual(true, "search result check 14");
        expect(
          matchProp(res[21], { data_id: 13, start_pos: 2, end_pos: 5 })
        ).toEqual(true, "search result check 22");
        expect(
          matchProp(res[22], { data_id: 13, start_pos: 1, end_pos: 5 })
        ).toEqual(true, "search result check 23");
        expect(
          matchProp(res[32], { data_id: 13, start_pos: 3, end_pos: 5 })
        ).toEqual(true, "search result check 33");

        ///* 11 */ { type: "aaa", content: "abaxyzbcde" },
        expect(
          matchProp(res[19], { data_id: 11, start_pos: 6, end_pos: 9 })
        ).toEqual(true, "search result check 20");
        expect(
          matchProp(res[24], { data_id: 11, start_pos: 2, end_pos: 9 })
        ).toEqual(true, "search result check 25");
        expect(
          matchProp(res[30], { data_id: 11, start_pos: 7, end_pos: 9 })
        ).toEqual(true, "search result check 31");
        expect(
          matchProp(res[33], { data_id: 11, start_pos: 1, end_pos: 9 })
        ).toEqual(true, "search result check 34");
        expect(
          matchProp(res[36], { data_id: 11, start_pos: 0, end_pos: 9 })
        ).toEqual(true, "search result check 37");

        ///*  6 */ { type: "aaa", content: "abab" },
        expect(
          matchProp(res[35], { data_id: 6, start_pos: 0, end_pos: 1 })
        ).toEqual(true, "search result check 36");
        expect(
          matchProp(res[37], { data_id: 6, start_pos: 1, end_pos: 2 })
        ).toEqual(true, "search result check 38");

        console.log("#########");
      });
    })

    .then(done);
  });

});
