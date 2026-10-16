// src/app/car-guide/page.tsx
import { Metadata } from 'next';
import VehicleGuideClient from './VehicleGuideClient';
import {
  MIN_SUPPORTED_YEAR,
  MAX_SUPPORTED_YEAR,
} from '@/lib/nhtsa/nhtsaService';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';

export const metadata: Metadata = {
  title: 'Free US Vehicle Guide & VIN Decoder | Bionic Auto Parts',
  description:
    'Free interactive US vehicle guide powered by official NHTSA vPIC data. Decode 17-character VINs, verify make/model specifications, and check used auto parts inventory.',
  keywords: [
    'free US vehicle guide',
    'NHTSA VIN decoder',
    'vehicle specifications',
    'car parts fitment guide',
    'used auto parts compatibility',
    'vPIC database',
  ],
  alternates: {
    canonical: `${siteUrl}/car-guide`,
  },
  openGraph: {
    title: 'Free US Vehicle Guide & VIN Decoder | Bionic Auto Parts',
    description:
      'Search official NHTSA vPIC catalog specifications and check live recycled OEM parts compatibility.',
    url: `${siteUrl}/car-guide`,
    type: 'website',
  },
};

export default function CarGuidePage() {
  // Generate descending list of supported years: e.g. 2027 down to 1995
  const supportedYears: number[] = [];
  for (let y = MAX_SUPPORTED_YEAR; y >= MIN_SUPPORTED_YEAR; y--) {
    supportedYears.push(y);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bionic Auto Parts Free US Vehicle Guide',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    url: `${siteUrl}/car-guide`,
    description:
      'Free interactive US vehicle catalog lookup and VIN decoder integrating official NHTSA vPIC data with certified recycled auto parts inventory.',
    publisher: {
      '@type': 'AutoPartsStore',
      name: 'USA Used Auto Parts',
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VehicleGuideClient supportedYears={supportedYears} />
    </>
  );
}
