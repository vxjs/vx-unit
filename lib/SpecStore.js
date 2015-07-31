'use strict';

var Spec     = require('./Spec');
var mustache = require('mustache');
var glob     = require('glob');
var path     = require('path');
var fs       = require('fs');
var Promise  = require('bluebird');

module.exports = SpecStore;

/**
 * @constructor
 * @param {VxUnit} plugin
 */
function SpecStore(plugin) {
  var router = plugin.router;

  this.plugin = plugin;
  this.vx  = plugin.vx;
  this.store  = {};

  router.addRoute(/^\/spec\/browser\/sandbox\/(.*)\/?$/i, this.sandboxPage, this);
  router.addRoute(/^\/spec\/browser\/(.*)\/?$/i, this.browserHarnessPage, this);
  router.addRoute(/^\/spec\/(.*)\/code\/?$/i, this.serveCodeFileList, this);
  router.addRoute(/^\/spec\/(.*)\/code\/(.*)\/?$/i, this.serveCodeFile, this);
  router.addRoute(/^\/spec\/server\/(.*)\/?$/i, this.serverHarnessPage, this);
  router.addRoute(/^\/spec\/store\/?$/i, this.storePage, this);
  router.addRoute(/^\/?$/i, this.storePage, this);
}

/**
 * @method buildSpecs
 * @param {array} specs
 * @param {string} cwd
 */
SpecStore.prototype.init = function (specs, cwd) {
  var id = 0;

  if (!specs) {
    this.vx.info('No specs specified in config options');
    return;
  }

  glob
    .sync(specs)
    .map(function (file) {
      return path.resolve(cwd, file);
    })
    .forEach(function (path) {
      var specId = id++;
      this.store[specId] = new Spec(path, specId, this.plugin);
    }, this);
};

/**
 * Serve store page (list all loaded specs)
 * @param {object} meta Meta data used to determine what type of content to return
 */
SpecStore.prototype.storePage = function (meta) {
  var specs = Object.keys(this.store).map(function (key) {
    return this.store[key];
  }, this);


  if (meta.json) {
    return this.storePageJson(specs);
  } else {
    return this.storePageHtml(specs);
  }

};

/**
 * Serve store page as HTML
 * @param {array} specs Loaded spec files
 */
SpecStore.prototype.storePageHtml = function (specs) {
  var tl = fs.readFileSync(path.resolve(__dirname, '..', 'tl', 'store.tl')).toString();
  return Promise.resolve(mustache.render(tl, { specs: specs }));
};

/**
 * Serve store page as JSON
 * @param {array} specs Loaded spec files
 */
SpecStore.prototype.storePageJson = function (specs) {
  var content = { specs: [] };

  // Clean up JSON
  content.specs = specs.map(function (spec) {
    return {
      file: spec.fsPath,
      url: '/vx-unit/spec/browser/' + spec.id
    };
  });

  return Promise.resolve(content);
};

/**
 * Serve spec sandbox page. The sandbox page is the execution environment
 * for a single spec file.
 * @param {object} meta Meta data used to determine what type of content to return
 * @param {number} specId
 */
SpecStore.prototype.sandboxPage = function (meta, specId) {
  if (!this.store[specId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid spec ID: ' + specId) });
  } else {
    return this.store[specId].resources.sandboxPage();
  }
};

/**
 * Serve spec harness page (run tests on browser)
 * @param {object} meta Meta data used to determine what type of content to return
 * @param {number} specId
 */
SpecStore.prototype.browserHarnessPage = function (meta, specId) {
  if (!this.store[specId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid spec ID: ' + specId) });
  } else {
    return this.store[specId].resources.browserHarnessPage();
  }
};

/**
 * Serve source code file
 * @param {object} meta Meta data used to determine what type of content to return
 * @param {number} specId
 */
SpecStore.prototype.serveCodeFile = function (meta, specId, codeFileId) {
  if (!this.store[specId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid spec ID: ' + specId) });
  } else {
    return this.store[specId].resources.getCodeFile(codeFileId);
  }
};

/**
 * Serve list of source code files
 * @param {object} meta Meta data used to determine what type of content to return
 * @param {number} specId
 */
SpecStore.prototype.serveCodeFileList = function (meta, specId) {
  if (!this.store[specId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid spec ID: ' + specId) });
  } else {
    return this.store[specId].resources.getCodeFileList();
  }
};

/**
 * Serve spec harness page (run tests on server)
 * @param {object} meta Meta data used to determine what type of content to return
 * @param {number} specId
 */
SpecStore.prototype.serverHarnessPage = function (meta, specId) {
  if (!this.store[specId]) {
    return Promise.reject({ status: 404, err: new Error('Invalid spec ID: ' + specId) });
  } else {
    return this.store[specId].resources.serverHarnessPage();
  }
};
