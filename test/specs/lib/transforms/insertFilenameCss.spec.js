var transform = hmt.lib('transforms', 'insertFilenameCss');
var concat    = require('concat-stream');
var stream    = require('stream');

describe('insertFilenameCss', function () {
  it('should prepend the given path', function (done) {
    var s, expected;

    expected = '\n/* source: foo.css */\nhi';

    s = new stream.Readable();
    s.push('hi');
    s.push(null);

    s
      .pipe(transform('foo.css'))
      .pipe(concat(function (data) {
        hmt.assert.equal(data.toString(), expected);
        done();
      }));
  });
});

