var SpecAnnotations = hmt.lib('SpecAnnotations');

describe('SpecAnnotations', function () {

  describe('constructor', function () {
    var instance;

    before(function () {
      var source   = hmt.fixture('specs', 'b.spec.js');
      var basePath = hmt.path('fixtures', 'specs');

      instance = new SpecAnnotations(source, basePath);
    });

    it('should parse html', function () {
      var expected = [
        { path: hmt.path('fixtures', 'html', 'test.tl'), transforms: ['dust'] },
        { path: hmt.path('fixtures', 'html', 'bar.html'), transforms: [] },
        { path: hmt.path('fixtures', 'html', 'foo.html'), transforms: [] }
      ];

      hmt.assert.deepEqual(instance.html, expected);
    });

    it('should parse script', function () {
      var expected = [
        { path: hmt.path('fixtures', 'script', 'a.js'), transforms: ['browserify'] },
        { path: hmt.path('fixtures', 'script', 'd1.js'), transforms: [] },
        { path: hmt.path('fixtures', 'script', 'd2.js'), transforms: [] }
      ];

      hmt.assert.deepEqual(instance.script, expected);
    });

    it('should parse css', function () {
      var expected = [
        { path: hmt.path('fixtures', 'css', 'main.scss'), transforms: ['sass'] }
      ];

      hmt.assert.deepEqual(instance.css, expected);
    });

    it('should parse code', function () {
      var expected = [
        { path: hmt.path('fixtures', 'code', 'biz.js'), transforms: ['minify'] }
      ];

      hmt.assert.deepEqual(instance.code, expected);
    });

  });
});
