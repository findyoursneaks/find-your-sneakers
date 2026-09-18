import type { Metadata } from 'next';
import './globals.css';
import './extra.css';

const siteUrl = 'https://solewar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SOLEWAR — Sneakers, outdoor gear & better deals',
    template: '%s | SOLEWAR',
  },
  description: 'Discover sneakers and outdoor performance gear, compare retailer offers and find selected affiliate promotions on SOLEWAR.',
  applicationName: 'SOLEWAR',
  alternates: { canonical: '/' },
  keywords: ['sneakers', 'outdoor gear', 'hiking pants', 'price comparison', 'Moosehill', 'Nike', 'adidas', 'New Balance', 'ASICS', 'On', 'Europe'],
  openGraph: {
    title: 'SOLEWAR — Sneakers, outdoor gear & better deals',
    description: 'Product discovery, retailer offers and selected promotions for sneakers and outdoor performance gear.',
    url: siteUrl,
    type: 'website',
    siteName: 'SOLEWAR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLEWAR — Sneakers, outdoor gear & better deals',
    description: 'Discover products, compare offers and shop smarter.',
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
