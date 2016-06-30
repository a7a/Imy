var calculateScore = require("../src/js/lib/calculateScore.js").calculateScore;
var stringToFragments = require("../src/js/lib/stringToFragments.js").stringToFragments;
var analyzeFragments = require("../src/js/lib/analyzeFragments.js").analyzeFragments;

var param = { skip: 2, matching_min_ratio: 0.6, matching_max_ratio: 1.6 };

var sort_func = function(a, b) {
  if(a.weight < b.weight) {
    return 1;
  } else if(a.weight > b.weight) {
    return -1;
  } else if(a.sort_num > b.sort_num) {
    return 1;
  } else if(a.sort_num < b.sort_num) {
    return -1;
  } else if(a.data_id > b.data_id) {
    return 1;
  } else if(a.data_id < b.data_id) {
    return -1;
  } else {
    return 0;
  }
};

var check = function(obj, prop) {
  for(var key in prop) {
    if(obj[key] !== prop[key]) {
      console.error("unmatch: ", obj[key], prop[key]);

      return false;
    }
  }

  return true;
};


describe('test - calculateScore.js', function() {
  it('test001 - ', function(done) {
    var s = "ab";
    var rows = [
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 1 })).toEqual(true, "check test001 - 1");

    done();
  });

  it('test002 - ', function(done) {
    var s = "abc";
    var rows = [
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 2 })).toEqual(true, "check test002 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 2 })).toEqual(true, "check test002 - 2");

    done();
  });

  it('test003 - ', function(done) {
    var s = "abcd";
    var rows = [ // abcd
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 3 })).toEqual(true, "check test003 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 3 })).toEqual(true, "check test003 - 2");

    done();
  });

  it('test004 - ', function(done) {
    var s = "abcde";
    var rows = [ // abcde
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 4 })).toEqual(true, "check test004 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 4 })).toEqual(true, "check test004 - 2");
    expect(check(ret[2], { id: 1, start_pos: 2, end_pos: 4 })).toEqual(true, "check test004 - 3");

    done();
  });

  it('test005 - ', function(done) {
    var s = "abcdef";
    var rows = [ // abcdef
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "df", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ef", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 5 })).toEqual(true, "check test005 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 5 })).toEqual(true, "check test005 - 2");
    expect(check(ret[2], { id: 1, start_pos: 2, end_pos: 5 })).toEqual(true, "check test005 - 3");

    done();
  });

  it('test006 - ', function(done) {
    var s = "abcdefg";
    var rows = [ // abcdefg
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "df", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ef", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "eg", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "fg", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 6 })).toEqual(true, "check test006 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 6 })).toEqual(true, "check test006 - 2");
    expect(check(ret[2], { id: 1, start_pos: 2, end_pos: 6 })).toEqual(true, "check test006 - 3");

    done();
  });

  it('test007 - ', function(done) {
    var s = "abcdefgh";
    var rows = [ // abcdefgh
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "df", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ef", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "eg", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "fg", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "fh", d_content_pos1: 5, d_content_pos2: 7, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "gh", d_content_pos1: 6, d_content_pos2: 7, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 7 })).toEqual(true, "check test007 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 7 })).toEqual(true, "check test007 - 2");
    expect(check(ret[2], { id: 1, start_pos: 2, end_pos: 7 })).toEqual(true, "check test007 - 3");
    expect(check(ret[3], { id: 1, start_pos: 3, end_pos: 7 })).toEqual(true, "check test007 - 4");

    done();
  });

  it('test010 - ', function(done) {
    var s = "abcde";
    var rows = [ // ababcde
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "aa", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "bb", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 2, end_pos: 6 })).toEqual(true, "check test010 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 6 })).toEqual(true, "check test010 - 2");
    expect(check(ret[2], { id: 1, start_pos: 0, end_pos: 6 })).toEqual(true, "check test010 - 3");
    expect(check(ret[3], { id: 1, start_pos: 3, end_pos: 6 })).toEqual(true, "check test010 - 4");
    expect(check(ret[4], { id: 1, start_pos: 4, end_pos: 6 })).toEqual(true, "check test010 - 5");

    done();
  });

  it('test011 - ', function(done) {
    var s = "abcde";
    var rows = [ // abcdecd
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 4 })).toEqual(true, "check test011 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 4 })).toEqual(true, "check test011 - 2");
    expect(check(ret[2], { id: 1, start_pos: 2, end_pos: 4 })).toEqual(true, "check test011 - 3");
    expect(check(ret[3], { id: 1, start_pos: 3, end_pos: 5 })).toEqual(true, "check test011 - 4");
    expect(check(ret[4], { id: 1, start_pos: 4, end_pos: 6 })).toEqual(true, "check test011 - 5");

    done();
  });

  it('test012 - ', function(done) {
    var s = "abcde";
    var rows = [ // abxxxabcde
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 5, d_content_pos2: 7, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 6, d_content_pos2: 7, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 6, d_content_pos2: 8, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 7, d_content_pos2: 8, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ce", d_content_pos1: 7, d_content_pos2: 9, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "de", d_content_pos1: 8, d_content_pos2: 9, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 5, end_pos: 9 })).toEqual(true, "check test012 - 1");
    expect(check(ret[1], { id: 1, start_pos: 6, end_pos: 9 })).toEqual(true, "check test012 - 2");
    expect(check(ret[2], { id: 1, start_pos: 7, end_pos: 9 })).toEqual(true, "check test012 - 3");

    done();
  });

  it('test013 - ', function(done) {
    var s = "abcd";
    var rows = [ // abcdxxxab
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "cx", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 5, d_content_pos2: 7, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 6, d_content_pos2: 7, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 6, d_content_pos2: 8, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 7, d_content_pos2: 8, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 3 })).toEqual(true, "check test013 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 3 })).toEqual(true, "check test013 - 2");

    done();
  });

  it('test014 - ', function(done) {
    var s = "abcd";
    var rows = [ // xxxabdxxx
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ad", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 5, d_content_pos2: 7, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 6, d_content_pos2: 7, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 6, d_content_pos2: 8, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 7, d_content_pos2: 8, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 3, end_pos: 5 })).toEqual(true, "check test014 - 1");

    done();
  });

  it('test015 - ', function(done) {
    var s = "abcd";
    var rows = [ // xxxabxdxxx
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 2, d_content_pos2: 4, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 3, d_content_pos2: 4, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "ax", d_content_pos1: 3, d_content_pos2: 5, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "bx", d_content_pos1: 4, d_content_pos2: 5, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 4, d_content_pos2: 6, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 5, d_content_pos2: 6, sort_flag: 1 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 5, d_content_pos2: 7, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 6, d_content_pos2: 7, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "dx", d_content_pos1: 6, d_content_pos2: 8, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 7, d_content_pos2: 8, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 7, d_content_pos2: 9, sort_flag: 0 },
      //  { type: "aaa", data_id: 1, value: "xx", d_content_pos1: 8, d_content_pos2: 9, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 3, end_pos: 6 })).toEqual(true, "check test015 - 1");

    done();
  });

  it('test016 - ', function(done) {
    var s = "abcd";
    var rows = [ // acbd
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 1 },
      { type: "aaa", data_id: 1, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "cd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 1, start_pos: 0, end_pos: 3 })).toEqual(true, "check test016 - 1");
    expect(check(ret[1], { id: 1, start_pos: 1, end_pos: 3 })).toEqual(true, "check test016 - 2");

    done();
  });

  it('test017 - ', function(done) {
    var s = "abcd"; //ab,ac,bc,bd,cd
    var rows = [ // abc,abxd,ab,adcb,abd,acbd
      { type: "aaa", data_id: 1, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 1, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },

      { type: "aaa", data_id: 2, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //{ type: "aaa", data_id: 2, value: "ax", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      //{ type: "aaa", data_id: 2, value: "bx", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 2, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      //{ type: "aaa", data_id: 2, value: "dx", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 1 },

      { type: "aaa", data_id: 3, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },

      //{ type: "aaa", data_id: 4, value: "ad", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 4, value: "ac", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 4, value: "cd", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 1 },
      { type: "aaa", data_id: 4, value: "bd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 1 },
      { type: "aaa", data_id: 4, value: "bc", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 1 },

      { type: "aaa", data_id: 5, value: "ab", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      //{ type: "aaa", data_id: 5, value: "ad", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 5, value: "bd", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 0 },

      { type: "aaa", data_id: 6, value: "ac", d_content_pos1: 0, d_content_pos2: 1, sort_flag: 0 },
      { type: "aaa", data_id: 6, value: "ab", d_content_pos1: 0, d_content_pos2: 2, sort_flag: 0 },
      { type: "aaa", data_id: 6, value: "bc", d_content_pos1: 1, d_content_pos2: 2, sort_flag: 1 },
      { type: "aaa", data_id: 6, value: "cd", d_content_pos1: 1, d_content_pos2: 3, sort_flag: 0 },
      { type: "aaa", data_id: 6, value: "bd", d_content_pos1: 2, d_content_pos2: 3, sort_flag: 0 },
    ];
    var fragments = stringToFragments(s, param);
    var analyzed = analyzeFragments(fragments);

    var ret = calculateScore(rows, fragments, s.length, analyzed.map, param);

    ret = ret.sort(sort_func);

    expect(check(ret[0], { id: 6, start_pos: 0, end_pos: 3 })).toEqual(true, "check test017 - 1");
    expect(check(ret[1], { id: 4, start_pos: 0, end_pos: 3 })).toEqual(true, "check test017 - 2");
    expect(check(ret[2], { id: 1, start_pos: 0, end_pos: 2 })).toEqual(true, "check test017 - 3");
    expect(check(ret[3], { id: 6, start_pos: 1, end_pos: 3 })).toEqual(true, "check test017 - 4");
    expect(check(ret[4], { id: 4, start_pos: 1, end_pos: 3 })).toEqual(true, "check test017 - 5");
    expect(check(ret[5], { id: 2, start_pos: 0, end_pos: 3 })).toEqual(true, "check test017 - 6");
    expect(check(ret[6], { id: 5, start_pos: 0, end_pos: 2 })).toEqual(true, "check test017 - 7");

    done();
  });

});
