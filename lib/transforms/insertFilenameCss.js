var through2 = require('through2');

module.exports = insertFilenameCss;

/**
 * Insert the source filename as a css comment
 * @param {string} path Path to source file which is being transformed
 */
function insertFilenameCss(path) {
  var prepended = false;

  function transform(chunk, enc, cb) {
    if (!prepended) {
      this.push([
        '\n',
        '/* source: ',
        path,
        ' */\n'
      ].join(''));

      prepended = true;
    }

    this.push(chunk);
    cb();
  }

  return through2(transform);
}
