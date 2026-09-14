import Link from 'next/link';
import { notFound } from 'next/navigation';

const pages: Record<string,{title:string;body:React.ReactNode}> = {
  'affiliate-disclosure': { title:'Affiliate Disclosure', body:<><p>SOLEWAR is a sneaker comparison and discovery service. Some outbound retailer links may be affiliate links. If you purchase after following an eligible link, we may receive a commission from the retailer or affiliate network.</p><p>Affiliate relationships do not determine the order of offers unless a placement is explicitly marked as sponsored. Our goal is to make price and availability comparisons clear to users.</p><h2>Price information</h2><p>Retailer prices, availability and sizes can change. The retailer’s website is the final source of truth before purchase.</p></> },
  privacy: { title:'Privacy Policy', body:<><p>SOLEWAR processes only the data needed to operate the service, such as newsletter email addresses, basic technical request data and affiliate click events.</p><h2>Newsletter</h2><p>Email addresses submitted to the newsletter are stored for the purpose of sending sneaker deal and product updates. Users will be able to unsubscribe from marketing emails.</p><h2>Affiliate tracking</h2><p>When you follow an eligible retailer link, we may record a click event so we can measure the performance of our comparison service. Affiliate networks and retailers may apply their own privacy and cookie policies.</p><h2>Contact</h2><p>For privacy questions or to request removal from the newsletter, contact hello@solewar.com.</p></> },
  terms: { title:'Terms of Use', body:<><p>SOLEWAR is a comparison service and does not sell sneakers directly. Purchases are completed on third-party retailer websites and are governed by each retailer’s own terms, delivery rules, returns policy and customer service.</p><p>We aim to keep product and price information accurate, but prices, sizes and availability may change between updates. Always confirm the final price with the retailer before purchasing.</p><h2>Demo catalogue</h2><p>During the pre-launch phase, some offers may be clearly marked as demo data and cannot be purchased through the platform.</p></> },
};

export default async function LegalPage({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  const content=pages[page];
  if(!content) notFound();
  return <main className="legal-page"><Link className="logo" href="/">SOLEWAR</Link><h1>{content.title}</h1>{content.body}<p><Link href="/">← Back home</Link></p></main>;
}
