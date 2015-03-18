'use strict';

var fs              = require('fs');
var path            = require('path');
var Promise         = require('bluebird');
var SpecConfig      = require('./SpecConfig');
var SpecResources   = require('./SpecResources');

module.exports = Spec;

/**
 * @constructor
 * @param {string} specFilePath Absolute path to spec file on disk
 * @param {number} id Spec id
 * @param {VxUnit} plugin Reference to plugin instance
 */
function Spec(specFilePath, id, plugin) {
  this.fsPath    = specFilePath;
  this.id        = id;
  this.basePath  = path.dirname(specFilePath);
  this.plugin    = plugin;
  this.vx     = plugin.vx;
  this.config    = new SpecConfig(this);
  this.resources = new SpecResources(this);
}

/**
 * @property {string} fsPath
 * @default null
 */
Spec.prototype.fsPath = null;

/**
 * @method load
 */
Spec.prototype.load = function () {
  return new Promise(function (resolve) {
    this.resources.spec().then(function (src) {
      this.config.annotations.parse(src);
      resolve();
    }.bind(this));
  }.bind(this));
};

/**
 * @method fsStream
 */
Spec.prototype.fsStream = function () {
  return fs.createReadStream(this.fsPath);
};

/**
 * Get render context
 */
Spec.prototype.ctx = function () {
  return new Promise(function (resolve) {
    Promise.all([
      this.resources.code(),
      this.resources.script(),
      this.resources.html(),
      this.resources.css(),
      this.resources.spec()
    ]).then(function (data) {
      var ctx = {
        code: data[0],
        script: data[1],
        html: data[2],
        css: data[3],
        spec: data[4]
      };

      resolve(ctx);
    });
  }.bind(this));
};

/**
 * Run spec on server
 */
Spec.prototype.runOnServer = function () {
  var frameworkName = this.config.get('framework');
  var framework;

  return new Promise(function (resolve, reject) {
    if (!frameworkName) {
      this.vx.error('Cannot run spec %s, no framework specified (%s)', this.id, this.fsPath);
      return reject(new Error('No test framework specified'));
    }

    framework = this.plugin.frameworks[frameworkName];

    if (!framework) {
      this.vx.error('Cannot run spec %s, framework "%s" not loaded (%s)', this.id, frameworkName, this.fsPath);
      return reject(new Error('Test framework "' + frameworkName + '" not loaded'));
    }

    this.vx.debug('Running test id %s (%s) with framework %s', this.id, this.fsPath, frameworkName);
    this.resources.spec().then(function (src) {
      framework.run(src).then(resolve, reject);
    }, reject);
  }.bind(this));
};
