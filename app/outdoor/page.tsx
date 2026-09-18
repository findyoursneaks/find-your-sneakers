import Link from 'next/link';
import { bestOffer, formatMoney, getProducts, Product } from '../../lib/data';

export const revalidate = 300;

export const metadata = {
  title: 'Outdoor gear — Moosehill hiking & active apparel',
  description: 'Explore Moosehill hiking and outdoor products on SOLEWAR, including the current 15% affiliate audience code SAS15.',
};

export default async function OutdoorPage(){
  const products=(await getProducts()).filter(p=>p.brands?.slug==='moosehill');
  const hero=products.find(p=>p.image_url||p.images?.[0])||products[0];

  return <main className="outdoor-page">
    <div className="outdoor-page-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><div><Link href="/search">All products</Link><Link href="/">Home</Link></div></div>

    <section className="outdoor-page-hero">
      <div>
        <span className="hero-kicker">SOLEWAR OUTDOOR × MOOSEHILL</span>
        <h1>Go further.</h1>
        <p>Hiking, cycling and active-lifestyle gear with real product photography, current pricing and direct affiliate shopping links.</p>
        <div className="outdoor-badges"><span>Hiking</span><span>Cycling</span><span>Quick-dry</span><span>Outdoor</span></div>
      </div>
      <div className="outdoor-hero-side">
        {hero && <Link href={`/product/${hero.slug}`} className="outdoor-hero-product"><img src={hero.image_url||hero.images?.[0]||''} alt={hero.name}/></Link>}
        <div className="coupon-card"><small>SOLEWAR AUDIENCE OFFER</small><strong>15% OFF</strong><span>CODE</span><code>SAS15</code><p>Use on eligible Moosehill purchases. Final price, stock and eligibility are confirmed on the merchant site.</p></div>
      </div>
    </section>

    <section className="outdoor-products">
      <div className="trend-head"><div><h2>Moosehill collection</h2><p>{products.length} products currently indexed on SOLEWAR. The catalogue refreshes automatically.</p></div></div>
      <div className="outdoor-grid">{products.map(p=><OutdoorCard key={p.id} p={p}/>)}</div>
    </section>

    <section className="outdoor-explainer">
      <div><span>AUTOMATIC CATALOGUE</span><h2>Fresh products without manual uploads.</h2></div>
      <p>SOLEWAR refreshes Moosehill product information automatically, keeping product photography, current listed prices, availability and affiliate destinations connected to the live catalogue.</p>
    </section>
    <p className="affiliate-note outdoor-note">SOLEWAR participates in the Moosehill affiliate programme through Awin and may earn a commission from qualifying purchases. The SAS15 promotion may be changed or withdrawn by the advertiser.</p>
  </main>;
}

function OutdoorCard({p}:{p:Product}){
  const offer=bestOffer(p);
  const image=p.image_url||p.images?.[0];
  return <article className="outdoor-product-card">
    <Link href={`/product/${p.slug}`} className="outdoor-product-link">
      <div className="outdoor-product-visual">{image?<img src={image} alt={(p.brands?.name||'')+' '+p.name}/>:<span>SOLEWAR</span>}<em>View product →</em></div>
      <small>{p.model||'Moosehill'}</small><h3>{p.name}</h3><p>{p.description||'Performance outdoor apparel from Moosehill.'}</p>
    </Link>
    <div className="outdoor-product-bottom"><strong>{offer?formatMoney(Number(offer.price),offer.currency):'See price'}</strong>{offer?<Link href={`/go/${offer.id}`} rel="nofollow sponsored">Shop →</Link>:<span>Coming soon</span>}</div>
  </article>;
}
