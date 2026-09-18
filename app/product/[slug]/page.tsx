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
    title:`${product.brands?.name||''} ${product.name} — SOLEWAR`,
    description: offer ? `See the active offer for ${product.brands?.name||''} ${product.name} from ${formatMoney(Number(offer.price),offer.currency)}.` : `Discover ${product.brands?.name||''} ${product.name} on SOLEWAR.`,
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) notFound();

  const offers=(product.offers||[])
    .filter(offer => offer.in_stock && offer.retailers?.affiliate_enabled && (offer.affiliate_url || offer.product_url))
    .sort((a,b)=>Number(a.price)-Number(b.price));

  const winner=bestOffer(product);
  const image=product.image_url || product.images?.[0];
  const brandHref=`/brands/${product.brands?.slug}`;
  const isMoosehill=product.brands?.slug==='moosehill';

  return <main className="product-page">
    <div className="product-topbar">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <div className="product-breadcrumbs"><Link href={brandHref}>← {product.brands?.name}</Link><Link href="/search">All products</Link></div>
    </div>

    <section className="product-hero">
      <div className="product-image">{image?<img src={image} alt={`${product.brands?.name||''} ${product.name}`} />:<span>SOLEWAR</span>}</div>
      <div className="product-info">
        <small>{product.brands?.name}</small>
        <h1>{product.name}</h1>
        <p>{product.model||product.colorway||'Product'}</p>
        {winner&&<div className="product-price">Current offer <strong>{formatMoney(Number(winner.price),winner.currency)}</strong></div>}
        <div className="product-tags">
          <span>{offers.length} live offer{offers.length===1?'':'s'}</span>
          {product.gender&&<span>{product.gender}</span>}
          {product.is_new_release&&<span>Featured</span>}
        </div>
        {product.description&&<p className="product-description">{product.description}</p>}
        {isMoosehill&&<div className="feed-coupon"><small>SOLEWAR AUDIENCE CODE</small><strong>SAS15</strong><span>15% off eligible Moosehill purchases. Merchant terms apply.</span></div>}
      </div>
    </section>

    <section className="offers-section">
      <div className="title"><div><span>ACTIVE OFFERS</span><h2>Shop through an approved destination</h2></div></div>
      <div className="offer-list">{offers.map((offer,index)=>
        <article className="offer-row" key={offer.id}>
          <div><small>{index===0?'BEST ACTIVE OFFER':'ACTIVE OFFER'}</small><h3>{offer.retailers?.name||product.brands?.name||'Retailer'}</h3></div>
          <div className="size-list">{(offer.available_sizes||[]).slice(0,5).map(size=><span key={size}>{size}</span>)}</div>
          <div className="offer-price"><strong>{formatMoney(Number(offer.price),offer.currency)}</strong>{offer.old_price&&Number(offer.old_price)>Number(offer.price)&&<del>{formatMoney(Number(offer.old_price),offer.currency)}</del>}</div>
          <Link className="buy" href={`/go/${offer.id}`} rel="nofollow sponsored">Shop offer →</Link>
        </article>
      )}</div>
      <p className="affiliate-note">SOLEWAR may earn a commission from eligible partner links. This does not change the price you pay. Price, stock, promotion eligibility and checkout terms are confirmed by the merchant.</p>
    </section>
  </main>;
}
