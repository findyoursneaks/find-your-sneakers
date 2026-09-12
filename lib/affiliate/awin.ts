import type { NormalizedAffiliateOffer } from './types';
import { normalizeAffiliateOffer, slugify } from './normalize';

type AwinGoogleFeedItem = {
  id?: string;
  title?: string;
  description?: string;
  link?: string;
  image_link?: string;
  brand?: string;
  price?: string | number;
  sale_price?: string | number;
  availability?: string;
  gtin?: string;
  mpn?: string;
  color?: string;
  gender?: string;
  size?: string;
  product_type?: string;
};

function parseMoney(value: string | number | undefined) {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const match = String(value).replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function mapGender(value?: string): 'men' | 'women' | 'kids' | 'unisex' {
  const v = (value || '').toLowerCase();
  if (v.includes('male') || v.includes('men')) return 'men';
  if (v.includes('female') || v.includes('women')) return 'women';
  if (v.includes('kid') || v.includes('child')) return 'kids';
  return 'unisex';
}

export async function downloadAwinEnhancedFeed(params: {
  publisherId: string;
  advertiserId: string;
  locale?: string;
  token: string;
}) {
  const locale = params.locale || 'en_GB';
  const url = `https://api.awin.com/publishers/${encodeURIComponent(params.publisherId)}/awinfeeds/download/${encodeURIComponent(params.advertiserId)}-retail-${encodeURIComponent(locale)}.jsonl`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${params.token}` },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Awin feed download failed (${response.status})`);
  }
  return response.text();
}

export function parseAwinJsonlFeed(input: string, retailer: {
  name: string;
  websiteUrl: string;
  countryCode?: string;
}): NormalizedAffiliateOffer[] {
  const rows = input.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const offers: NormalizedAffiliateOffer[] = [];

  for (const row of rows) {
    let item: AwinGoogleFeedItem;
    try { item = JSON.parse(row) as AwinGoogleFeedItem; } catch { continue; }

    const productUrl = item.link;
    const brand = item.brand?.trim();
    const name = item.title?.trim();
    const regular = parseMoney(item.price);
    const sale = parseMoney(item.sale_price);
    const effectivePrice = sale ?? regular;
    if (!productUrl || !brand || !name || effectivePrice == null || effectivePrice < 0) continue;

    offers.push(normalizeAffiliateOffer({
      retailer: {
        name: retailer.name,
        slug: slugify(retailer.name),
        websiteUrl: retailer.websiteUrl,
        countryCode: retailer.countryCode,
      },
      product: {
        brand,
        brandSlug: slugify(brand),
        name,
        slug: slugify(`${brand}-${name}-${item.id || item.mpn || item.gtin || ''}`),
        model: item.mpn || item.id,
        gender: mapGender(item.gender),
        colorway: item.color,
        imageUrl: item.image_link,
        gtinEan: item.gtin,
        mpnSku: item.mpn,
      },
      offer: {
        price: effectivePrice,
        oldPrice: sale != null && regular != null && regular >= sale ? regular : undefined,
        currency: 'EUR',
        productUrl,
        affiliateUrl: productUrl,
        inStock: !/(out of stock|unavailable)/i.test(item.availability || ''),
        sizes: item.size ? [item.size] : [],
        countryCode: retailer.countryCode || 'EU',
      },
    }));
  }

  return offers;
}
