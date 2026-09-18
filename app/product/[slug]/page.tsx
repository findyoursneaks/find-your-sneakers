import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bestOffer, formatMoney, getProductBySlug } from '../../../lib/data';

export const revalidate = 300;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) return {title:'Product not found — SOLEWAR'};
  const offer=bestOffer(product);
  return {
    title:`${product.brands?.name||''} ${product.name} — Offers | SOLEWAR`,
    description: offer ? `See the current listed offer for ${product.brands?.name||''} ${product.name} from ${formatMoney(Number(offer.price),offer.currency)}.` : `Discover offers for ${product.brands?.name||''} ${product.name} on SOLEWAR.`,
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) notFound();
  const offers=[...(product.offers||[])].sort((a,b)=>Number(a.price)-Number(b.price));
  const winner=bestOffer(product);
  const image=product.image_url || product.images?.[0];
  const outdoor=product.brands?.slug==='moosehill';

  return <main className="product-page">
    <div className="product-topbar"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/search">← Back to products</Link></div>
    <section className="product-hero">
      <div className="product-image">{image?<img src={image} alt={`${product.brands?.name||''} ${product.name}`} />:<span>{outdoor?'🥾':'👟'}</span>}</div>
      <div className="product-info"><small>{product.brands?.name}</small><h1>{product.name}</h1><p>{product.model||product.colorway||'Product'}</p>{winner&&<div className="product-price">Best listed offer <strong>{formatMoney(Number(winner.price),winner.currency)}</strong></div>}<div className="product-tags"><span>{offers.length} offer{offers.length===1?'':'s'} available</span><span>{product.gender}</span>{product.is_new_release&&<span>Featured</span>}</div><p className="product-description">{product.description}</p></div>
    </section>

    <section className="offers-section">
      <div className="title"><div><span>AVAILABLE OFFERS</span><h2>Retailers & brand stores</h2></div></div>
      <div className="offer-list">{offers.map((offer,index)=>{
        const disabled=!offer.retailers?.affiliate_enabled;
        return <article className="offer-row" key={offer.id}>
          <div><small>{index===0?'BEST LISTED OFFER':'OFFER'}</small><h3>{offer.retailers?.name||'Retailer'}</h3>{disabled&&<span className="demo-pill">Feed pending</span>}</div>
          <div className="size-list">{(offer.available_sizes||[]).slice(0,5).map(size=><span key={size}>{size}</span>)}</div>
          <div className="offer-price"><strong>{formatMoney(Number(offer.price),offer.currency)}</strong>{offer.old_price&&Number(offer.old_price)>Number(offer.price)&&<del>{formatMoney(Number(offer.old_price),offer.currency)}</del>}</div>
          {disabled?<button className="buy disabled" disabled>Live link pending</button>:<Link className="buy" href={`/go/${offer.id}`} rel="nofollow sponsored">View this offer →</Link>}
        </article>
      })}</div>
      {!offers.length&&<div className="empty-state"><h3>No live offer yet</h3><p>Retailer feeds are being connected.</p></div>}
      <p className="affiliate-note">SOLEWAR may earn a commission from eligible retailer links. This does not change the price you pay. Prices, promo codes and availability can change on the retailer site.</p>
    </section>
  </main>;
}
