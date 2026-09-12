'use client';
import { FormEvent, useMemo, useState } from 'react';

const products = [
 {brand:'Nike',name:'Air Max 95',price:159.99,old:189.99,stores:8,emoji:'👟',tag:'Trending'},
 {brand:'Jordan',name:'Air Jordan 4 Retro',price:179.99,old:219.99,stores:6,emoji:'👟',tag:'Hot'},
 {brand:'adidas',name:'Samba OG',price:89.99,old:120,stores:12,emoji:'👟',tag:'Best price'},
 {brand:'New Balance',name:'550',price:109.99,old:140,stores:9,emoji:'👟',tag:'Popular'},
 {brand:'ASICS',name:'GEL-Kayano 14',price:139.99,old:170,stores:7,emoji:'👟',tag:'New'},
 {brand:'On',name:'Cloud 5',price:129.99,old:150,stores:5,emoji:'👟',tag:'Popular'},
];
const brands=['Nike','adidas','Jordan','New Balance','ASICS','On','Puma','Reebok','Vans','Converse','Saucony','HOKA','Salomon'];

export default function Home(){
 const [q,setQ]=useState('');
 const [searched,setSearched]=useState('');
 const filtered=useMemo(()=>products.filter(p=>(p.brand+' '+p.name).toLowerCase().includes(searched.toLowerCase())),[searched]);
 const submit=(e:FormEvent)=>{e.preventDefault();setSearched(q.trim())};
 return <>
  <header className="nav"><a className="logo" href="#">Find Your Sneakers</a><nav><a href="#trending">Sneakers</a><a href="#brands">Brands</a><a href="#trending">Men</a><a href="#trending">Women</a><a href="#trending">Kids</a><a href="#new">New Releases</a><a href="#deals">Deals</a></nav><div className="actions"><button aria-label="Search">⌕</button><button aria-label="Wishlist">♡</button><button aria-label="Account">◯</button></div></header>
  <main>
   <section className="hero"><span className="eyebrow">THE SMARTER WAY TO SHOP SNEAKERS</span><h1>Find Your<br/><span>Sneakers.</span></h1><p>Compare sneakers from leading stores and find the right pair at the right price.</p>
    <form className="search" onSubmit={submit}><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search sneakers, brands or models..."/><button>Search</button></form>
    <div className="popular">Popular: {['Nike Air Max','Air Jordan','adidas Samba','New Balance 550','ASICS Gel-Kayano','On Cloud'].map(x=><button key={x} onClick={()=>{setQ(x);setSearched(x)}}>{x}</button>)}</div>
   </section>
   {searched && <section className="section"><div className="title"><div><span>SEARCH RESULTS</span><h2>{searched}</h2></div><button className="link" onClick={()=>setSearched('')}>Clear ×</button></div><ProductGrid items={filtered}/>{!filtered.length&&<p className="empty">No matches yet. Try another sneaker or brand.</p>}</section>}
   <section id="trending" className="section"><div className="title"><div><span>WHAT'S HOT</span><h2>Trending Sneakers</h2></div><a className="link" href="#deals">View all →</a></div><ProductGrid items={products.slice(0,4)}/></section>
   <section id="deals" className="dark"><div className="section"><div className="title inverse"><div><span>DON'T MISS OUT</span><h2>Best Prices Right Now</h2></div><a className="link" href="#trending">Explore deals →</a></div><div className="dealgrid">{products.slice(0,3).map(p=><article className="deal" key={p.name}><div className="dealvisual"><b>Save €{(p.old-p.price).toFixed(0)}</b><span>{p.emoji}</span></div><small>{p.brand}</small><h3>{p.name}</h3><div><strong>€{p.price.toFixed(2)}</strong> <del>€{p.old.toFixed(2)}</del></div><button>Compare prices</button></article>)}</div></div></section>
   <section id="brands" className="section"><div className="title"><div><span>EXPLORE</span><h2>Shop by Brand</h2></div></div><div className="brands">{brands.map(b=><button key={b}>{b}</button>)}</div></section>
   <section id="new" className="section"><div className="title"><div><span>JUST LANDED</span><h2>New Releases</h2></div><a className="link" href="#trending">See all →</a></div><ProductGrid items={products.slice(2,6)}/></section>
   <section className="how"><span>COMPARE SMARTER</span><h2>One search. Every price.</h2><p>Finding the right sneaker shouldn't mean opening ten different tabs.</p><div className="steps">{[['01','Search','Find the sneaker you want.'],['02','Compare','See offers from different stores.'],['03','Choose','Pick the offer that suits you.'],['04','Buy','Go directly to the retailer.']].map(s=><div key={s[0]}><b>{s[0]}</b><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></section>
   <section className="newsletter"><div><span>STAY AHEAD</span><h2>Never miss a sneaker deal.</h2><p>Price drops, new releases and the best sneaker deals — straight to your inbox.</p></div><form onSubmit={e=>e.preventDefault()}><input type="email" required placeholder="Your email address"/><button>Notify me</button></form></section>
  </main>
  <footer><div className="footbrand"><b>Find Your Sneakers</b><p>Find the right sneaker.<br/>At the right price.</p></div><div className="footlinks">{['About','How it works','Brands','Stores','Contact','Affiliate Disclosure','Privacy Policy','Cookie Policy','Terms','Imprint'].map(x=><a key={x} href="#">{x}</a>)}</div><div className="copyright">© 2026 Find Your Sneakers. We may earn a commission when you buy through retailer links.</div></footer>
 </>
}
function ProductGrid({items}:{items:typeof products}){return <div className="grid">{items.map(p=><article className="card" key={p.name}><div className="visual"><span className="badge">{p.tag}</span><button className="heart">♡</button><div className="shoe">{p.emoji}</div></div><small>{p.brand}</small><h3>{p.name}</h3><p>From <strong>€{p.price.toFixed(2)}</strong></p><span>{p.stores} stores</span><button className="compare">Compare prices <b>→</b></button></article>)}</div>}
