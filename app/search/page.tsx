import Link from 'next/link';
import { bestOffer, formatMoney, getProducts } from '../../lib/data';

export const revalidate = 300;

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string;brand?:string;gender?:string}>}){
  const params=await searchParams;
  const q=(params.q||'').toLowerCase();
  const brand=(params.brand||'').toLowerCase();
  const gender=(params.gender||'').toLowerCase();
  const products=await getProducts();
  const filtered=products.filter(p=>{
    const hay=`${p.brands?.name||''} ${p.name} ${p.model||''} ${p.description||''}`.toLowerCase();
    return (!q||hay.includes(q)) && (!brand||p.brands?.slug===brand) && (!gender||p.gender===gender||p.gender==='unisex');
  });

  return <main className="catalog-page">
    <div className="catalog-head">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <span className="eyebrow">PRODUCT DISCOVERY & PRICE BATTLE</span>
      <h1>Find your next move.</h1>
      <form className="search" action="/search"><span>⌕</span><input name="q" defaultValue={params.q||''} placeholder="Air Max 95, Samba, HikerFlex..." aria-label="Search products"/><button>Search</button></form>
    </div>
    <div className="catalog-meta"><strong>{filtered.length}</strong> products {params.q&&<>matching “{params.q}”</>}{brand&&<> · {brand}</>}{gender&&<> · {gender}</>}</div>
    <div className="catalog-grid">{filtered.map(p=>{
      const offer=bestOffer(p);
      const image=p.image_url||p.images?.[0];
      return <Link className="catalog-card" key={p.id} href={`/product/${p.slug}`}>
        <div className="catalog-visual">{image?<img src={image} alt={`${p.brands?.name||''} ${p.name}`}/>:<span>SOLEWAR</span>}<em>Open product →</em></div>
        <small>{p.brands?.name}</small><h2>{p.name}</h2>
        <p>{offer?<>Best listed offer <strong>{formatMoney(Number(offer.price),offer.currency)}</strong></>:'Offer coming soon'}</p>
        <span>{p.offers?.length||0} offer{p.offers?.length===1?'':'s'} available →</span>
      </Link>;
    })}</div>
    {!filtered.length&&<div className="empty-state"><h2>No product found</h2><p>Try another model, category or brand.</p><Link href="/search">View all products</Link></div>}
  </main>;
}
