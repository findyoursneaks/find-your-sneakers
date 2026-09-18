import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMoney } from '../../../../lib/data';
import { loadMoosehillFeed } from '../../../../lib/affiliate/moosehill-feed';

export const dynamic='force-dynamic';
export const revalidate=0;

export default async function MoosehillProductPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const decoded=decodeURIComponent(id);
  const products=await loadMoosehillFeed(2500).catch(()=>[]);
  const product=products.find(p=>String(p.id)===decoded);
  if(!product) notFound();

  return <main className="feed-product-page">
    <div className="product-topbar"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/outdoor">← Back to Moosehill</Link></div>
    <section className="feed-product-hero">
      <div className="feed-product-image">{product.image?<img src={product.image} alt={product.title}/>:<span>SOLEWAR</span>}</div>
      <div className="feed-product-info">
        <span className="hero-kicker">MOOSEHILL × SOLEWAR</span>
        <h1>{product.title}</h1>
        <p>{product.description||'Performance outdoor apparel from Moosehill.'}</p>
        <div className="feed-product-meta"><span>{product.availability||'Check availability'}</span><span>Awin partner feed</span></div>
        <div className="feed-product-price">{product.price!=null?formatMoney(product.price,product.currency):'See current price'}</div>
        <div className="feed-product-actions"><a className="primary" href={product.link} target="_blank" rel="nofollow sponsored">Shop Moosehill →</a><Link className="secondary" href="/outdoor">Keep browsing</Link></div>
        <div className="feed-coupon"><small>SOLEWAR AUDIENCE CODE</small><strong>SAS15</strong><span>15% off eligible purchases. Merchant terms apply.</span></div>
      </div>
    </section>
    <p className="affiliate-note">SOLEWAR may earn a commission from qualifying purchases made through eligible Awin links. Price, stock and promotion eligibility are confirmed on the merchant site.</p>
  </main>;
}
