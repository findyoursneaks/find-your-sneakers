export type NormalizedAffiliateOffer = {
  retailer: {
    name: string;
    slug: string;
    websiteUrl: string;
    countryCode?: string;
  };
  product: {
    brand: string;
    brandSlug: string;
    name: string;
    slug: string;
    model?: string;
    description?: string;
    gender?: 'men' | 'women' | 'kids' | 'unisex';
    colorway?: string;
    imageUrl?: string;
    gtinEan?: string;
    mpnSku?: string;
  };
  offer: {
    price: number;
    oldPrice?: number;
    currency?: string;
    productUrl: string;
    affiliateUrl: string;
    inStock?: boolean;
    sizes?: string[];
    countryCode?: string;
    lastCheckedAt?: string;
  };
};
