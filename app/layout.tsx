import type { Metadata } from 'next';
import './globals.css';
import './extra.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://findyoursneakers.com'),
  title: {
    default: 'Find Your Sneakers — Compare sneaker prices across Europe',
    template: '%s | Find Your Sneakers',
  },
  description: 'Search, compare and discover sneaker prices from leading European retailers.',
  applicationName: 'Find Your Sneakers',
  openGraph: {
    title: 'Find Your Sneakers',
    description: 'Find the right sneaker. At the right price.',
    type: 'website',
    siteName: 'Find Your Sneakers',
  },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
