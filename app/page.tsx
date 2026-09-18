import Link from 'next/link';
import { bestOffer, formatMoney, getActiveBrands, getProducts, Product } from '../lib/data';
import { getBrandProfile } from '../lib/brand-config';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getActiveBrands()]);
  const display = products.slice(0, 8);
  const heroPrimary = products.find(product => product.image_url || product.images?.[0]);
  const heroSecondary = products.find(product => product.id !== heroPrimary?.id && (product.image_url || product.images?.[0]));

  return <>
    <div className="topbar">
      <span>SOLEWAR</span>
      <span>Only live brands and active affiliate offers.</span>
      <span>EU</span>
    </div>
    <Header />
    <main>
      <section className="editorial-hero">
        <div className="hero-copy">
          <span className="hero-kicker">BRANDS THAT ARE ACTUALLY LIVE</span>
          <h1>MOVE<br/>DIFFERENT.</h1>
          <p>Discover approved brands, real products and active commercial links — without demo retailers pretending to be live.</p>
          <div className="hero-buttons">
            <Link className="primary" href="/brands">Explore brands →</Link>
            <Link className="secondary" href="/search">View all products</Link>
          </div>
        </div>
        <div className="hero-art product-stage">
          {heroPrimary && <Link className="hero-product hero-product-main" href={`/product/${heroPrimary.slug}`}>
            <img src={heroPrimary.image_url || heroPrimary.images?.[0] || ''} alt={heroPrimary.name} />
            <span>{heroPrimary.brands?.name}</span><b>{heroPrimary.name}</b>
          </Link>}
          {heroSecondary && <Link className="hero-product hero-product-alt" href={`/product/${heroSecondary.slug}`}>
            <img src={heroSecondary.image_url || heroSecondary.images?.[0] || ''} alt={heroSecondary.name} />
            <span>LIVE PRODUCT</span><b>{heroSecondary.name}</b>
          </Link>}
          <div className="vertical-copy">DISCOVER<br/>BRANDS<br/>COMPARE<br/>MOVE</div>
        </div>
      </section>

      <section id="brands" className="home-brands">
        <div className="home-section-head">
          <div><span>ACTIVE BRANDS</span><h2>Live on SOLEWAR now.</h2></div>
          <Link href="/brands">View all brands →</Link>
        </div>
        <div className="home-brand-grid">
          {brands.map(brand => {
            const profile = getBrandProfile(brand.slug, brand.name);
            const count = products.filter(product => product.brands?.slug === brand.slug).length;
            const sample = products.find(product => product.brands?.slug === brand.slug && (product.image_url || product.images?.[0]));
            return <Link key={brand.id} className="home-brand-card" href={`/brands/${brand.slug}`} style={{background: profile.theme.background, color: profile.theme.ink}}>
              <div><small>{profile.eyebrow}</small><h3>{profile.name}</h3><p>{profile.headline}</p><b>{count} live products →</b></div>
              {sample && <img src={sample.image_url || sample.images?.[0] || ''} alt={profile.name} />}
            </Link>;
          })}
        </div>
      </section>

      <section id="trending" className="trend-section">
        <div className="trend-head">
          <div><h2>Live products</h2><p>Every item below has an active commercial destination.</p></div>
          <Link href="/search">View all →</Link>
        </div>
        <ProductRow items={display}/>
      </section>

      <section className="brand-principle">
        <div><span>THE SOLEWAR RULE</span><h2>No fake partnerships.</h2></div>
        <p>A brand only appears as active when SOLEWAR has a real affiliate or commercial destination for it. New brands can be added without rebuilding the whole site — each receives its own branded page automatically.</p>
      </section>

      <section className="newsletter clean-newsletter">
        <div><h2>New brands. New drops. Real links.</h2><p>Get catalogue updates and newly approved partners.</p></div>
        <NewsletterForm />
      </section>
    </main>
    <Footer />
  </>;
}

function Header(){
  return <header className="nav new-nav">
    <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
    <nav>
      <Link href="/brands">Brands</Link>
      <Link href="/search">Products</Link>
      <a href="#trending">Live now</a>
      <Link href="/about">About</Link>
    </nav>
    <form className="nav-search" action="/search">
      <span>⌕</span><input name="q" aria-label="Search products" placeholder="Search live products..." />
    </form>
    <Link className="menu" href="/brands">☰</Link>
  </header>;
}

function ProductRow({items}:{items:Product[]}){
  return <div className="product-row">{items.map(product => {
    const offer = bestOffer(product);
    const image = product.image_url || product.images?.[0];
    return <article className="mini-card" key={product.id}>
      <Link href={`/product/${product.slug}`}>
        <div className="mini-visual">{image ? <img src={image} alt={`${product.brands?.name || ''} ${product.name}`}/> : <span>SOLEWAR</span>}</div>
        <div className="mini-card-copy">
          <small>{product.brands?.name}</small>
          <h3>{product.name}</h3>
          <strong>{offer ? formatMoney(Number(offer.price), offer.currency) : 'Offer unavailable'}</strong>
          <span className="view-deal">View product →</span>
        </div>
      </Link>
    </article>;
  })}</div>;
}

function Footer(){
  return <footer className="new-footer">
    <div className="footer-grid">
      <div><b className="war-logo footer-logo"><span>SOLE</span><b>WAR</b></b><p>Brand-led product discovery with active affiliate offers.</p></div>
      <div><b>Explore</b><Link href="/brands">Brands</Link><Link href="/search">Products</Link></div>
      <div><b>Help</b><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link><Link href="/legal/terms">Terms</Link></div>
      <div><b>About</b><Link href="/about">About SOLEWAR</Link><Link href="/legal/privacy">Privacy Policy</Link></div>
    </div>
    <div className="copyright">© 2026 SOLEWAR. All rights reserved. Prices, promo codes and availability may change. We may earn a commission from qualifying purchases.</div>
  </footer>;
}
