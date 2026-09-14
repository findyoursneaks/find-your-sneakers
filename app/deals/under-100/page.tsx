import Link from 'next/link';
import { checkedAt, deals, shippingSource } from '../../../lib/curated-deals';
import './deals.css';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Sneakers under €100 — Netherlands',
  description: 'A manually checked selection of Nike NL sneakers under €100, with EU sizes, delivery costs and direct retailer links.',
  alternates: { canonical: '/deals/under-100' },
};
const money = (n:number) => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);

export default function DealsPage(){
  const expired = Date.now() - Date.parse(checkedAt) > 48*60*60*1000;
  return <div className="deals-shell">
    <header className="deals-nav"><Link className="war-logo" href="/"><span>SOLE</span><b>WAR</b></Link><Link href="/search">All sneakers ↗</Link></header>
    <main>
      <section className="deals-hero"><p className="eyebrow">THE UNDER €100 EDIT / NETHERLANDS</p><h1>Good pairs.<br/><em>Smaller prices.</em></h1><p>Ten picks from Nike NL. Exact styles, EU sizes and delivery costs, all in one place.</p><a className="edit-cta" href="#picks">Explore the edit ↓</a><div className="check-note">Manually checked 14 September 2026, 22:20 UTC.<br/>Product prices exclude delivery. Prices and sizes can change.</div></section>
      <aside className="delivery-note"><b>Know your total.</b><span>Nike members: free standard delivery from €50. Guests: €5 below €99, free from €99. Delivery to the Netherlands; confirm the final total at checkout. <a href={shippingSource} target="_blank" rel="noopener noreferrer">Delivery conditions ↗</a></span></aside>
      {expired && <p className="stale-note" role="status">This edit needs a fresh price check. Previous prices and sizes are hidden; open Nike to check current availability.</p>}
      <section id="picks" className="deal-grid" aria-label="Sneaker selection">{deals.map((d,i)=><article className="deal-card" id={d.id} key={d.id}>
        <div className="card-top"><span>{String(i+1).padStart(2,'0')} / THE EDIT</span><span>NIKE NL</span></div>
        <div className="deal-style">{d.id}</div><h2>{d.name}</h2>
        {expired ? <p className="deal-price">Check price</p> : <><p className="deal-price">{money(d.price)}</p><p className="total">Members delivered: {money(d.price)}<br/>Guests delivered: {money(d.price+(d.price<99?5:0))}</p><details><summary>EU sizes at last check ({d.sizes.length})</summary><p>{d.sizes.join(' · ')}</p></details></>}
        <a className="retailer-link" href={`https://www.nike.com/nl/t/${d.path}`} target="_blank" rel="noopener noreferrer">Check at Nike ↗</a>
      </article>)}</section>
      <section className="edit-about"><h2>A useful starting point.</h2><p>This is a curated selection from one retailer, not a whole-market lowest-price guarantee. These are ordinary retailer links: SOLEWAR does not currently earn commission from this edit. Purchases, delivery and returns are handled by Nike.</p></section>
    </main><footer className="deals-footer"><Link href="/">SOLEWAR</Link><span>Compare. Choose. Wear better.</span><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link></footer>
  </div>;
}
