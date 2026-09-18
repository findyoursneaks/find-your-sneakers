import Link from 'next/link';
import { bestOffer, formatMoney, getBrands, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const trending = products.filter(p => p.is_trending).slice(0, 8);
  const display = trending.length ? trending : products.slice(0, 8);
  const moosehill = brands.find(b => b.slug === 'moosehill');
  const brandDisplay = [moosehill, ...brands.filter(b => b.slug !== 'moosehill')].filter(Boolean).slice(0, 9) as typeof brands;

  return <>
    <div className="topbar"><span>Footwear. Outdoor. Better deals.</span><span>Curated products, price discovery and affiliate offers in one place.</span><span>EU</span></div>
    <Header />
    <main>
      <section className="editorial-hero">
        <div className="hero-copy"><span className="hero-kicker">SNEAKERS. OUTDOOR. DEALS. ONE PLACE.</span><h1>SOLEWAR</h1><p>Discover sneakers and outdoor performance gear.<br/>Compare offers, find useful promotions and shop smarter.</p><div className="hero-buttons"><Link className="primary" href="/search">Explore products →</Link><Link className="secondary" href="/outdoor">Outdoor gear</Link></div></div>
        <div className="hero-art"><div className="hero-shoe">👟</div><div className="vertical-copy">MOVE<br/>OUTSIDE<br/>SHOP<br/>SMARTER</div></div>
      </section>

      <section id="brands" className="brand-strip">{brandDisplay.map(b=><Link key={b.id} href={b.slug==='moosehill'?'/outdoor':`/search?brand=${encodeURIComponent(b.slug)}`}><b>{b.name}</b></Link>)}<Link href="/search">View all →</Link></section>

      <section className="outdoor-feature">
        <div className="outdoor-copy"><span className="hero-kicker">FEATURED OUTDOOR BRAND</span><h2>Moosehill joins the SOLEWAR mix.</h2><p>Hiking, cycling and active-lifestyle apparel now sit alongside our sneaker catalogue. Start with selected HikerFlex styles and the current affiliate audience promotion.</p><div className="hero-buttons"><Link className="primary" href="/outdoor">Explore Moosehill →</Link><Link className="secondary" href="/search?brand=moosehill">View products</Link></div></div>
        <div className="outdoor-offer"><span>OUTDOOR OFFER</span><strong>15% OFF</strong><code>SAS15</code><small>Use at MoosehillStore.com · offer terms and availability may change.</small></div>
      </section>

      <section id="trending" className="trend-section"><div className="trend-head"><div><h2>Trending now</h2><p>Sneakers and outdoor picks currently featured on SOLEWAR.</p></div><Link href="/search">View all →</Link></div><ProductRow items={display}/></section>

      <section className="promo"><div><h2>Built for what moves you.</h2><p>Streetwear, performance footwear and outdoor essentials — with clearer paths to the right deal.</p><Link href="/search">Explore Now</Link></div><div className="promo-shoe">🥾</div><b>SOLE<br/>WAR</b></section>

      <section id="how" className="compact-how"><div><span>HOW SOLEWAR WORKS</span><h2>Discover. Compare. Go.</h2></div><p>SOLEWAR brings together product discovery, retailer offers and selected affiliate promotions. When you buy through an eligible retailer link, SOLEWAR may earn a commission at no extra cost to you.</p></section>

      <section className="newsletter clean-newsletter"><div><h2>Get the latest drops & deals</h2><p>Sneakers, outdoor gear, price drops and new partner offers.</p></div><NewsletterForm /></section>
    </main><Footer />
  </>;
}

function Header(){return <header className="nav new-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><nav><Link href="/search">Products</Link><Link href="/outdoor">Outdoor</Link><a href="#brands">Brands</a><Link href="/deals/under-100">Deals</Link><a href="#trending">Trending</a><Link href="/about">About</Link></nav><form className="nav-search" action="/search"><span>⌕</span><input name="q" aria-label="Search products" placeholder="Search sneakers, outdoor gear or brands..."/></form><Link className="menu" href="/search">☰</Link></header>}

function ProductRow({items}:{items:Product[]}){return <div className="product-row">{items.map(p=>{const offer=bestOffer(p);const image=p.image_url||p.images?.[0];const outdoor=p.brands?.slug==='moosehill';return <article className="mini-card" key={p.id}><Link href={outdoor?'/outdoor':`/product/${p.slug}`}><div className="mini-visual">{image?<img src={image} alt={`${p.brands?.name||''} ${p.name}`}/>:<span>{outdoor?'🥾':'👟'}</span>}</div><h3>{p.brands?.name} {p.name}</h3><strong>{offer?formatMoney(Number(offer.price),offer.currency):'Offer coming soon'}</strong><small>{p.offers?.length?`${p.offers.length} offer${p.offers.length===1?'':'s'} available`:'SOLEWAR'}</small><span className="view-deal">View Deal</span></Link></article>})}</div>}

function Footer(){return <footer className="new-footer"><div className="footer-grid"><div><b className="war-logo footer-logo"><span>SOLE</span><b>WAR</b></b><p>Footwear, outdoor gear and better deal discovery.</p></div><div><b>Explore</b><Link href="/search">Products</Link><Link href="/outdoor">Outdoor</Link><Link href="/deals/under-100">Deals</Link></div><div><b>Help</b><a href="#how">How it works</a><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link><Link href="/legal/terms">Terms</Link></div><div><b>About</b><Link href="/about">About SOLEWAR</Link><Link href="/legal/privacy">Privacy Policy</Link></div></div><div className="copyright">© 2026 SOLEWAR. All rights reserved. Prices, promo codes and availability may change. We may earn a commission from qualifying purchases.</div></footer>}
