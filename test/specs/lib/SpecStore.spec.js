var SpecStore = hmt.lib('SpecStore');

describe('SpecStore', function () {
  var store;

  beforeEach(function () {
    store = new SpecStore(['foobar.js', 'barfoo.js']);
  });

  it('should create foobar.js property', function () {
    hmt.assert.equal(typeof store.store['foobar.js'], 'object');
  });

  it('should create barfoo.js property', function () {
    hmt.assert.equal(typeof store.store['barfoo.js'], 'object');
  });

  it('should not create any other properties', function () {
    hmt.assert.equal(Object.keys(store.store).length, 2);
  });
});
