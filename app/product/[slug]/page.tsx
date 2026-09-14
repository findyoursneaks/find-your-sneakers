import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bestPrice, getProductBySlug } from '../../../lib/data';
import { formatPrice, liveOffers, storeCount } from '../../../lib/offers';

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Sneaker not found' };
  const title = `${product.brands?.name || ''} ${product.name}`.trim();
  const price = bestPrice(product);
  const description = price !== null ? `Compare available euro offers for ${title}, from ${formatPrice(price)}. Check sizes and retailer details.` : `Explore ${title}. Retailer offers will appear here when available.`;
  return { title: `${title} — Compare prices`, description, alternates: { canonical: `/product/${slug}` }, openGraph: { title, description, url: `https://solewar.com/product/${slug}`, images: product.image_url ? [product.image_url] : [] }, twitter: { card: 'summary' as const, title, description, images: product.image_url ? [product.image_url] : [] } };
}
export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ size?: string | string[] }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const size = Array.isArray(query.size) ? query.size[0] : query.size;
  const allOffers = liveOffers(product);
  const offers = liveOffers(product, 'EUR', size);
  const sizes = [...new Set(allOffers.flatMap(o => o.available_sizes || []))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const image = product.image_url || product.images?.[0];
  return <main className="product-page">
    <div className="product-topbar"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/search">← All sneakers</Link></div>
    <section className="product-hero">
      <div className="product-image">{image ? <img src={image} alt={`${product.brands?.name || ''} ${product.name}`} /> : <><span aria-hidden="true">👟</span><small>Product photography coming soon</small></>}</div>
      <div className="product-info"><small>{product.brands?.name}</small><h1>{product.name}</h1>{product.colorway && <p>{product.colorway}</p>}
        {offers.length > 0 ? <div className="product-price">From <strong>{formatPrice(Number(offers[0].price))}</strong></div> : <p className="catalog-notice">{allOffers.length ? 'No offers for this size.' : 'Retailer offers coming soon.'}</p>}
        <div className="product-tags">{offers.length > 0 && <span>{storeCount(offers)} {storeCount(offers) === 1 ? 'store' : 'stores'}</span>}<span>{product.gender}</span>{product.is_new_release && <span>New release</span>}</div>
        <p className="product-description">{product.description}</p>
      </div>
    </section>
    <section className="offers-section">
      <h2>Compare retailer offers</h2>
      {sizes.length > 0 && <form className="size-filter"><label>Size<select name="size" defaultValue={size || ''}><option value="">All sizes</option>{sizes.map(s => <option key={s}>{s}</option>)}</select></label><button type="submit">Filter offers</button></form>}
      <div className="offer-list">{offers.map(offer => {
        const lowest = Number(offer.price) === Number(offers[0].price);
        const previous = Number(offer.old_price ?? offer.original_price);
        return <article className="offer-row" key={offer.id}>
          <div><small>{lowest ? 'LOWEST LISTED PRICE' : 'AVAILABLE OFFER'}</small><h3>{offer.retailers.name}</h3></div>
          <div className="size-list">{(offer.available_sizes || []).map(s => <span key={s}>{s}</span>)}{!offer.available_sizes?.length && <span>Check sizes at store</span>}</div>
          <div className="offer-price"><strong>{formatPrice(Number(offer.price), offer.currency)}</strong>{previous > Number(offer.price) && <del>{formatPrice(previous, offer.currency)}</del>}</div>
          <a className="buy" href={`/go/${offer.id}`} rel="nofollow sponsored">View at store →</a>
        </article>;
      })}</div>
      {!offers.length && <div className="empty-state"><h3>{allOffers.length ? 'No offers for this size' : 'No available offers yet'}</h3><p>{allOffers.length ? 'Choose another size to see available offers.' : 'This model is part of our discovery catalogue. Prices and purchase links will appear when retailer offers are connected.'}</p><Link href={allOffers.length ? `/product/${slug}` : '/search'}>{allOffers.length ? 'Show all sizes' : 'Browse more models'}</Link></div>}
      <p className="affiliate-note">We compare available offers in EUR. Delivery charges, destination restrictions and retailer sizing systems may differ. Confirm the final price and availability at the store. SOLEWAR may earn a commission from eligible links at no extra cost to you.</p>
    </section>
  </main>;
}
