import type { Metadata } from 'next';
import './globals.css';
import './extra.css';

const siteUrl = 'https://solewar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SOLEWAR — Compare sneaker prices across Europe',
    template: '%s | SOLEWAR',
  },
  description: 'Compare sneaker prices from leading European retailers and find the best offer for the pair you want.',
  applicationName: 'SOLEWAR',
  alternates: { canonical: '/' },
  keywords: ['sneakers', 'sneaker price comparison', 'Nike', 'adidas', 'New Balance', 'ASICS', 'On', 'Europe'],
  openGraph: {
    title: 'SOLEWAR — Find it. Compare it. Win it.',
    description: 'One search. Multiple stores. Find the best sneaker price across Europe.',
    url: siteUrl,
    type: 'website',
    siteName: 'SOLEWAR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLEWAR — Compare sneaker prices across Europe',
    description: 'One search. Multiple stores. Find the best sneaker price across Europe.',
  },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5934148432838107"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
