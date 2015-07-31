'use strict';

var Promise       = require('bluebird'),
    staticContent = require('./staticContent');

module.exports = Router;

function Router(plugin) {
  this.vx  = plugin.vx;
  this.routes = [];

  this.addRoute(/^\/static\/(.*)/i, staticContent.content, staticContent);
}

/**
 * @method addRoute
 * @param {RegExp} re
 * @param {function} fn
 * @param {object} ctx
 */
Router.prototype.addRoute = function (re, fn, ctx) {
  this.routes.push({
    re  : re,
    fn  : fn,
    ctx : ctx
  });
};

/**
 * @method route
 * @param {string} path
 * @param {object} meta Meta data about the request
 */
Router.prototype.route = function (path, meta) {
  var matchedRoute, params;

  return new Promise(function (resolve, reject) {
    this.routes.some(function (route) {
      var match = path.match(route.re);

      if (match) {
        matchedRoute = route;
        params       = match.slice(1);
        return true;
      }
    }, this);

    if (matchedRoute) {
      params.unshift(meta);
      matchedRoute.fn.apply(matchedRoute.ctx, params).then(resolve, reject);
    } else {
      reject({ status: 404, err: new Error('No matching route') });
    }
  }.bind(this));
};

/**
 * @method onHttpRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
Router.prototype.onHttpRequest = function (request, response) {
  var timeout = setTimeout(function () {
    response.statusCode = 500;
    response.end('Request timed out');
  }, 5000);

  // Additional information about this request which the route
  // handler may find useful.
  var meta = {
    json: this.wantsJSON(request.headers.accept)
  };

  this.route(request.path, meta).then(function (content) {
    clearTimeout(timeout);

    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }

    response.end(content);
  }, function (err) {
    var stack = err.stack || err.err.stack;
    var msg   = err.message || err.err.message;

    this.vx.error(stack);

    clearTimeout(timeout);
    response.statusCode = err.status || 500;
    if (meta.json) {
      response.end(JSON.stringify({
        error: msg
      }));
    } else {
      response.end(msg);
    }
  }.bind(this));
};

/**
 * @method wantsJSON
 * @param {string} accept Header value
 * @returns {boolean}
 */
Router.prototype.wantsJSON = function (accept) {
  var htmlIdx, jsonIdx;

  if (typeof accept !== 'string') {
    return false;
  }

  htmlIdx = accept.toLowerCase().indexOf('text/html');
  jsonIdx = accept.toLowerCase().indexOf('application/json');

  if (jsonIdx === -1) {
    return false;
  }

  if (htmlIdx === -1) {
    return true;
  }

  return (jsonIdx < htmlIdx);
};
