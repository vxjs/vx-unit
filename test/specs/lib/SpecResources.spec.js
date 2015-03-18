var SpecResources = hmt.lib('SpecResources');

describe('SpecResources', function () {
  var config;
  var resources;

  beforeEach(function () {
    config = {
      code: [
        { path: hmt.path('fixtures', 'code', 'biz.js'), transforms: [] },
        { path: hmt.path('fixtures', 'code', 'baz.js'), transforms: [] }
      ]
    };

    resources = new SpecResources(config);
  });

  it('should load the @code resources', function (done) {
    var codes = [
      hmt.fixture('code', 'biz.js'),
      hmt.fixture('code', 'baz.js')
    ];

    resources.source('code').then(function (sources) {
      hmt.assert.deepEqual(sources, codes);
    }).then(done, done);
  });

});
