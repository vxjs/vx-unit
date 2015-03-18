'use strict';

var SpecAnnotations = require('./SpecAnnotations');

module.exports = SpecConfig;

/**
 * @constructor
 */
function SpecConfig(spec) {
  this.annotations = new SpecAnnotations(spec.basePath, spec);
  this.configCtx = spec.plugin.config.clone(spec.fsPath);
  this.configCtx.addStore({
    provider: 'literal',
    data: this.annotations
  });
}

/**
 * @param {string} key Key to get
 * @returns {any}
 */
SpecConfig.prototype.get = function (key) {
  return this.configCtx.get(key);
};

/**
 * @param {string} key Key to get
 * @returns {object}
 */
SpecConfig.prototype.getWithMeta = function (key) {
  return this.configCtx.getWithMeta(key);
};
