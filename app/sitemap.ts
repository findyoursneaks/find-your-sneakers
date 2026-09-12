import type { MetadataRoute } from 'next';
import { getProducts } from '../lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base='https://findyoursneakers.com';
  const products=await getProducts();
  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/legal/affiliate-disclosure`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/legal/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/legal/terms`, changeFrequency: 'monthly', priority: 0.3 },
    ...products.map(p=>({url:`${base}/product/${p.slug}`,changeFrequency:'daily' as const,priority:0.8})),
  ];
}
