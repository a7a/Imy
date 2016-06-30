var stringToFragment = require('../dist/js/node/lib/stringToFragment.js').stringToFragment;

function debugFragment(name, frag) {
  console.log('');
  console.log('*** '+name+' ***');

  for(var i = 0, l = frag.length; i < l; i+=1) {
    var a = frag[i];

    console.log('ans: skip:'+a.skip);
    console.log('ans: frags:');
    for(var j = 0, l2 = a.frags.length; j < l2; j+=1) {
      console.log('  pos:'+a.frags[j][0].pos+' frag:'+a.frags[j][0].frag);
      console.log('  pos:'+a.frags[j][1].pos+' frag:'+a.frags[j][1].frag);
      console.log('+');
    }
    for(var j = 0, l2 = a.sort_flags.length; j < l2; j+=1) {
      console.log('  soft_flag[' + j + ']: ' + a.sort_flags[j]);
    }
  }
}

describe('test - stringToFragment.js', function() {
  it('1 no options', function(done) {
    var ans = stringToFragment('abcde');

    //debugFragment('test - stringToFragment.js', ans);

    expect(ans).toEqual([
      {
        skip: 1, weight: null, frags: [
          [{pos:0, frag:'a'}, {pos:1, frag:'b'}],
          [{pos:1, frag:'b'}, {pos:2, frag:'c'}],
          [{pos:2, frag:'c'}, {pos:3, frag:'d'}],
          [{pos:3, frag:'d'}, {pos:4, frag:'e'}]
        ],
        sort_flags: [0, 0, 0, 0]
      }
    ]);
    done();
  });

  it('2 option with start', function(done) {
    var ans = stringToFragment('abcde', { start: 3 });

    //debugFragment('2 option with start', ans);

    expect(ans).toEqual([
      {
        skip: 1, weight: null, frags: [
          [{pos:3, frag:'a'}, {pos:4, frag:'b'}],
          [{pos:4, frag:'b'}, {pos:5, frag:'c'}],
          [{pos:5, frag:'c'}, {pos:6, frag:'d'}],
          [{pos:6, frag:'d'}, {pos:7, frag:'e'}]
        ],
        sort_flags: [0, 0, 0, 0]
      }
    ]);
    done();
  });

  it('3 option with start, skip', function(done) {
    var ans = stringToFragment('abcde', { start: 11, skip: 3 });

    //debugFragment('3 option with start, skip', ans);

    expect(ans).toEqual([
      {
        skip: 1, weight: null, frags: [
          [{pos:11, frag:'a'}, {pos:12, frag:'b'}],
          [{pos:12, frag:'b'}, {pos:13, frag:'c'}],
          [{pos:13, frag:'c'}, {pos:14, frag:'d'}],
          [{pos:14, frag:'d'}, {pos:15, frag:'e'}]
        ],
        sort_flags: [0, 0, 0, 0]
      },
      {
        skip: 2, weight: null, frags: [
          [{pos:11, frag:'a'}, {pos:13, frag:'c'}],
          [{pos:12, frag:'b'}, {pos:14, frag:'d'}],
          [{pos:13, frag:'c'}, {pos:15, frag:'e'}]
        ],
        sort_flags: [0, 0, 0]
      },
      {
        skip: 3, weight: null, frags: [
          [{pos:11, frag:'a'}, {pos:14, frag:'d'}],
          [{pos:12, frag:'b'}, {pos:15, frag:'e'}]
        ],
        sort_flags: [0, 0]
      }
    ]);
    done();
  });

  it('4 option with start, skip, omit', function(done) {
    var ans = stringToFragment('abcde', { start: 7, skip: 2, omit: ['c', 'e']});

    //debugFragment('4 option with start, skip, omit', ans);

    expect(ans).toEqual([
      {
        skip: 1, weight: null, frags: [
          [{pos:7, frag:'a'}, {pos:8, frag:'b'}],
          [{pos:8, frag:'b'}, {pos:10, frag:'d'}]
        ],
        sort_flags: [0, 0]
      },
      {
        skip: 2, weight: null, frags: [
          [{pos:7, frag:'a'}, {pos:10, frag:'d'}]
        ],
        sort_flags: [0]
      }
    ]);
    done();
  });

  it('5 ', function(done) {
    var ans = stringToFragment('abdcef');

    expect(ans).toEqual([
      {
        skip: 1, weight: null, frags: [
          [{pos:0, frag:'a'}, {pos:1, frag:'b'}],
          [{pos:1, frag:'b'}, {pos:2, frag:'d'}],
          [{pos:2, frag:'c'}, {pos:3, frag:'d'}],
          [{pos:3, frag:'c'}, {pos:4, frag:'e'}],
          [{pos:4, frag:'e'}, {pos:5, frag:'f'}],
        ],
        sort_flags: [0, 0, 1, 0, 0]
      }
    ]);

    done();
  });

  it('100 argument type test arguments[0]', function(done) {
    try {
      var ans = stringToFragment(0);
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(e.message).toEqual('argument error: arguments[0] must be string');
    }
    done();
  });

  it('101 argument type test arguments[1] opt.start', function(done) {
    try {
      var ans = stringToFragment('abc', { start: -1 });
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(e.message).toEqual('argument error: arguments[1] opt.start must be integer over 0');
    }
    done();
  });

  it('102 argument type test arguments[1] opt.start', function(done) {
    try {
      var ans = stringToFragment('abc', { start: 0.1 });
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(e.message).toEqual('argument error: arguments[1] opt.start must be integer over 0');
    }
    done();
  });

  it('103 argument type test argumetns[1] opt.start', function(done) {
    try {
      var ans = stringToFragment('abc', { start: '0' });
      expect(0).toEqual(0);
    } catch(e) {
      console.log(e.message);
      expect(0).toEqual(1);
    }
    done();
  });

  it('104 argument type test arguments[1] opt.skip', function(done) {
    try {
      var ans = stringToFragment('abc', { start: 0, skip: 0 });
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(e.message).toEqual('argument error: arguments[1] opt.skip must be integer over 1');
    }
    done();
  });

  it('105 argument type test arguments[1] opt.skip', function(done) {
    try {
      var ans = stringToFragment('abc', { start: 0, skip: 1.1 });
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(e.message).toEqual('argument error: arguments[1] opt.skip must be integer over 1');
    }
    done();
  });

  it('106 argument type test arguments[1] opt.skip', function(done) {
    try {
      var ans = stringToFragment('abc', { start: 0, skip: '1' });
      expect(0).toEqual(0);
    } catch(e) {
      console.log(e.message);
      expect(0).toEqual(1);
    }
    done();
  });

  it('107 argument type test arguments[1] opt.omit', function(done) {
    try {
      var ans = stringToFragment('abc', {start: 0, skip: 1, omit: '' });
      expect(0).toEqual(1);
    } catch(e) {
      console.log(e.message);
      expect(0).toEqual(0);
    }
    done();
  });

  it('108 argument type test arguments[1] opt.omit', function(done) {
    try {
      var ans = stringToFragment('abc', {start: 0, skip: 1, omit: [] });
      expect(0).toEqual(0);
    } catch(e) {
      console.log(e.message);
      expect(0).toEqual(1);
    }
    done();
  });

});
