import Link from 'next/link';
import { bestOffer, formatMoney, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const display = products.slice(0, 8);
  const heroPrimary = products.find(p => p.image_url || p.images?.[0]);
  const heroSecondary = products.find(p => p.id !== heroPrimary?.id && (p.image_url || p.images?.[0]));

  return <>
    <div className="topbar">
      <span>Live affiliate catalogue</span>
      <span>Only active products and approved partner links are shown.</span>
      <span>EU</span>
    </div>
    <Header />
    <main>
      <section className="editorial-hero">
        <div className="hero-copy">
          <span className="hero-kicker">SOLEWAR × MOOSEHILL</span>
          <h1>MOVE<br/>DIFFERENT.</h1>
          <p>Discover live outdoor products with real photography, current listed prices and direct affiliate shopping links.</p>
          <div className="hero-buttons">
            <Link className="primary" href="/outdoor">Explore Moosehill →</Link>
            <Link className="secondary" href="/search">View all live products</Link>
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
          <div className="vertical-copy">DISCOVER<br/>COMPARE<br/>MOVE<br/>SMARTER</div>
        </div>
      </section>

      <section id="brands" className="brand-strip">
        <Link href="/outdoor"><b>Moosehill</b></Link>
        <Link href="/about">More brands after approval</Link>
      </section>

      <section className="category-showcase">
        <Link href="/outdoor" className="category-tile category-outdoor">
          <span>01</span>
          <div><small>LIVE NOW</small><h2>Moosehill outdoor gear.</h2><p>Hiking, cycling and activewear with current products, photography and affiliate links.</p></div>
          <b>Explore →</b>
        </Link>
        <Link href="/about" className="category-tile category-sneakers">
          <span>02</span>
          <div><small>COMING NEXT</small><h2>More approved brands.</h2><p>Sneaker and lifestyle brands will only appear when their commercial feeds or affiliate links are genuinely active.</p></div>
          <b>About SOLEWAR →</b>
        </Link>
      </section>

      <section className="outdoor-feature">
        <div className="outdoor-copy">
          <span className="hero-kicker">ACTIVE PARTNER</span>
          <h2>Moosehill is live on SOLEWAR.</h2>
          <p>Browse real product photography, live catalogue items and direct affiliate shopping links. No demo retailers are shown to visitors.</p>
          <div className="hero-buttons">
            <Link className="primary" href="/outdoor">Explore Moosehill →</Link>
            <Link className="secondary" href="/search">View products</Link>
          </div>
        </div>
        <div className="outdoor-offer">
          {heroPrimary?.image_url && <Link href={`/product/${heroPrimary.slug}`} className="outdoor-feature-image"><img src={heroPrimary.image_url} alt={heroPrimary.name}/></Link>}
          <span>SOLEWAR AUDIENCE OFFER</span><strong>15% OFF</strong><code>SAS15</code>
          <small>Use on eligible Moosehill purchases. Merchant terms and availability apply.</small>
        </div>
      </section>

      <section id="trending" className="trend-section">
        <div className="trend-head"><div><h2>Live products</h2><p>Products currently connected to an active affiliate offer.</p></div><Link href="/search">View all →</Link></div>
        <ProductRow items={display}/>
      </section>

      <section className="promo">
        <div><h2>Real products. Real links.</h2><p>SOLEWAR only surfaces commercial products when the partner connection is active.</p><Link href="/outdoor">Explore Now</Link></div>
        {heroSecondary?.image_url?<Link href={`/product/${heroSecondary.slug}`} className="promo-product"><img src={heroSecondary.image_url} alt={heroSecondary.name}/></Link>:null}
        <b>SOLE<br/>WAR</b>
      </section>

      <section id="how" className="compact-how">
        <div><span>HOW SOLEWAR WORKS</span><h2>Discover. Compare. Go.</h2></div>
        <p>SOLEWAR connects product discovery with approved affiliate offers. When you buy through an eligible partner link, SOLEWAR may earn a commission at no extra cost to you.</p>
      </section>

      <section className="newsletter clean-newsletter">
        <div><h2>Get new products & partner drops</h2><p>Live catalogue updates, deals and newly approved brands.</p></div>
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
      <Link href="/search">Products</Link>
      <Link href="/outdoor">Outdoor</Link>
      <a href="#brands">Brands</a>
      <a href="#trending">Live now</a>
      <Link href="/about">About</Link>
    </nav>
    <form className="nav-search" action="/search">
      <span>⌕</span><input name="q" aria-label="Search products" placeholder="Search live products..." />
    </form>
    <Link className="menu" href="/search">☰</Link>
  </header>;
}

function ProductRow({items}:{items:Product[]}){
  return <div className="product-row">{items.map(p=>{
    const offer=bestOffer(p);
    const image=p.image_url||p.images?.[0];
    return <article className="mini-card" key={p.id}>
      <Link href={`/product/${p.slug}`}>
        <div className="mini-visual">{image?<img src={image} alt={`${p.brands?.name||''} ${p.name}`}/>:<span>SOLEWAR</span>}</div>
        <div className="mini-card-copy"><small>{p.brands?.name}</small><h3>{p.name}</h3><strong>{offer?formatMoney(Number(offer.price),offer.currency):'Offer unavailable'}</strong><span className="view-deal">View product →</span></div>
      </Link>
    </article>;
  })}</div>;
}

function Footer(){
  return <footer className="new-footer">
    <div className="footer-grid">
      <div><b className="war-logo footer-logo"><span>SOLE</span><b>WAR</b></b><p>Curated product discovery with active affiliate offers.</p></div>
      <div><b>Explore</b><Link href="/search">Products</Link><Link href="/outdoor">Outdoor</Link></div>
      <div><b>Help</b><a href="#how">How it works</a><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link><Link href="/legal/terms">Terms</Link></div>
      <div><b>About</b><Link href="/about">About SOLEWAR</Link><Link href="/legal/privacy">Privacy Policy</Link></div>
    </div>
    <div className="copyright">© 2026 SOLEWAR. All rights reserved. Prices, promo codes and availability may change. We may earn a commission from qualifying purchases.</div>
  </footer>;
}
