import Link from 'next/link';
import { getActiveBrands, getProducts } from '../../lib/data';
import { getBrandProfile } from '../../lib/brand-config';

export const revalidate = 300;

export const metadata = {
  title: 'Brands — SOLEWAR',
  description: 'Explore brands currently live on SOLEWAR with active commercial offers.',
};

export default async function BrandsPage() {
  const [brands, products] = await Promise.all([getActiveBrands(), getProducts()]);

  return <main className="brands-page">
    <div className="brand-page-nav">
      <Link className="logo war-logo" href="/"><span>SOLE</span><b>WAR</b></Link>
      <div><Link href="/search">Products</Link><Link href="/about">About</Link></div>
    </div>

    <section className="brands-intro">
      <span className="hero-kicker">ACTIVE BRANDS</span>
      <h1>Only brands that are actually live.</h1>
      <p>SOLEWAR does not present demo brands as commercial partners. A brand appears here only when there is an active offer or approved affiliate destination.</p>
    </section>

    <section className="brands-grid">
      {brands.map(brand => {
        const profile = getBrandProfile(brand.slug, brand.name);
        const brandProducts = products.filter(product => product.brands?.slug === brand.slug);
        const image = brandProducts.find(product => product.image_url || product.images?.[0]);
        return <Link
          key={brand.id}
          href={`/brands/${brand.slug}`}
          className="brand-card"
          style={{
            background: profile.theme.background,
            color: profile.theme.ink,
          }}
        >
          <div>
            <small>{profile.eyebrow}</small>
            <h2>{profile.name}</h2>
            <p>{profile.headline}</p>
            <span>{brandProducts.length} live products →</span>
          </div>
          {image && <img src={image.image_url || image.images?.[0] || ''} alt={profile.name} />}
        </Link>;
      })}
    </section>
  </main>;
}
