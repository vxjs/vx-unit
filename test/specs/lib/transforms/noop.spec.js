var transform = hmt.lib('transforms', 'noop');
var concat    = require('concat-stream');
var stream    = require('stream');

describe('noop', function () {
  it('should not change value', function (done) {
    var s, expected;

    expected = 'hi';

    s = new stream.Readable();
    s.push('hi');
    s.push(null);

    s
      .pipe(transform())
      .pipe(concat(function (data) {
        hmt.assert.equal(data.toString(), expected);
        done();
      }));
  });
});

