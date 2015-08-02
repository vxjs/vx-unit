var Router = hmt.lib('Router');

describe('Router', function () {
  var router;

  beforeEach(function () {
    var pluginMock = {vx: {}};
    router = new Router(pluginMock);
  });

  describe('initialization', function () {
    it('should have one default route', function () {
        hmt.assert.equal(router.routes.length, 1);
    });
  });

  describe('convertStringPatternToRegExp', function () {
    it('simple pattern', function () {
      var pattern = '/foo/bar';
      var route = router.createPatternFromStr(pattern);

      hmt.assert.equal(route.re.test('/foo/bar'), true);
      hmt.assert.equal(route.re.test('/foo/bar/bar'), false);
      hmt.assert.equal(route.re.test('/foo/bar/'), true);
      hmt.assert.equal(route.re.test('abc/foo/bar/'), false);
      hmt.assert.equal(route.re.test('/foo/bar//'), true);
    });

    it('pattern with params', function () {
      var pattern = '/foobar/:biz/:baz';
      var route = router.createPatternFromStr(pattern);

      hmt.assert.equal(route.re.test('/foobar/baraou/nath'), true);
      hmt.assert.equal(route.re.test('/foobar/baraou/nath/'), true);
      hmt.assert.equal(route.re.test('a/foobar/baraou/nath/'), false);
      hmt.assert.equal(route.re.test('/foobar/baraou/nath/th'), false);
    });
  });


});
