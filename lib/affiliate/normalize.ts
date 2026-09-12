import type { NormalizedAffiliateOffer } from './types';

export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidAffiliateOffer(value: NormalizedAffiliateOffer) {
  return Boolean(
    value?.retailer?.name &&
    value?.retailer?.slug &&
    value?.retailer?.websiteUrl &&
    value?.product?.brand &&
    value?.product?.name &&
    value?.product?.slug &&
    Number.isFinite(value?.offer?.price) &&
    value.offer.price >= 0 &&
    /^https?:\/\//i.test(value?.offer?.productUrl || '') &&
    /^https?:\/\//i.test(value?.offer?.affiliateUrl || '')
  );
}

export function normalizeAffiliateOffer(input: NormalizedAffiliateOffer): NormalizedAffiliateOffer {
  return {
    retailer: {
      ...input.retailer,
      slug: input.retailer.slug || slugify(input.retailer.name),
      countryCode: input.retailer.countryCode?.toUpperCase(),
    },
    product: {
      ...input.product,
      brandSlug: input.product.brandSlug || slugify(input.product.brand),
      slug: input.product.slug || slugify(`${input.product.brand}-${input.product.name}`),
      gender: input.product.gender || 'unisex',
    },
    offer: {
      ...input.offer,
      currency: (input.offer.currency || 'EUR').toUpperCase(),
      inStock: input.offer.inStock ?? true,
      sizes: input.offer.sizes || [],
      countryCode: (input.offer.countryCode || 'EU').toUpperCase(),
      lastCheckedAt: input.offer.lastCheckedAt || new Date().toISOString(),
    },
  };
}
