import Link from 'next/link';
import { bestOffer, formatMoney, getProducts } from '../../lib/data';

export const revalidate = 300;

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string;brand?:string;gender?:string}>}){
  const params=await searchParams;
  const q=(params.q||'').toLowerCase();
  const brand=(params.brand||'').toLowerCase();
  const gender=(params.gender||'').toLowerCase();
  const products=await getProducts();

  const filtered=products.filter(product=>{
    const hay=`${product.brands?.name||''} ${product.name} ${product.model||''} ${product.description||''}`.toLowerCase();
    return (!q||hay.includes(q))
      && (!brand||product.brands?.slug===brand)
      && (!gender||product.gender===gender||product.gender==='unisex');
  });

  return <main className="catalog-page">
    <div className="catalog-head">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <span className="eyebrow">LIVE PRODUCTS & APPROVED OFFERS</span>
      <h1>Find what is actually live.</h1>
      <form className="search" action="/search">
        <span>⌕</span>
        <input name="q" defaultValue={params.q||''} placeholder="Search product or brand..." aria-label="Search products"/>
        <button>Search</button>
      </form>
    </div>

    <div className="catalog-meta">
      <strong>{filtered.length}</strong> live products
      {params.q&&<> matching “{params.q}”</>}
      {brand&&<> · {brand}</>}
      {gender&&<> · {gender}</>}
    </div>

    <div className="catalog-grid">{filtered.map(product=>{
      const offer=bestOffer(product);
      const image=product.image_url||product.images?.[0];
      return <Link className="catalog-card" key={product.id} href={`/product/${product.slug}`}>
        <div className="catalog-visual">
          {image?<img src={image} alt={`${product.brands?.name||''} ${product.name}`}/>:<span>SOLEWAR</span>}
          <em>Open product →</em>
        </div>
        <small>{product.brands?.name}</small>
        <h2>{product.name}</h2>
        <p>{offer?<>Current offer <strong>{formatMoney(Number(offer.price),offer.currency)}</strong></>:'Offer unavailable'}</p>
        <span>{offer?'Live affiliate offer →':'Unavailable'}</span>
      </Link>;
    })}</div>

    {!filtered.length&&<div className="empty-state">
      <h2>No live product found</h2>
      <p>Try another product or brand, or return to the full live catalogue.</p>
      <Link href="/search">View all live products</Link>
    </div>}
  </main>;
}
