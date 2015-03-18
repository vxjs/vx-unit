var path = require('path'),
    fs   = require('fs');

module.exports = {
  spec: function (name) {
    var specPath = path.resolve(__dirname, '..', 'fixtures', 'specs', name);

    return {
      path: specPath,
      data: fs.readFileSync(specPath).toString()
    }
  }
};
