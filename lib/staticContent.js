'use strict';

var Promise = require('bluebird');
var fs      = require('fs');
var path    = require('path');

module.exports = {
  /**
   * @method content
   */
  content: function (meta, contentPath) {
    return new Promise(function (resolve, reject) {
      var fsPath = this.absPath(contentPath);

      // load content from filesystem
      // resolve deferred with content, or reject with 404
      fs.readFile(fsPath, function (err, data) {
        if (err) {
          reject({ status: 404, err: err });
        } else {
          resolve(data.toString());
        }
      });
    }.bind(this));
  },

  /**
   * @method absPath
   * @param {string} relativePath relative path
   */
  absPath: function (relativePath) {
    return path.resolve(__dirname, '..', 'web_client', relativePath);
  }
};
