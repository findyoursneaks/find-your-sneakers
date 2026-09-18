import type { Metadata } from 'next';
import './globals.css';
import './extra.css';
import './brand-system.css';

const siteUrl = 'https://solewar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SOLEWAR — Live brands, products & offers',
    template: '%s | SOLEWAR',
  },
  description: 'Discover brands that are live on SOLEWAR, browse real products and follow active affiliate offers.',
  applicationName: 'SOLEWAR',
  alternates: { canonical: '/' },
  keywords: ['SOLEWAR', 'brands', 'outdoor gear', 'product discovery', 'affiliate offers', 'Moosehill', 'Europe'],
  openGraph: {
    title: 'SOLEWAR — Live brands, products & offers',
    description: 'Brand-led product discovery with real catalogue items and active affiliate destinations.',
    url: siteUrl,
    type: 'website',
    siteName: 'SOLEWAR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLEWAR — Live brands, products & offers',
    description: 'Discover active brands, real products and live offers.',
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
