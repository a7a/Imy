var calcFragmentNum = require('../src/js/lib/calcFragmentNum.js').calcFragmentNum;

describe('test - calcFragmentNum.js', function() {
  it('test1 - skip = 1', function(done) {
    expect(calcFragmentNum(1, 2)).toEqual(2);
    expect(calcFragmentNum(1, 3)).toEqual(4);
    expect(calcFragmentNum(1, 4)).toEqual(6);
    expect(calcFragmentNum(1, 5)).toEqual(8);

    done();
  });

  it('test1 - skip = 2', function(done) {
    expect(calcFragmentNum(2, 2)).toEqual(2);
    expect(calcFragmentNum(2, 3)).toEqual(6);
    expect(calcFragmentNum(2, 4)).toEqual(10);
    expect(calcFragmentNum(2, 5)).toEqual(14);
    expect(calcFragmentNum(2, 6)).toEqual(18);

    done();
  });

  it('test1 - skip = 3', function(done) {
    expect(calcFragmentNum(3, 2)).toEqual(2);
    expect(calcFragmentNum(3, 3)).toEqual(6);
    expect(calcFragmentNum(3, 4)).toEqual(12);
    expect(calcFragmentNum(3, 5)).toEqual(18);
    expect(calcFragmentNum(3, 6)).toEqual(24);
    expect(calcFragmentNum(3, 7)).toEqual(30);
    expect(calcFragmentNum(3, 8)).toEqual(36);

    done();
  });

  it('test1 - skip = 4', function(done) {
    expect(calcFragmentNum(4, 2)).toEqual(2);
    expect(calcFragmentNum(4, 3)).toEqual(6);
    expect(calcFragmentNum(4, 4)).toEqual(12);
    expect(calcFragmentNum(4, 5)).toEqual(20);
    expect(calcFragmentNum(4, 6)).toEqual(28);
    expect(calcFragmentNum(4, 7)).toEqual(36);
    expect(calcFragmentNum(4, 8)).toEqual(44);
    expect(calcFragmentNum(4, 9)).toEqual(52);
    expect(calcFragmentNum(4, 10)).toEqual(60);

    done();
  });

  it('test1 - skip = 5', function(done) {
    expect(calcFragmentNum(5, 2)).toEqual(2);
    expect(calcFragmentNum(5, 3)).toEqual(6);
    expect(calcFragmentNum(5, 4)).toEqual(12);
    expect(calcFragmentNum(5, 5)).toEqual(20);
    expect(calcFragmentNum(5, 6)).toEqual(30);
    expect(calcFragmentNum(5, 7)).toEqual(40);
    expect(calcFragmentNum(5, 8)).toEqual(50);
    expect(calcFragmentNum(5, 9)).toEqual(60);
    expect(calcFragmentNum(5, 10)).toEqual(70);
    expect(calcFragmentNum(5, 11)).toEqual(80);
    expect(calcFragmentNum(5, 12)).toEqual(90);

    done();
  });

});
