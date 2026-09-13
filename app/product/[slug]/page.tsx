import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bestPrice, getProductBySlug } from '../../../lib/data';

export const revalidate = 300;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) return {title:'Sneaker not found — SOLEWAR'};
  const price=bestPrice(product);
  return {
    title:`${product.brands?.name||''} ${product.name} — Price Battle | SOLEWAR`,
    description: price ? `Compare stores for ${product.brands?.name||''} ${product.name}. Current winning price from €${price.toFixed(2)}.` : `Compare store offers for ${product.brands?.name||''} ${product.name} on SOLEWAR.`,
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) notFound();
  const offers=[...(product.offers||[])].sort((a,b)=>Number(a.price)-Number(b.price));
  const price=bestPrice(product);
  const image=product.image_url || product.images?.[0];

  return <main className="product-page">
    <div className="product-topbar"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/search">← Back to arena</Link></div>
    <section className="product-hero">
      <div className="product-image">{image?<img src={image} alt={`${product.brands?.name||''} ${product.name}`} />:<span>👟</span>}</div>
      <div className="product-info"><small>{product.brands?.name}</small><h1>{product.name}</h1><p>{product.colorway||'Colourway'}</p>{price&&<div className="product-price">Winning price <strong>€{price.toFixed(2)}</strong></div>}<div className="product-tags"><span>{offers.length} stores competing</span><span>{product.gender}</span>{product.is_new_release&&<span>New challenger</span>}</div><p className="product-description">{product.description}</p></div>
    </section>

    <section className="offers-section">
      <div className="title"><div><span>PRICE BATTLE</span><h2>Stores competing for your pair</h2></div></div>
      <div className="offer-list">{offers.map((offer,index)=>{
        const demo=!offer.retailers?.affiliate_enabled;
        return <article className="offer-row" key={offer.id}>
          <div><small>{index===0?'WINNING PRICE':'CHALLENGER'}</small><h3>{offer.retailers?.name||'Retailer'}</h3>{demo&&<span className="demo-pill">Demo offer</span>}</div>
          <div className="size-list">{(offer.available_sizes||[]).slice(0,5).map(size=><span key={size}>{size}</span>)}</div>
          <div className="offer-price"><strong>€{Number(offer.price).toFixed(2)}</strong>{offer.old_price&&Number(offer.old_price)>Number(offer.price)&&<del>€{Number(offer.old_price).toFixed(2)}</del>}</div>
          {demo?<button className="buy disabled" disabled>Live feed pending</button>:<Link className="buy" href={`/go/${offer.id}`} rel="nofollow sponsored">Claim this deal →</Link>}
        </article>
      })}</div>
      {!offers.length&&<div className="empty-state"><h3>No live battle yet</h3><p>Retailer feeds are being connected.</p></div>}
      <p className="affiliate-note">SOLEWAR may earn a commission from eligible retailer links. This does not change the price you pay.</p>
    </section>
  </main>;
}
