var arrayAddSuffix = require('../../dest/js/node/lib/arrayAddSuffix.js').arrayAddSuffix;

describe('test - arrayAddSuffix.js', function() {
  it('1', function(done) {
    var ans = arrayAddSuffix(['a','b','c']);
    expect(ans).toEqual([['a',0],['b',1],['c',2]]);
    done();
  });
  it('2', function(done) {
    var ans = arrayAddSuffix(['a', 'b','c'], { omit: ['b'] });
    expect(ans).toEqual([['a',0],['c',2]]);
    done();
  });
  it('3', function(done) {
    var ans = arrayAddSuffix(['a', 'b','c'], { omit: ['b'] });
    expect(ans).not.toEqual([['a',0],['b',1],['c',2]]);
    done();
  });
  it('4', function(done) {
    var ans = arrayAddSuffix(['a', 'b','c'], { omit: ['b'] });
    expect(ans).not.toEqual([['a',0],['c',1]]);
    done();
  });
});
