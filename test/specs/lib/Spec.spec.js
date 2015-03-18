var Spec = hmt.lib('Spec');

describe('Spec', function () {
  var spec;

  beforeEach(function (done) {
    spec = new Spec(hmt.path('fixtures', 'specs', 'b.spec.js'));
    spec.load().then(function () { done(); });
  });

  it('should set correct `code` value', function () {
    hmt.assert.equal(spec.config.code.length, 1);
    hmt.assert.equal(spec.config.code[0].path, hmt.path('fixtures', 'code', 'biz.js'));
  });

  it('should read full spec source', function (done) {
    var len = hmt.fixture('specs', 'b.spec.js').length;

    spec.source().then(function (data) {
      hmt.assert.equal(data.length, len);
    }).then(done, done);
  });

  it('should return all data needed to render a spec', function (done) {
    spec.ctx().then(function (ctx) {
      console.log(ctx);
    }).then(done, done);
  });
});
