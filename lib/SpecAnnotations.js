'use strict';

var parse = require('vx-annotations');
var glob  = require('glob');
var path  = require('path');

module.exports = SpecAnnotations;

/**
 * Parse test annotations from source file
 * @constructor
 * @param {string} basePath Directory of source file
 * @param {string} basePath Directory of source file
 */
function SpecAnnotations(basePath, test) {
  this.basePath = basePath;
  this.vx       = test.plugin.vx;
  this.test     = test;
}

/**
 * Parse annotations from source
 * @param {string} source Source containing annotations
 */
SpecAnnotations.prototype.parse = function (source) {
  this.annotations = parse(source);
  this.script      = this.parseFileAnnotation('script', this.annotations);
  this.code        = this.parseFileAnnotation('code', this.annotations);
  this.html        = this.parseFileAnnotation('html', this.annotations);
  this.css         = this.parseFileAnnotation('css', this.annotations);
  this.transform   = this.parseStringAnnotation('transform', this.annotations);
  this.framework   = this.parseSingleStringAnnotation('framework', this.annotations);
};

/**
 * Parse an annotation which specifies a string value(s).
 *
 * An example annotation might be: @vx-transform vx-coffee-script vx-browserify
 * @param {string} annotationName Name of the annotation (ex, `transform`)
 * @param {object} annotations Hash of annotations, parsed by vx-annotations
 */
SpecAnnotations.prototype.parseStringAnnotation = function (annotationName, annotations) {
  return Object
    .keys(annotations)
    .reduce(this.reduce(annotationName, annotations), [])
    .reduce(this.reduceStringArrayValue.bind(this), []);
};

/**
 * Parse an annotation which specifies a single string value. If multiple values are found, returns
 * the last one.
 *
 * An example annotation might be: @framework mocha
 * @param {string} annotationName Name of the annotation (ex, `framework`)
 * @param {object} annotations Hash of annotations, parsed by vx-annotations
 */
SpecAnnotations.prototype.parseSingleStringAnnotation = function (annotationName, annotations) {
  return this.parseStringAnnotation(annotationName, annotations).pop();
};

/**
 * Reduce string value
 * @param {array} values List of reduced values
 * @param {array} value Value represented as array, to reduce in to values array
 */
SpecAnnotations.prototype.reduceStringArrayValue = function (values, value) {
  // format of include is: @vx-NAME val1 val2 val3
  // Example:
  //  @vx-transform browserify minify
  value.forEach(function (v) {
    values.push(v);
  });

  return values;
};

/**
 * Parse an annotation which specifies files to include in the test. A filepath
 * may be specified as an individual file, or as a glab pattern with wild card matching.
 *
 * Files may also be specified with transforms to apply, for example, browserify to bundle
 * commonJS code for the browser.
 *
 * An example annotation might be: @vx-include test*.js browserify
 * @param {string} annotationName Name of the annotation (ex, `code` or `include`)
 * @param {object} annotations Hash of annotations, parsed by vx-annotations
 */
SpecAnnotations.prototype.parseFileAnnotation = function (annotationName, annotations) {
  return Object
    .keys(annotations)
    .reduce(this.reduce(annotationName, annotations), [])
    .reduce(this.reduceFileInclude.bind(this), []);
};

/**
 * Reduce file include by resolving globs
 * @param {array} values List of reduced values
 * @param {array} value Value represented as array, to reduce in to values array
 */
SpecAnnotations.prototype.reduceFileInclude = function (values, value) {
  // format of include is: @vx-NAME glob_pattern transform1 transform2 ...
  // Example:
  //  @vx-code *.js browserify minify
  this
    .resolvePathAndGlobs(value[0])
    .forEach(function (filePath) {
      values.push({
        path: filePath,
        transforms: value.slice(1)
      });
    });

  return values;
};

/**
 * Reduce annotation values, ignoring case of annotation name
 * E.g., combine values for iNCLUDE and INCLUDE in to a single list
 * @param {string} annotationName
 * @param {object} annotations
 * @returns {function}
 */
SpecAnnotations.prototype.reduce = function (annotationName, annotations) {
  return function (values, key) {
    if (key.toLowerCase() === annotationName.toLowerCase()) {
      values = values.concat(annotations[key]);
    }

    return values;
  };
};

/**
 * @method resolvePathAndGlobs
 * @param {string} filePath
 * @returns {array} absolute file paths
 */
SpecAnnotations.prototype.resolvePathAndGlobs = function (filePath) {
  var matches = glob.sync(path.resolve(this.basePath, filePath));

  if (matches.length === 0) {
    this.vx.error('Could not locate any matching files for pattern %s in %s', filePath, this.test.fsPath);
  }

  return matches;
};
