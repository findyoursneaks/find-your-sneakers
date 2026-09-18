export type BrandProfile = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  categories: string[];
  theme: {
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
  };
  promo?: {
    label: string;
    value: string;
    code?: string;
    note: string;
  };
};

const profiles: Record<string, BrandProfile> = {
  moosehill: {
    slug: 'moosehill',
    name: 'Moosehill',
    eyebrow: 'OUTDOOR / ACTIVE',
    headline: 'Built to move beyond the street.',
    description: 'Hiking, cycling and active-lifestyle apparel with live product photography, current listed pricing and approved SOLEWAR affiliate links.',
    categories: ['Hiking', 'Cycling', 'Quick-dry', 'Activewear'],
    theme: {
      background: '#dfe7d8',
      surface: '#f7faf5',
      ink: '#10150f',
      muted: '#5d6859',
      accent: '#64795a',
    },
    promo: {
      label: 'SOLEWAR AUDIENCE OFFER',
      value: '15% OFF',
      code: 'SAS15',
      note: 'Eligible Moosehill purchases only. Merchant terms, stock and eligibility apply.',
    },
  },
};

const fallbackTheme = {
  background: '#ececec',
  surface: '#ffffff',
  ink: '#111111',
  muted: '#666666',
  accent: '#111111',
};

export function getBrandProfile(slug: string, name?: string): BrandProfile {
  if (profiles[slug]) return profiles[slug];
  const displayName = name || slug.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  return {
    slug,
    name: displayName,
    eyebrow: 'LIVE BRAND',
    headline: `Explore ${displayName} on SOLEWAR.`,
    description: 'Live products and approved affiliate offers currently available through SOLEWAR.',
    categories: ['Live products', 'Approved offers'],
    theme: fallbackTheme,
  };
}
