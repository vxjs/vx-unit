var through2 = require('through2');

module.exports = noop;

function noop() {
  return through2();
}
