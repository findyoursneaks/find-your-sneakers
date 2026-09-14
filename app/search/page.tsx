import Link from 'next/link';
import { getBrands, getProducts } from '../../lib/data';
import { CatalogParams, filterCatalog } from '../../lib/catalog';
import { formatPrice, liveOffers, storeCount } from '../../lib/offers';

export const revalidate = 300;
export const metadata = { title: 'Browse and compare sneakers', alternates: { canonical: '/search' }, robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const params: CatalogParams = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const rows = filterCatalog(products, params);
  const sizes = [...new Set(products.flatMap(p => liveOffers(p).flatMap(o => o.available_sizes || [])))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const hasLive = products.some(p => liveOffers(p).length);
  return <main className="catalog-page">
    <div className="catalog-head">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <h1>Find your next pair.</h1>
      <p>Discover models and compare available retailer offers in euros.</p>
      <form className="catalog-filters" action="/search">
        <label className="query-field">Search sneakers<input name="q" defaultValue={params.q || ''} placeholder="Nike Air Max, Samba, Cloud…" /></label>
        <label>Brand<select name="brand" defaultValue={params.brand || ''}><option value="">All brands</option>{brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}</select></label>
        <label>For<select name="gender" defaultValue={params.gender || ''}><option value="">Everyone</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option></select></label>
        <label>Size<select name="size" defaultValue={params.size || ''}><option value="">All sizes</option>{sizes.map(size => <option key={size}>{size}</option>)}</select></label>
        <label>Maximum price (€)<input name="max" type="number" min="0" step="0.01" placeholder="Any price" defaultValue={params.max || ''} /></label>
        <label>Show<select name="view" defaultValue={params.view || ''}><option value="">All models</option><option value="available">Available offers</option><option value="deals">Price reductions</option><option value="new">New releases</option></select></label>
        <label>Sort by<select name="sort" defaultValue={params.sort || ''}><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></label>
        <div className="filter-actions"><button type="submit">Apply filters</button><Link href="/search">Clear filters</Link></div>
      </form>
    </div>
    {!hasLive && <p className="catalog-notice">Explore our model catalogue. Retailer offers are not available yet; prices will appear when live offers are connected.</p>}
    <div className="catalog-meta"><strong>{rows.length}</strong> {rows.length === 1 ? 'model' : 'models'}{params.q && <> matching “{params.q}”</>}</div>
    <div className="catalog-grid">{rows.map(({ product: p, offers }) => {
      const image = p.image_url || p.images?.[0];
      const count = storeCount(offers);
      return <Link className="catalog-card" key={p.id} href={`/product/${p.slug}${params.size ? `?size=${encodeURIComponent(params.size)}` : ''}`}>
        <div className="catalog-visual">{image ? <img src={image} loading="lazy" alt={`${p.brands?.name || ''} ${p.name}`} /> : <span aria-hidden="true">👟</span>}</div>
        <small>{p.brands?.name}</small><h2>{p.name}</h2>
        <p>{offers.length ? <>From <strong>{formatPrice(Number(offers[0].price))}</strong></> : 'Offers coming soon'}</p>
        <span>{count ? `${count} ${count === 1 ? 'store' : 'stores'} · Compare offers →` : 'Explore model →'}</span>
      </Link>;
    })}</div>
    {!rows.length && <div className="empty-state"><h2>No models match these filters</h2><p>Try a different search or remove a filter.</p><Link href="/search">View all sneakers</Link></div>}
    <p className="affiliate-note">Prices exclude delivery unless the retailer states otherwise. Check the retailer’s final price, sizing system and delivery destination before purchasing.</p>
  </main>;
}
