import Link from 'next/link';
import { bestOffer, formatMoney, getProducts, Product } from '../../lib/data';

export const revalidate = 300;

export const metadata = {
  title: 'Outdoor gear — Moosehill hiking & active apparel',
  description: 'Explore selected Moosehill hiking and outdoor products on SOLEWAR, including the current 15% affiliate audience code SAS15.',
};

export default async function OutdoorPage(){
  const products=(await getProducts()).filter(p=>p.brands?.slug==='moosehill');
  return <main className="outdoor-page">
    <div className="outdoor-page-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/search">All products</Link></div>
    <section className="outdoor-page-hero">
      <div><span className="hero-kicker">SOLEWAR OUTDOOR</span><h1>Moosehill</h1><p>Performance apparel for hiking, cycling and active everyday use. SOLEWAR is starting its outdoor category with selected HikerFlex products.</p><div className="outdoor-badges"><span>Hiking</span><span>Cycling</span><span>Quick-dry</span><span>Active lifestyle</span></div></div>
      <div className="coupon-card"><small>AFFILIATE AUDIENCE OFFER</small><strong>15% OFF</strong><span>CODE</span><code>SAS15</code><p>Use on eligible Moosehill purchases. Final price, eligibility and availability are confirmed on the merchant site.</p></div>
    </section>

    <section className="outdoor-products"><div className="trend-head"><div><h2>Selected HikerFlex styles</h2><p>Current listed prices from MoosehillStore.com.</p></div></div><div className="outdoor-grid">{products.map(p=><OutdoorCard key={p.id} p={p}/>)}</div></section>

    <section className="outdoor-explainer"><div><span>WHY OUTDOOR ON SOLEWAR?</span><h2>Same mission. Wider movement.</h2></div><p>SOLEWAR is expanding beyond sneakers into products that share the same audience: people who care about movement, comfort, performance and style. Outdoor apparel is a natural extension of that discovery experience.</p></section>
    <p className="affiliate-note outdoor-note">SOLEWAR may earn a commission from qualifying Moosehill purchases made through eligible Awin links. The SAS15 promotion is supplied for affiliate audiences and may be changed or withdrawn by the advertiser.</p>
  </main>;
}

function OutdoorCard({p}:{p:Product}){
  const offer=bestOffer(p);
  return <article className="outdoor-product-card"><div className="outdoor-product-visual">🥾</div><small>{p.model}</small><h3>{p.name}</h3><p>{p.description}</p><div className="outdoor-product-bottom"><strong>{offer?formatMoney(Number(offer.price),offer.currency):'Offer pending'}</strong>{offer?<Link href={`/go/${offer.id}`} rel="nofollow sponsored">Shop via SOLEWAR →</Link>:<span>Coming soon</span>}</div></article>;
}
