import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Find Your Sneakers — Compare sneaker prices across Europe',
  description: 'Search, compare and discover the best sneaker prices from leading European retailers.',
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}