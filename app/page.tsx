import Link from 'next/link';
import { bestPrice, getBrands, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const trending = products.filter(p => p.is_trending).slice(0, 4);
  const newReleases = products.filter(p => p.is_new_release).slice(0, 4);
  const deals = products.map(p => ({ product: p, price: bestPrice(p), old: Math.max(...(p.offers || []).map(o => Number(o.old_price || o.original_price || 0))) })).filter(x => x.price && x.old > (x.price || 0)).sort((a,b) => (b.old-(b.price||0))-(a.old-(a.price||0))).slice(0,3);

  return <>
    <Header />
    <main>
      <section className="hero battle-hero">
        <div className="brand-mark" aria-label="SOLEWAR"><span>SOLE</span><i>WAR</i></div>
        <span className="eyebrow">THE SNEAKER PRICE BATTLE</span>
        <h1>Every pair. Every price.<br/><span>One winner.</span></h1>
        <p>One sneaker. Multiple stores. SOLEWAR puts the offers head-to-head so you can find the winning price.</p>
        <form className="search" action="/search">
          <span>⌕</span><input name="q" placeholder="Enter the sneaker you want..." aria-label="Search sneakers" /><button>Start the battle</button>
        </form>
        <div className="popular">Popular battles: {['Nike Air Max','Air Jordan','adidas Samba','New Balance 550','ASICS Gel-Kayano','On Cloud'].map(x=><Link key={x} href={`/search?q=${encodeURIComponent(x)}`}>{x}</Link>)}</div>
      </section>

      <section id="trending" className="section"><div className="title"><div><span>IN THE ARENA</span><h2>Trending Battles</h2></div><Link className="link" href="/search">See all sneakers →</Link></div><ProductGrid items={trending.length ? trending : products.slice(0,4)} /></section>

      <section id="deals" className="dark"><div className="section"><div className="title inverse"><div><span>PRICE BATTLE</span><h2>Winning Prices Right Now</h2></div><Link className="link" href="/search">Enter the arena →</Link></div><p className="demo-note">Prices in the current development catalogue are demo data and will be replaced by authorised retailer and affiliate feeds before commercial launch.</p><div className="dealgrid">{deals.map(({product:p,price,old})=><article className="deal" key={p.id}><div className="dealvisual"><b>WIN €{(old-(price||0)).toFixed(0)}</b><span>👟</span></div><small>{p.brands?.name}</small><h3>{p.name}</h3><div><strong>€{price?.toFixed(2)}</strong> <del>€{old.toFixed(2)}</del></div><Link className="deal-button" href={`/product/${p.slug}`}>View price battle</Link></article>)}</div></div></section>

      <section id="brands" className="section"><div className="title"><div><span>CHOOSE YOUR SIDE</span><h2>Battle by Brand</h2></div></div><div className="brands">{brands.map(b=><Link key={b.id} href={`/search?brand=${encodeURIComponent(b.slug)}`}>{b.name}</Link>)}</div></section>

      <section id="new" className="section"><div className="title"><div><span>NEW CHALLENGERS</span><h2>Just Entered the Arena</h2></div><Link className="link" href="/search">See all →</Link></div><ProductGrid items={newReleases.length ? newReleases : products.slice(-4)} /></section>

      <section className="how"><span>HOW SOLEWAR WORKS</span><h2>Stores compete. You win.</h2><p>The same sneaker can have very different prices. We bring the offers into one battle.</p><div className="steps">{[['01','Choose your pair','Search the sneaker you want.'],['02','Start the battle','Compare offers from different stores.'],['03','Find the winner','Spot the strongest available price.'],['04','Claim the deal','Go directly to the retailer to buy.']].map(s=><div key={s[0]}><b>{s[0]}</b><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></section>

      <section className="newsletter"><div><span>PRICE DROP INTEL</span><h2>Know when the price falls.</h2><p>Winning prices, new releases and sneaker deals — straight to your inbox.</p></div><NewsletterForm /></section>
    </main><Footer />
  </>;
}

function Header(){return <header className="nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><nav><Link href="/search">Sneakers</Link><a href="#deals">Price Battles</a><a href="#brands">Brands</a><Link href="/search?gender=men">Men</Link><Link href="/search?gender=women">Women</Link><a href="#new">New Drops</a></nav><div className="actions"><Link href="/search" aria-label="Search">⌕</Link><span aria-label="Wishlist">♡</span><span aria-label="Account">◯</span></div></header>}

function ProductGrid({items}:{items:Product[]}){return <div className="grid">{items.map(p=>{const price=bestPrice(p);return <article className="card" key={p.id}><Link href={`/product/${p.slug}`}><div className="visual"><span className="badge">{p.is_new_release?'New challenger':p.is_trending?'Hot battle':'Price battle'}</span><div className="shoe">👟</div></div><small>{p.brands?.name}</small><h3>{p.name}</h3><p>{price ? <>Winning price <strong>€{price.toFixed(2)}</strong></> : 'Battle coming soon'}</p><span>{p.offers?.length || 0} stores competing</span><span className="compare">View battle <b>→</b></span></Link></article>})}</div>}

function Footer(){return <footer><div className="footbrand"><b className="war-logo"><span>SOLE</span><b>WAR</b></b><p>Every pair. Every price.<br/>One winner.</p></div><div className="footlinks"><Link href="/about">About</Link><a href="#">How it works</a><a href="#brands">Brands</a><Link href="/legal/affiliate-disclosure">Affiliate Disclosure</Link><Link href="/legal/privacy">Privacy Policy</Link><Link href="/legal/terms">Terms</Link></div><div className="copyright">© 2026 SOLEWAR. Compare before you buy. We may earn a commission from eligible retailer links.</div></footer>}
