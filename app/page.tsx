import Link from 'next/link';
import { bestPrice, getBrands, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const trending = products.filter(p => p.is_trending).slice(0, 8);
  const display = trending.length ? trending : products.slice(0, 8);
  return <>
    <div className="topbar"><span>Compare. Choose. Wear Better.</span><span>Free to use. We find the best sneaker deals for you.</span><span>PT</span></div>
    <Header />
    <main>
      <section className="editorial-hero">
        <div className="hero-copy"><span className="hero-kicker">ALL SNEAKERS. ALL DEALS. ONE PLACE.</span><h1>Find Your Sneakers</h1><p>Compare prices from the best stores. Discover new releases.<br/>Save money. Wear what moves you.</p><div className="hero-buttons"><Link className="primary" href="/search">Explore Sneakers →</Link><Link className="secondary" href="/deals/under-100">Sneakers under €100</Link></div></div>
        <div className="hero-art"><div className="hero-shoe">👟</div><div className="vertical-copy">MORE<br/>BRANDS<br/>BETTER<br/>DEALS</div></div>
      </section>

      <section id="brands" className="brand-strip">{brands.slice(0,9).map(b=><Link key={b.id} href={`/search?brand=${encodeURIComponent(b.slug)}`}><b>{b.name}</b></Link>)}<a href="#brands">View all brands →</a></section>

      <section id="trending" className="trend-section"><div className="trend-head"><div><h2>Trending Sneakers</h2><p>The most popular sneakers right now. Updated daily.</p></div><Link href="/search">View all →</Link></div><ProductRow items={display}/></section>

      <section className="promo"><div><h2>Engineered for what’s next.</h2><p>Performance meets style. Compare the latest sneakers across stores.</p><Link href="/search?q=On%20Cloud">Shop Now</Link></div><div className="promo-shoe">👟</div><b>SOLE<br/>WAR</b></section>

      <section id="how" className="compact-how"><div><span>HOW SOLEWAR WORKS</span><h2>More stores. Better prices.</h2></div><p>We compare retailer offers so you can choose the strongest available deal. When you buy through an eligible retailer link, SOLEWAR may earn a commission at no extra cost to you.</p></section>

      <section className="newsletter clean-newsletter"><div><h2>Get the latest sneaker deals</h2><p>Price drops, new releases and winning deals.</p></div><NewsletterForm /></section>
    </main><Footer />
  </>;
}

function Header(){return <header className="nav new-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><nav><Link href="/search">Sneakers</Link><a href="#brands">Brands</a><Link href="/deals/under-100">Deals</Link><a href="#trending">New Releases</a><a href="#how">Guides</a><Link href="/about">About</Link></nav><form className="nav-search" action="/search"><span>⌕</span><input name="q" aria-label="Search sneakers" placeholder="Search sneakers, brands or models..."/></form><Link className="menu" href="/search">☰</Link></header>}

function ProductRow({items}:{items:Product[]}){return <div className="product-row">{items.map(p=>{const price=bestPrice(p);const image=p.image_url||p.images?.[0];return <article className="mini-card" key={p.id}><Link href={`/product/${p.slug}`}><div className="mini-visual">{image?<img src={image} alt={`${p.brands?.name||''} ${p.name}`}/>:<span>👟</span>}</div><h3>{p.brands?.name} {p.name}</h3><strong>{price?`€${price.toFixed(2)}`:'Price battle soon'}</strong><small>{p.offers?.length?`${p.offers.length} stores competing`:'SOLEWAR'}</small><span className="view-deal">View Deal</span></Link></article>})}</div>}

function Footer(){return <footer className="new-footer"><div className="footer-grid"><div><b className="war-logo footer-logo"><span>SOLE</span><b>WAR</b></b><p>Find better deals. Wear a better tomorrow.</p></div><div><b>Shop</b><Link href="/search">Sneakers</Link><a href="#brands">Brands</a><Link href="/deals/under-100">Deals</Link></div><div><b>Help</b><a href="#how">How it works</a><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link><Link href="/legal/terms">Terms</Link></div><div><b>About</b><Link href="/about">About SOLEWAR</Link><Link href="/legal/privacy">Privacy Policy</Link></div></div><div className="copyright">© 2026 SOLEWAR. All rights reserved. Prices and availability may change. We may earn a commission from qualifying purchases.</div></footer>}
