import type { Product } from './data';
import { hasDiscount, liveOffers } from './offers';

export type CatalogParams = { q?: string; brand?: string; gender?: string; size?: string; sort?: string; view?: string; max?: string };
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterCatalog(products: Product[], params: CatalogParams) {
  const words = normalize(params.q || '').trim().split(/\s+/).filter(Boolean);
  const max = params.max?.trim() ? Number(params.max) : NaN;
  const rows = products.map(product => ({ product, offers: liveOffers(product, 'EUR', params.size) }))
    .filter(({ product, offers }) => {
      const hay = normalize(`${product.brands?.name || ''} ${product.name} ${product.model || ''}`);
      return words.every(word => hay.includes(word))
        && (!params.brand || product.brands?.slug === params.brand)
        && (!params.gender || product.gender === params.gender || product.gender === 'unisex')
        && (!params.size || offers.length > 0)
        && (!Number.isFinite(max) || max < 0 || offers.some(offer => Number(offer.price) <= max))
        && (params.view !== 'deals' || offers.some(hasDiscount))
        && (params.view !== 'new' || product.is_new_release)
        && (params.view !== 'available' || offers.length > 0);
    });
  rows.sort((a, b) => {
    if (params.sort === 'name') return `${a.product.brands?.name} ${a.product.name}`.localeCompare(`${b.product.brands?.name} ${b.product.name}`);
    if (params.sort === 'price-asc' || params.sort === 'price-desc') {
      if (!a.offers.length) return b.offers.length ? 1 : 0;
      if (!b.offers.length) return -1;
      return (Number(a.offers[0].price) - Number(b.offers[0].price)) * (params.sort === 'price-desc' ? -1 : 1);
    }
    return Number(Boolean(b.product.is_trending)) - Number(Boolean(a.product.is_trending));
  });
  return rows;
}
