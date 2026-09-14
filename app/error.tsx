'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="legal-page"><a className="logo" href="/">SOLEWAR</a><h1>We couldn’t load this page.</h1><p>Please try again in a moment. If the problem continues, contact hello@solewar.com.</p><button className="buy" onClick={reset}>Try again</button></main>;
}
