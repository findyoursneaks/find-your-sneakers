import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bestOffer, formatMoney, getActiveBrands, getProductsByBrand, Product } from '../../../lib/data';
import { getBrandProfile } from '../../../lib/brand-config';

export async function generateStaticParams() {
  const brands = await getActiveBrands();
  return brands.map(brand => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brands = await getActiveBrands();
  const brand = brands.find(item => item.slug === slug);
  if (!brand) return { title: 'Brand not found — SOLEWAR' };
  const profile = getBrandProfile(brand.slug, brand.name);
  return {
    title: `${profile.name} — SOLEWAR`,
    description: profile.description,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brands = await getActiveBrands();
  const brand = brands.find(item => item.slug === slug);
  if (!brand) notFound();

  const profile = getBrandProfile(brand.slug, brand.name);
  const products = await getProductsByBrand(slug);
  if (!products.length) notFound();

  const hero = products.find(product => product.image_url || product.images?.[0]) || products[0];
  const style = {
    '--brand-bg': profile.theme.background,
    '--brand-surface': profile.theme.surface,
    '--brand-ink': profile.theme.ink,
    '--brand-muted': profile.theme.muted,
    '--brand-accent': profile.theme.accent,
  } as CSSProperties;

  return <main className="brand-page" style={style}>
    <div className="brand-page-nav">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <div><Link href="/brands">Brands</Link><Link href="/search">All products</Link></div>
    </div>

    <section className="brand-hero">
      <div className="brand-hero-copy">
        <span className="hero-kicker">{profile.eyebrow}</span>
        <h1>{profile.name}</h1>
        <h2>{profile.headline}</h2>
        <p>{profile.description}</p>
        <div className="brand-tags">{profile.categories.map(category => <span key={category}>{category}</span>)}</div>
      </div>
      <div className="brand-hero-media">
        {hero && <Link href={`/product/${hero.slug}`} className="brand-hero-product">
          <img src={hero.image_url || hero.images?.[0] || ''} alt={hero.name} />
          <div><small>FEATURED</small><strong>{hero.name}</strong></div>
        </Link>}
        {profile.promo && <div className="brand-promo">
          <small>{profile.promo.label}</small>
          <strong>{profile.promo.value}</strong>
          {profile.promo.code && <code>{profile.promo.code}</code>}
          <p>{profile.promo.note}</p>
        </div>}
      </div>
    </section>

    <section className="brand-products">
      <div className="brand-section-head"><div><span>LIVE CATALOGUE</span><h2>{products.length} products from {profile.name}</h2></div><Link href={`/search?brand=${encodeURIComponent(slug)}`}>View filtered catalogue →</Link></div>
      <div className="brand-product-grid">{products.map(product => <BrandProductCard key={product.id} product={product} />)}</div>
    </section>

    <section className="brand-trust">
      <div><span>SOLEWAR STANDARD</span><h2>Only live partner offers.</h2></div>
      <p>Products appear here only when SOLEWAR has an active commercial destination for the brand or retailer. Demo feeds and inactive partners stay hidden from the public catalogue.</p>
    </section>
  </main>;
}

function BrandProductCard({ product }: { product: Product }) {
  const offer = bestOffer(product);
  const image = product.image_url || product.images?.[0];
  return <article className="brand-product-card">
    <Link href={`/product/${product.slug}`}>
      <div className="brand-product-image">{image ? <img src={image} alt={`${product.brands?.name || ''} ${product.name}`} /> : <span>SOLEWAR</span>}</div>
      <small>{product.model || product.brands?.name}</small>
      <h3>{product.name}</h3>
      <strong>{offer ? formatMoney(Number(offer.price), offer.currency) : 'See product'}</strong>
    </Link>
    {offer && <Link className="brand-shop-button" href={`/go/${offer.id}`} rel="nofollow sponsored">Shop offer →</Link>}
  </article>;
}
