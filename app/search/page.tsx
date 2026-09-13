import Link from 'next/link';
import { bestPrice, getProducts } from '../../lib/data';

export const revalidate = 300;

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string;brand?:string;gender?:string}>}){
  const params=await searchParams;
  const q=(params.q||'').toLowerCase();
  const brand=(params.brand||'').toLowerCase();
  const gender=(params.gender||'').toLowerCase();
  const products=await getProducts();
  const filtered=products.filter(p=>{
    const hay=`${p.brands?.name||''} ${p.name} ${p.model||''}`.toLowerCase();
    return (!q||hay.includes(q)) && (!brand||p.brands?.slug===brand) && (!gender||p.gender===gender||p.gender==='unisex');
  });

  return <main className="catalog-page">
    <div className="catalog-head">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <span className="eyebrow">THE SNEAKER PRICE BATTLE</span>
      <h1>Enter the arena.</h1>
      <form className="search" action="/search"><span>⌕</span><input name="q" defaultValue={params.q||''} placeholder="Nike Air Max 95, Samba, Cloud 5..." aria-label="Search sneakers"/><button>Start battle</button></form>
    </div>
    <div className="catalog-meta"><strong>{filtered.length}</strong> sneakers {params.q&&<>matching “{params.q}”</>}{brand&&<> · {brand}</>}{gender&&<> · {gender}</>}</div>
    <div className="catalog-grid">{filtered.map(p=>{
      const price=bestPrice(p);
      const image=p.image_url||p.images?.[0];
      return <Link className="catalog-card" key={p.id} href={`/product/${p.slug}`}>
        <div className="catalog-visual">{image?<img src={image} alt={`${p.brands?.name||''} ${p.name}`}/>:<span>👟</span>}</div>
        <small>{p.brands?.name}</small><h2>{p.name}</h2>
        <p>{price?<>Winning price <strong>€{price.toFixed(2)}</strong></>:'Battle coming soon'}</p>
        <span>{p.offers?.length||0} stores competing →</span>
      </Link>;
    })}</div>
    {!filtered.length&&<div className="empty-state"><h2>No challenger found</h2><p>Try another model or brand.</p><Link href="/search">View all sneakers</Link></div>}
  </main>;
}
