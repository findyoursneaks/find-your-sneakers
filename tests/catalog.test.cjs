const { test } = require('node:test');
const assert = require('node:assert/strict');
const { liveOffers, isLiveOffer, storeCount, offerDestination } = require('../.test-build/lib/offers.js');
const { filterCatalog } = require('../.test-build/lib/catalog.js');
const offer = (extra = {}) => ({ id: 'one', price: 100, currency: 'EUR', in_stock: true, affiliate_url: 'https://retailer.example/pair', product_url: '', available_sizes: ['42'], retailers: { id: 'shop', affiliate_enabled: true }, ...extra });
const product = (extra = {}) => ({ id: 'pair', name: 'Air Max 95', model: 'Air Max', gender: 'unisex', brands: { name: 'Nike', slug: 'nike' }, offers: [offer()], ...extra });
test('demo, unavailable, invalid and non-euro prices never win the euro comparison', () => {
  const p = product({ offers: [offer({ price: 1, retailers: { id: 'demo', affiliate_enabled: false } }), offer({ price: 2, in_stock: false }), offer({ price: 3, currency: 'USD' }), offer({ price: -4 }), offer({ price: NaN }), offer({ price: 0 }), offer({ price: 95 }), offer({ price: 110 })] });
  assert.deepEqual(liveOffers(p).map(o => o.price), [95, 110]);
  assert.equal(storeCount(liveOffers(p)), 1);
});
test('unsafe destinations are rejected with a valid product URL fallback', () => {
  assert.equal(isLiveOffer(offer({ affiliate_url: 'javascript:alert(1)' })), false);
  assert.equal(isLiveOffer(offer({ affiliate_url: 'https://user:pass@retailer.example' })), false);
  assert.equal(offerDestination(offer({ affiliate_url: 'invalid', product_url: 'https://retailer.example/fallback' })), 'https://retailer.example/fallback');
});
test('size and maximum price must match the same available offer', () => {
  const p = product({ offers: [offer({ price: 80, available_sizes: ['40'] }), offer({ price: 120, available_sizes: ['42'] })] });
  assert.equal(filterCatalog([p], { size: '42', max: '100' }).length, 0);
  assert.equal(filterCatalog([p], { size: '40', max: '100' }).length, 1);
});
test('filters combine and search accepts model words in any order', () => {
  const p = product({ is_new_release: true });
  assert.equal(filterCatalog([p], { q: '95 nike', brand: 'nike', gender: 'women', view: 'new' }).length, 1);
  assert.equal(filterCatalog([p], { brand: 'adidas' }).length, 0);
  assert.equal(filterCatalog([p], { view: 'deals' }).length, 0);
  assert.equal(filterCatalog([product({ offers: [offer({ old_price: 150 })] })], { view: 'deals' }).length, 1);
});
test('models without live prices stay last in both price sort directions', () => {
  const rows = [product({ id: 'empty', offers: [] }), product({ id: 'low', offers: [offer({ price: 80 })] }), product({ id: 'high', offers: [offer({ price: 120 })] })];
  assert.deepEqual(filterCatalog(rows, { sort: 'price-asc' }).map(r => r.product.id), ['low', 'high', 'empty']);
  assert.deepEqual(filterCatalog(rows, { sort: 'price-desc' }).map(r => r.product.id), ['high', 'low', 'empty']);
});
