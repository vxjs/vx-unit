'use strict';

var fs                = require('fs');
var path              = require('path');
var Promise           = require('bluebird');
var concat            = require('concat-stream');
var defaultTransforms = require('./transforms');
var mustache          = require('mustache');

module.exports = SpecResources;

/**
 * @constructor
 * @param {Spec} spec
 */
function SpecResources(spec) {
  this.plugin  = spec.plugin;
  this.vx   = spec.plugin.vx;
  this.specObj = spec;
  this.config  = spec.config;
}

/**
 * @method sources
 * @param {string} type
 */
SpecResources.prototype.source = function (type, defaultTransforms) {
  var sources = this.config.get(type);

  return Promise.all(
    sources.map(function (source) {
      source.defaultTransforms = defaultTransforms;
      return this.loadSource(source);
    }.bind(this))
  );
};

/**
 * @method loadSource
 * @param {object} source
 * @returns {Promise}
 */
SpecResources.prototype.loadSource = function (source) {
  var transforms = source.transforms.concat(source.defaultTransforms);

  return new Promise(function (resolve) {
    this
      .applyTransforms(fs.createReadStream(source.path), source.path, transforms)
      .pipe(concat(function (data) {
        resolve(data.toString());
      }));
  }.bind(this));
};

/**
 * Apply transforms
 * @param {stream} stream
 * @param {string} path File path stream was read from
 * @param {array} transforms
 */
SpecResources.prototype.applyTransforms = function (stream, path, transforms) {
  transforms.forEach(function (transform) {
    var tfn = this.plugin.transforms[transform] || defaultTransforms[transform];
    var error;

    if (!tfn) {
      error = new Error([
        'Unable to locate transform "',
        transform,
        '", specified in "',
        this.specObj.fsPath,
        '. Did you forget to load a plugin? Check your .vxrc file.'
      ].join(''));

      this.vx.error(error);
      return;
    }

    stream = stream.pipe(tfn(path));
  }, this);

  return stream;
};

/**
 * @method code
 * @returns {Promise}
 */
SpecResources.prototype.code = function () {
  return this.source('code', ['insertFilenameJs']);
};

/**
 * @method script
 * @returns {Promise}
 */
SpecResources.prototype.script = function () {
  return this.source('script', ['insertFilenameJs']);
};

/**
 * @method html
 * @returns {Promise}
 */
SpecResources.prototype.html = function () {
  return this.source('html', ['insertFilenameHtml']);
};

/**
 * @method css
 * @returns {Promise}
 */
SpecResources.prototype.css = function () {
  return this.source('css', ['insertFilenameCss']);
};

/**
 * @method spec
 * @returns {Promise}
 */
SpecResources.prototype.spec = function () {
  var transforms;

  transforms = this.config.get('transform') || [];
  transforms = transforms.concat(['insertFilenameJs']);

  return new Promise(function (resolve) {
    this.applyTransforms(this.specObj.fsStream(), this.specObj.fsPath, transforms).pipe(concat(function (data) {
      resolve(data.toString());
    }));
  }.bind(this));
};

/**
 * @method sandboxPage
 * @returns {Promise}
 */
SpecResources.prototype.sandboxPage = function () {
  return new Promise(function (resolve) {
    this.specObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'sandbox.tl')).toString();
      this.specObj.ctx().then(function (ctx) {
        resolve(mustache.render(tl, ctx));
      });
    }.bind(this));
  }.bind(this));
};

/**
 * @method browserHarnessPage
 * @returns {Promise}
 */
SpecResources.prototype.browserHarnessPage = function () {
  return new Promise(function (resolve) {
    this.specObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'browser_harness.tl')).toString();
      this.specObj.ctx().then(function (ctx) {
        resolve(mustache.render(tl, ctx));
      });
    }.bind(this));
  }.bind(this));
};

/**
 * @method serverHarnessPage
 * @returns {Promise}
 */
SpecResources.prototype.serverHarnessPage = function () {
  return new Promise(function (resolve, reject) {
    this.specObj.load().then(function () {
      var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'server_harness.tl')).toString();
      this
        .specObj
        .runOnServer()
        .then(function (data) {
          resolve(mustache.render(tl, data));
        }, reject);
    }.bind(this));
  }.bind(this));
};
