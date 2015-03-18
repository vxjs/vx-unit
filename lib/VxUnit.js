var path      = require('path');
var Router    = require('./Router');
var SpecStore = require('./SpecStore');

module.exports = VxUnit;

/**
 * @constructor
 * @param {Vx} vx Context object
 */
function VxUnit(vx) {
  this.vx      = vx;
  this.router     = new Router(this);
  this.store      = new SpecStore(this);
  this.config     = vx.config;
  this.transforms = {};
  this.frameworks = {};
}

/**
 * @property name
 */
VxUnit.prototype.name = require(path.resolve(__dirname, '..', 'package.json')).name;

/**
 * @property version
 */
VxUnit.prototype.version = require(path.resolve(__dirname, '..', 'package.json')).version;

/**
 * @property dependencies
 */
VxUnit.prototype.dependencies = require(path.resolve(__dirname, '..', 'package.json')).vxDependencies;

/**
 * Initialize
 */
VxUnit.prototype.init = function () {
  var testData = this.vx.config.getWithMeta('tests');
  var tests    = testData.value;
  var cwd      = testData.meta.dir || process.cwd();

  this.store.init(tests, cwd);
};

/**
 * Register transform function
 * @param {string} name
 * @param {function} fn
 */
VxUnit.prototype.registerTransform = function (name, fn) {
  if (this.transforms[name]) {
    this.vx.error('Error, cannot register transform "' + name + '". A transform with this name already exists.');
    return;
  }

  this.transforms[name] = fn;
};

/**
 * Attach
 */
VxUnit.prototype.attach = function () {
  this.vx.plugins['vx-http'].addNamespaceHandler('vx-unit', this.router.onHttpRequest, this.router);
};


/**
 * @method onStart
 */
VxUnit.prototype.run = function () {
  // console.log(this.store);
  // Promise.all(this.tests.map(function (test) {
    // return test.load();
  // })).then(function () {
    // this.info('init vx unit, running tests:', this.tests);
  // }.bind(this));
};

/**
 * @method registerFramework
 * @param {object} framework
 * @param {object} plugin
 */
VxUnit.prototype.registerFramework = function (framework, plugin) {
  var name = ((framework || {}).name || '').toLowerCase();

  if (!name) {
    this.vx.error('Cannot register framework without a name');
    return;
  }

  this.frameworks[name] = framework;
  this.vx.debug('Framework %s registered from plugin %s', name, plugin.name);
};
