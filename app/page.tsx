import Link from 'next/link';
import { bestPrice, getBrands, getProducts, Product } from '../lib/data';
import NewsletterForm from './newsletter-form';

export const revalidate = 300;

export default async function Home() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const trending = products.filter(p => p.is_trending).slice(0, 4);
  const newReleases = products.filter(p => p.is_new_release).slice(0, 4);
  const deals = products
    .map(p => ({ product: p, price: bestPrice(p), old: Math.max(...(p.offers || []).map(o => Number(o.old_price || o.original_price || 0))) }))
    .filter(x => x.price && x.old > (x.price || 0))
    .sort((a,b) => (b.old-(b.price||0))-(a.old-(a.price||0)))
    .slice(0,3);

  return <>
    <Header />
    <main>
      <section className="hero">
        <span className="eyebrow">FIND IT. COMPARE IT. WIN IT.</span>
        <h1>Win the fight<br/><span>for the best price.</span></h1>
        <p>Search the sneaker you want, compare offers from leading stores and choose the best deal.</p>
        <form className="search" action="/search">
          <span>⌕</span>
          <input name="q" placeholder="Search sneakers, brands or models..." aria-label="Search sneakers" />
          <button>Search</button>
        </form>
        <div className="popular">Popular: {['Nike Air Max','Air Jordan','adidas Samba','New Balance 550','ASICS Gel-Kayano','On Cloud'].map(x=><Link key={x} href={`/search?q=${encodeURIComponent(x)}`}>{x}</Link>)}</div>
      </section>

      <section id="trending" className="section">
        <div className="title"><div><span>WHAT'S HOT</span><h2>Trending Sneakers</h2></div><Link className="link" href="/search">View all →</Link></div>
        <ProductGrid items={trending.length ? trending : products.slice(0,4)} />
      </section>

      <section id="deals" className="dark"><div className="section">
        <div className="title inverse"><div><span>PRICE BATTLE</span><h2>Best Prices Right Now</h2></div><Link className="link" href="/search">Explore deals →</Link></div>
        <p className="demo-note">Prices shown in this first catalogue are demo data. They will be replaced by authorised retailer and affiliate feeds before commercial launch.</p>
        <div className="dealgrid">{deals.map(({product:p,price,old})=><article className="deal" key={p.id}>
          <div className="dealvisual"><b>Save €{(old-(price||0)).toFixed(0)}</b><span>👟</span></div>
          <small>{p.brands?.name}</small><h3>{p.name}</h3>
          <div><strong>€{price?.toFixed(2)}</strong> <del>€{old.toFixed(2)}</del></div>
          <Link className="deal-button" href={`/product/${p.slug}`}>Compare prices</Link>
        </article>)}</div>
      </div></section>

      <section id="brands" className="section">
        <div className="title"><div><span>EXPLORE</span><h2>Shop by Brand</h2></div></div>
        <div className="brands">{brands.map(b=><Link key={b.id} href={`/search?brand=${encodeURIComponent(b.slug)}`}>{b.name}</Link>)}</div>
      </section>

      <section id="new" className="section">
        <div className="title"><div><span>JUST LANDED</span><h2>New Releases</h2></div><Link className="link" href="/search">See all →</Link></div>
        <ProductGrid items={newReleases.length ? newReleases : products.slice(-4)} />
      </section>

      <section className="how"><span>COMPARE SMARTER</span><h2>One search. Every price.</h2><p>SOLEWAR brings store offers together so you can compare before you buy.</p><div className="steps">{[['01','Search','Find the sneaker you want.'],['02','Compare','See offers from different stores.'],['03','Choose','Pick the offer that suits you.'],['04','Buy','Go directly to the retailer.']].map(s=><div key={s[0]}><b>{s[0]}</b><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></section>

      <section className="newsletter"><div><span>STAY AHEAD</span><h2>Never miss a sneaker deal.</h2><p>Price drops, new releases and the best sneaker deals — straight to your inbox.</p></div><NewsletterForm /></section>
    </main>
    <Footer />
  </>;
}

function Header(){return <header className="nav"><Link className="logo" href="/">SOLEWAR</Link><nav><Link href="/search">Sneakers</Link><a href="#brands">Brands</a><Link href="/search?gender=men">Men</Link><Link href="/search?gender=women">Women</Link><Link href="/search?gender=kids">Kids</Link><a href="#new">New Releases</a><a href="#deals">Deals</a></nav><div className="actions"><Link href="/search" aria-label="Search">⌕</Link><span aria-label="Wishlist">♡</span><span aria-label="Account">◯</span></div></header>}

function ProductGrid({items}:{items:Product[]}){return <div className="grid">{items.map(p=>{const price=bestPrice(p);return <article className="card" key={p.id}><Link href={`/product/${p.slug}`}><div className="visual"><span className="badge">{p.is_new_release?'New':p.is_trending?'Trending':'Compare'}</span><div className="shoe">👟</div></div><small>{p.brands?.name}</small><h3>{p.name}</h3><p>{price ? <>From <strong>€{price.toFixed(2)}</strong></> : 'Offers coming soon'}</p><span>{p.offers?.length || 0} stores</span><span className="compare">Compare prices <b>→</b></span></Link></article>})}</div>}

function Footer(){return <footer><div className="footbrand"><b>SOLEWAR</b><p>Find it. Compare it.<br/>Win it.</p></div><div className="footlinks"><Link href="/about">About</Link><a href="#">How it works</a><a href="#brands">Brands</a><Link href="/legal/affiliate-disclosure">Affiliate Disclosure</Link><Link href="/legal/privacy">Privacy Policy</Link><Link href="/legal/terms">Terms</Link></div><div className="copyright">© 2026 SOLEWAR. We may earn a commission when you buy through retailer links.</div></footer>}
