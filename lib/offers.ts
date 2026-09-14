import type { Offer, Product } from './data';

// The current catalogue uses affiliate_enabled=false for demo retailers.
// Exclude those rows from public prices and purchase routes.
export function offerDestination(offer: Offer): string | null {
  for (const value of [offer.affiliate_url, offer.product_url]) {
    try {
      const url = new URL(value);
      if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
    } catch { /* Missing or malformed retailer URL. */ }
  }
  return null;
}

export function isLiveOffer(offer: Offer): boolean {
  return offer.retailers?.affiliate_enabled === true && offer.in_stock === true
    && offer.price !== null && offer.price !== undefined && String(offer.price).trim() !== ''
    && Number.isFinite(Number(offer.price)) && Number(offer.price) > 0
    && /^[A-Z]{3}$/.test(offer.currency || '') && offerDestination(offer) !== null;
}

export function liveOffers(product: Product, currency = 'EUR', size?: string): Offer[] {
  return (product.offers || []).filter(offer => isLiveOffer(offer)
    && offer.currency === currency && (!size || (offer.available_sizes || []).includes(size)))
    .sort((a, b) => Number(a.price) - Number(b.price));
}

export function storeCount(offers: Offer[]): number {
  return new Set(offers.map(offer => offer.retailers.id)).size;
}

export function formatPrice(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(value);
}

export function hasDiscount(offer: Offer): boolean {
  const previous = Number(offer.old_price ?? offer.original_price);
  return isLiveOffer(offer) && Number.isFinite(previous) && previous > Number(offer.price);
}
