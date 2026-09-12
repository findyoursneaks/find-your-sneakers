import Link from 'next/link';

export default function AboutPage(){
  return <main className="legal-page"><Link className="logo" href="/">Find Your Sneakers</Link><h1>About Find Your Sneakers</h1><p>Find Your Sneakers is being built as a European sneaker comparison platform: search one model, compare offers from multiple retailers, then choose the store that fits you best.</p><h2>What we do</h2><p>We do not hold stock and we do not process sneaker payments. Our role is discovery, comparison and referral to retailers.</p><h2>How we make money</h2><p>The business can earn affiliate commissions from eligible retailer links and, in the future, clearly identified advertising or sponsored placements.</p><h2>Our standard</h2><p>Live prices and availability will only be presented when they come from authorised retailer, affiliate or product-feed sources. Demo catalogue data is clearly identified during development.</p><p><Link href="/">← Back home</Link></p></main>;
}
