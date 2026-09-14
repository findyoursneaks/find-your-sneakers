import Link from 'next/link';
export default function NotFound() {
  return <main className="legal-page"><Link className="logo" href="/">SOLEWAR</Link><h1>This page isn’t available.</h1><p>The model or page may have moved.</p><Link className="buy" href="/search">Browse sneakers</Link></main>;
}
