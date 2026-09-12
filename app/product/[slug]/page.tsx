import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bestPrice, getProductBySlug } from '../../../lib/data';

export const revalidate = 300;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) return {title:'Sneaker not found — Find Your Sneakers'};
  const price=bestPrice(product);
  return {
    title:`${product.brands?.name||''} ${product.name} — Compare Prices | Find Your Sneakers`,
    description: price ? `Compare offers for ${product.brands?.name||''} ${product.name}, from €${price.toFixed(2)}.` : `Compare offers for ${product.brands?.name||''} ${product.name}.`,
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) notFound();
  const offers=[...(product.offers||[])].sort((a,b)=>Number(a.price)-Number(b.price));
  const price=bestPrice(product);
  return <main className="product-page">
    <div className="product-topbar"><Link className="logo" href="/">Find Your Sneakers</Link><Link href="/search">← Back to sneakers</Link></div>
    <section className="product-hero">
      <div className="product-image"><span>👟</span><small>Product imagery will come from authorised retailer feeds.</small></div>
      <div className="product-info"><small>{product.brands?.name}</small><h1>{product.name}</h1><p>{product.colorway||'Colourway'}</p>{price&&<div className="product-price">From <strong>€{price.toFixed(2)}</strong></div>}<div className="product-tags"><span>{offers.length} offers</span><span>{product.gender}</span>{product.is_new_release&&<span>New release</span>}</div><p className="product-description">{product.description}</p></div>
    </section>

    <section className="offers-section">
      <div className="title"><div><span>PRICE COMPARISON</span><h2>Available offers</h2></div></div>
      <div className="offer-list">{offers.map((offer,index)=>{
        const demo=!offer.retailers?.affiliate_enabled;
        return <article className="offer-row" key={offer.id}>
          <div><small>{index===0?'BEST PRICE':'STORE'}</small><h3>{offer.retailers?.name||'Retailer'}</h3>{demo&&<span className="demo-pill">Demo offer</span>}</div>
          <div className="size-list">{(offer.available_sizes||[]).slice(0,5).map(size=><span key={size}>{size}</span>)}</div>
          <div className="offer-price"><strong>€{Number(offer.price).toFixed(2)}</strong>{offer.old_price&&Number(offer.old_price)>Number(offer.price)&&<del>€{Number(offer.old_price).toFixed(2)}</del>}</div>
          {demo?<button className="buy disabled" disabled>Live feed pending</button>:<Link className="buy" href={`/go/${offer.id}`} rel="nofollow sponsored">Buy at store →</Link>}
        </article>
      })}</div>
      {!offers.length&&<div className="empty-state"><h3>No live offers yet</h3><p>Retailer feeds are being connected.</p></div>}
      <p className="affiliate-note">Affiliate disclosure: Find Your Sneakers may receive a commission when you purchase through eligible retailer links. This does not change the price you pay.</p>
    </section>
  </main>;
}
