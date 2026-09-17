import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getCategoryBySlug,
  getInventoryByVehicle,
  getActiveModels,
} from '@/lib/inventory/inventoryRepository';
import InventoryCard from '../../../components/InventoryCard';
import VehicleQuoteBox from '../../../components/VehicleQuoteBox';
import { ShieldCheck, Truck, ChevronRight } from 'lucide-react';

interface MakePageProps {
  params: { category: string; make: string };
}

export async function generateMetadata({ params }: MakePageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const items = await getInventoryByVehicle(category.slug, makeSlug);
  if (items.length === 0) {
    notFound();
  }
  const makeName = items[0].make;

  return {
    title: `Used OEM ${makeName} ${category.shortTitle} | Tested & Warrantied`,
    description: `Shop genuine recycled OEM ${makeName} ${category.shortTitle.toLowerCase()} with compression/bench testing, 6-month replacement warranty, and nationwide freight shipping.`,
    alternates: {
      canonical: `/${category.slug}/${makeSlug}`,
    },
  };
}

export default async function MakePage({ params }: MakePageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const [items, availableModels] = await Promise.all([
    getInventoryByVehicle(category.slug, makeSlug),
    getActiveModels(category.slug, makeSlug),
  ]);

  if (items.length === 0) {
    notFound();
  }
  const makeName = items[0].make;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';

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
            name: category.title,
            item: `${siteUrl}/${category.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${makeName} ${category.shortTitle}`,
            item: `${siteUrl}/${category.slug}/${makeSlug}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `Used OEM ${makeName} ${category.shortTitle}`,
        description: `Verified recycled OEM ${makeName} ${category.shortTitle.toLowerCase()} inventory.`,
        url: `${siteUrl}/${category.slug}/${makeSlug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/${category.slug}`} className="hover:text-blue-600 transition-colors">
            {category.shortTitle}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium">{makeName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            OEM Compatibility Verified
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Used OEM {makeName} {category.shortTitle}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-3xl mb-4 leading-relaxed">
            Browse genuine recycled {makeName} {category.shortTitle.toLowerCase()} sourced from low-mileage donor vehicles. Every assembly is inspected, tested, and protected by our 6-month replacement warranty.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              6-Month Replacement Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              Nationwide Commercial & Residential Freight
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Models Navigation */}
            {availableModels.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-3">
                  Select {makeName} Model
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableModels.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/${category.slug}/${makeSlug}/${m.slug}`}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 font-semibold text-sm transition-all flex items-center justify-between group"
                    >
                      <span>{m.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  In-Stock {makeName} {category.shortTitle}
                </h2>
                <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  {items.length} Units Available
                </span>
              </div>

              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <InventoryCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                  <p className="text-slate-700 font-semibold mb-2">
                    Looking for a specific {makeName} {category.shortTitle.toLowerCase()}?
                  </p>
                  <p className="text-slate-500 text-sm mb-4">
                    Our salvage yard network has thousands of {makeName} parts arriving weekly. Submit a quote request with your model and year.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <VehicleQuoteBox vehicleDetails={{ make: makeName, category: category.title }} />
          </div>
        </div>
      </div>
    </div>
  );
}
