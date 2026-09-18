import Link from 'next/link';
import { bestOffer, formatMoney, getProducts, Product } from '../../lib/data';
import { loadMoosehillFeed, MoosehillFeedProduct } from '../../lib/affiliate/moosehill-feed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Outdoor gear — Moosehill hiking & active apparel',
  description: 'Explore Moosehill hiking and outdoor products on SOLEWAR, including the current 15% affiliate audience code SAS15.',
};

export default async function OutdoorPage(){
  const [dbProducts,liveFeed]=await Promise.all([
    getProducts().then(items=>items.filter(p=>p.brands?.slug==='moosehill')),
    loadMoosehillFeed(72).catch(()=>[]),
  ]);
  const usingLive=liveFeed.length>0;
  const hero = liveFeed.find(p=>p.image) || null;

  return <main className="outdoor-page">
    <div className="outdoor-page-nav"><Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><div><Link href="/search">All products</Link><Link href="/">Home</Link></div></div>
    <section className="outdoor-page-hero">
      <div><span className="hero-kicker">SOLEWAR OUTDOOR × MOOSEHILL</span><h1>Go further.</h1><p>Performance apparel for hiking, cycling and active everyday use. Explore a larger Moosehill selection with real product photography and Awin-powered shopping links.</p><div className="outdoor-badges"><span>Hiking</span><span>Cycling</span><span>Quick-dry</span><span>Active lifestyle</span></div></div>
      <div className="outdoor-hero-side">
        {hero?.image && <Link href={`/outdoor/product/${encodeURIComponent(hero.id)}`} className="outdoor-hero-product"><img src={hero.image} alt={hero.title}/></Link>}
        <div className="coupon-card"><small>AFFILIATE AUDIENCE OFFER</small><strong>15% OFF</strong><span>CODE</span><code>SAS15</code><p>Use on eligible Moosehill purchases. Final price, eligibility and availability are confirmed on the merchant site.</p></div>
      </div>
    </section>

    <section className="outdoor-products">
      <div className="trend-head"><div><h2>{usingLive?'Moosehill collection':'Selected HikerFlex styles'}</h2><p>{usingLive?`${liveFeed.length} products loaded from the current Awin feed.`:'Current listed products from MoosehillStore.com.'}</p></div></div>
      <div className="outdoor-grid">{usingLive?liveFeed.map(p=><FeedCard key={p.id} p={p}/>):dbProducts.map(p=><OutdoorCard key={p.id} p={p}/>)}</div>
    </section>

    <section className="outdoor-explainer"><div><span>WHY OUTDOOR ON SOLEWAR?</span><h2>Same mission. Wider movement.</h2></div><p>SOLEWAR is expanding beyond sneakers into products that share the same audience: people who care about movement, comfort, performance and style. Outdoor apparel is a natural extension of that discovery experience.</p></section>
    <p className="affiliate-note outdoor-note">SOLEWAR may earn a commission from qualifying Moosehill purchases made through eligible Awin links. The SAS15 promotion is supplied for affiliate audiences and may be changed or withdrawn by the advertiser.</p>
  </main>;
}

function FeedCard({p}:{p:MoosehillFeedProduct}){
  const detail=`/outdoor/product/${encodeURIComponent(p.id)}`;
  return <article className="outdoor-product-card">
    <Link href={detail} className="outdoor-product-link">
      <div className="outdoor-product-visual">{p.image?<img src={p.image} alt={p.title}/>:<span>SOLEWAR</span>}<em>View product →</em></div>
      <small>{p.brand||'Moosehill'}</small><h3>{p.title}</h3><p>{p.description||'Outdoor performance apparel from Moosehill.'}</p>
    </Link>
    <div className="outdoor-product-bottom"><strong>{p.price!=null?formatMoney(p.price,p.currency):'See price'}</strong><a href={p.link} rel="nofollow sponsored" target="_blank">Shop →</a></div>
  </article>;
}

function OutdoorCard({p}:{p:Product}){
  const offer=bestOffer(p);
  const image=p.image_url||p.images?.[0];
  return <article className="outdoor-product-card"><Link href={`/product/${p.slug}`} className="outdoor-product-link"><div className="outdoor-product-visual">{image?<img src={image} alt={(p.brands?.name||'')+' '+p.name}/>:<span>SOLEWAR</span>}<em>View product →</em></div><small>{p.model}</small><h3>{p.name}</h3><p>{p.description}</p></Link><div className="outdoor-product-bottom"><strong>{offer?formatMoney(Number(offer.price),offer.currency):'Offer pending'}</strong>{offer?<Link href={`/go/${offer.id}`} rel="nofollow sponsored">Shop →</Link>:<span>Coming soon</span>}</div></article>;
}
