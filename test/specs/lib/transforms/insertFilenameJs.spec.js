var transform = hmt.lib('transforms', 'insertFilenameJs');
var concat    = require('concat-stream');
var stream    = require('stream');

describe('insertFilenameJs', function () {
  it('should prepend the given path', function (done) {
    var s, expected;

    expected = '\n// source: foo.js\nhi';

    s = new stream.Readable();
    s.push('hi');
    s.push(null);

    s
      .pipe(transform('foo.js'))
      .pipe(concat(function (data) {
        hmt.assert.equal(data.toString(), expected);
        done();
      }));
  });
});

