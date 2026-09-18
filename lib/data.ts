const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwbrmjchqcpvcvvrgfvh.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_XB79v_WDUxiI-0LH2NixeQ_H0Rt70O1';

const headers = {
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json',
};

export type Brand = { id: string; name: string; slug: string; logo_url?: string | null };
export type Retailer = { id: string; name: string; slug: string; affiliate_enabled: boolean };
export type Offer = {
  id: string;
  price: number;
  old_price?: number | null;
  original_price?: number | null;
  currency: string;
  in_stock: boolean;
  available_sizes: string[];
  affiliate_url: string;
  product_url: string;
  retailers: Retailer;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  model: string;
  gender: string;
  colorway?: string | null;
  description?: string | null;
  image_url?: string | null;
  images?: string[];
  is_trending?: boolean;
  is_new_release?: boolean;
  release_date?: string | null;
  brands: Brand;
  offers: Offer[];
};

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const requestHeaders = new Headers(headers);
  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => requestHeaders.set(key, value));
  }

  const options: RequestInit = {
    ...init,
    headers: requestHeaders,
  };

  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const isGet = !init?.method || init.method.toUpperCase() === 'GET';
  const response = isGet
    ? await fetch(url, { ...options, next: { revalidate: 300 } })
    : await fetch(url, options);

  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

const productSelect = 'id,name,slug,model,gender,colorway,description,image_url,images,is_trending,is_new_release,release_date,brands(id,name,slug,logo_url),offers(id,price,old_price,original_price,currency,in_stock,available_sizes,affiliate_url,product_url,retailers(id,name,slug,affiliate_enabled))';

export async function getProducts(): Promise<Product[]> {
  return supabaseFetch<Product[]>(`products?select=${encodeURIComponent(productSelect)}&order=created_at.desc`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await supabaseFetch<Product[]>(`products?select=${encodeURIComponent(productSelect)}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] || null;
}

export async function getBrands(): Promise<Brand[]> {
  return supabaseFetch<Brand[]>('brands?select=id,name,slug,logo_url&order=name.asc');
}

export function bestOffer(product: Product): Offer | null {
  const live = (product.offers || [])
    .filter(o => o.in_stock)
    .sort((a,b) => Number(a.price) - Number(b.price));
  return live[0] || null;
}

export function bestPrice(product: Product): number | null {
  const offer = bestOffer(product);
  return offer ? Number(offer.price) : null;
}

export function formatMoney(value: number, currency = 'EUR') {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export async function addNewsletterSubscriber(email: string) {
  return supabaseFetch<void>('newsletter_subscribers', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function trackClick(offerId: string, referrer?: string | null) {
  return supabaseFetch<void>('click_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ offer_id: offerId, referrer: referrer || null }),
  });
}

export async function getOffer(offerId: string): Promise<(Offer & { product_id: string }) | null> {
  const rows = await supabaseFetch<(Offer & { product_id: string })[]>(`offers?select=id,product_id,price,currency,in_stock,affiliate_url,product_url,retailers(id,name,slug,affiliate_enabled)&id=eq.${encodeURIComponent(offerId)}&limit=1`);
  return rows[0] || null;
}
