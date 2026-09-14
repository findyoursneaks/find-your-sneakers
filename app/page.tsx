import Link from 'next/link';
import { bestPrice, getBrands, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';
import { formatPrice, liveOffers, storeCount } from '../lib/offers';

export const revalidate = 300;
export const metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const trending = products.filter(p => p.is_trending).slice(0, 8);
  const display = trending.length ? trending : products.slice(0, 8);
  return <>
    <div className="topbar"><span>Compare. Choose. Wear Better.</span><span>Free to explore. Compare offers when available.</span><span>Europe · EUR</span></div>
    <Header />
    <main>
      {!products.some(p=>liveOffers(p).length)&&<p className="catalog-notice home-notice">Our model catalogue is open to explore. Live retailer offers are coming soon.</p>}
      <section className="editorial-hero">
        <div className="hero-copy"><span className="hero-kicker">DISCOVER YOUR NEXT PAIR.</span><h1>Find Your Sneakers</h1><p>Explore sneaker models. Compare available retailer offers.<br/>Find your style. Wear what moves you.</p><div className="hero-buttons"><Link className="primary" href="/search">Explore Sneakers →</Link><Link className="secondary" href="/search?view=deals">View Deals</Link></div></div>
        <div className="hero-art"><div className="hero-shoe">👟</div><div className="vertical-copy">MORE<br/>BRANDS<br/>BETTER<br/>DEALS</div></div>
      </section>

      <section id="brands" className="brand-strip">{brands.slice(0,9).map(b=><Link key={b.id} href={`/search?brand=${encodeURIComponent(b.slug)}`}><b>{b.name}</b></Link>)}<Link href="/search">View all brands →</Link></section>

      <section id="trending" className="trend-section"><div className="trend-head"><div><h2>Featured Sneakers</h2><p>Explore selected models. Live offers appear when available.</p></div><Link href="/search">View all →</Link></div><ProductRow items={display}/></section>

      <section className="promo"><div><h2>Engineered for what’s next.</h2><p>Performance meets style. Compare the latest sneakers across stores.</p><Link href="/search?q=On%20Cloud">Explore On</Link></div><div className="promo-shoe">👟</div><b>SOLE<br/>WAR</b></section>

      <section id="how" className="compact-how"><div><span>HOW SOLEWAR WORKS</span><h2>More stores. Better prices.</h2></div><p>We compare retailer offers so you can choose the strongest available deal. When you buy through an eligible retailer link, SOLEWAR may earn a commission at no extra cost to you.</p></section>

      <section className="newsletter clean-newsletter"><div><h2>Get the latest sneaker deals</h2><p>Price drops, new releases and winning deals.</p></div><NewsletterForm /></section>
    </main><Footer />
  </>;
}

function Header(){return <header className="nav new-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><nav><Link href="/search">Sneakers</Link><a href="#brands">Brands</a><Link href="/search?view=deals">Deals</Link><Link href="/search?view=new">New Releases</Link><a href="#how">How it works</a><Link href="/about">About</Link></nav><form className="nav-search" action="/search"><span>⌕</span><input name="q" aria-label="Search sneakers" placeholder="Search sneakers, brands or models..."/></form><details className="mobile-menu"><summary aria-label="Open navigation">☰</summary><nav><Link href="/search">Sneakers</Link><Link href="/search?view=deals">Deals</Link><Link href="/search?view=new">New releases</Link><Link href="/about">About</Link><a href="mailto:hello@solewar.com">Contact</a></nav></details></header>}

function ProductRow({items}:{items:Product[]}){return <div className="product-row">{items.map(p=>{const price=bestPrice(p);const count=storeCount(liveOffers(p));const image=p.image_url||p.images?.[0];return <article className="mini-card" key={p.id}><Link href={`/product/${p.slug}`}><div className="mini-visual">{image?<img src={image} loading="lazy" alt={`${p.brands?.name||''} ${p.name}`}/>:<span>👟</span>}</div><h3>{p.brands?.name} {p.name}</h3><strong>{price!==null?`From ${formatPrice(price)}`:'Offers coming soon'}</strong><small>{count?`${count} ${count===1?'store':'stores'}`:'Discover this model'}</small><span className="view-deal">{count?'Compare offers':'Explore model'}</span></Link></article>})}</div>}

function Footer(){return <footer className="new-footer"><div className="footer-grid"><div><b className="war-logo footer-logo"><span>SOLE</span><b>WAR</b></b><p>Find better deals. Wear a better tomorrow.</p></div><div><b>Shop</b><Link href="/search">Sneakers</Link><a href="#brands">Brands</a><Link href="/search?view=deals">Deals</Link></div><div><b>Help</b><a href="#how">How it works</a><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link><Link href="/legal/terms">Terms</Link></div><div><b>About</b><Link href="/about">About SOLEWAR</Link><Link href="/legal/privacy">Privacy Policy</Link><a href="mailto:hello@solewar.com">hello@solewar.com</a></div></div><div className="copyright">© 2026 SOLEWAR. All rights reserved. Prices and availability may change. We may earn a commission from qualifying purchases.</div></footer>}
