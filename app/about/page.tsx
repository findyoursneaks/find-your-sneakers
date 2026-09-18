import Link from 'next/link';

export default function AboutPage(){
  return <main className="legal-page">
    <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
    <h1>About SOLEWAR</h1>
    <p>SOLEWAR is a brand-led product discovery platform. We surface brands, products and commercial offers only when there is a real active destination behind them.</p>

    <h2>How brands appear</h2>
    <p>A brand becomes publicly active on SOLEWAR when an approved affiliate, retailer or direct commercial feed is connected. Demo retailers and inactive partner data are not presented as live partnerships.</p>

    <h2>What SOLEWAR does</h2>
    <p>We do not hold stock or process customer payments. We organise product discovery, present current offers and refer shoppers to the relevant brand or retailer.</p>

    <h2>How we make money</h2>
    <p>SOLEWAR may earn affiliate commissions from eligible links and may use clearly identified advertising or sponsored placements. An affiliate relationship does not add a separate fee to the shopper.</p>

    <h2>Built to expand by brand</h2>
    <p>Each active brand receives its own catalogue and branded destination on SOLEWAR. This means new partners can be added without rebuilding the entire platform.</p>

    <p><Link href="/">← Back home</Link></p>
  </main>;
}
