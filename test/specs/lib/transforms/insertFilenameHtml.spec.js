var transform = hmt.lib('transforms', 'insertFilenameHtml');
var concat    = require('concat-stream');
var stream    = require('stream');

describe('insertFilenameHtml', function () {
  it('should prepend the given path', function (done) {
    var s, expected;

    expected = '\n<!-- source: foo.html -->\nhi';

    s = new stream.Readable();
    s.push('hi');
    s.push(null);

    s
      .pipe(transform('foo.html'))
      .pipe(concat(function (data) {
        hmt.assert.equal(data.toString(), expected);
        done();
      }));
  });
});

