import React from 'react';
import { Metadata } from 'next';
import PartsHubClient from './PartsHubClient';
import { getAllCategories, getAllActiveInventory } from '@/lib/inventory/inventoryRepository';
import { ShieldCheck, Truck, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Used Auto Parts by Category | Engines, Transmissions and Body Parts',
  description:
    'Find recycled OEM engines, transmissions, body parts and interior components. Search by vehicle year, make, model or part category with clear fitment, warranty and fast shipping.',
  alternates: {
    canonical: '/parts',
  },
  openGraph: {
    title: 'Used Auto Parts by Category | Engines, Transmissions and Body Parts',
    description:
      'Search our comprehensive catalog of verified recycled OEM auto parts with 6-month warranty and nationwide freight delivery.',
    url: '/parts',
  },
};

export default async function PartsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';
  const [categories, inventory] = await Promise.all([
    getAllCategories(),
    getAllActiveInventory(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Auto Parts Catalog',
            item: `${siteUrl}/parts`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Used Auto Parts Catalog by Category',
        description: 'Certified recycled OEM auto parts, engines, transmissions, body panels, and cabin parts.',
        url: `${siteUrl}/parts`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Catalog Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            Nationwide Salvage & Recycled OEM Inventory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Commercial Used Auto Parts Catalog
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-3xl mb-6 leading-relaxed">
            Source tested OEM engines, bench-tested transmissions, and original body panels. Every mechanical part is backed by our 6-month replacement warranty and delivered directly to your shop or driveway.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              6-Month Standard Warranty
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <Truck className="w-4 h-4 text-emerald-400" />
              Insured Freight Across All 50 States
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <Wrench className="w-4 h-4 text-amber-400" />
              Hollander Interchange Compatibility
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PartsHubClient initialCategories={categories} initialInventory={inventory} />
      </div>
    </div>
  );
}
