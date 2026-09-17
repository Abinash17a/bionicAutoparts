import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getCategoryBySlug,
  getInventoryByVehicle,
  getActiveYears,
} from '@/lib/inventory/inventoryRepository';
import InventoryCard from '../../../../components/InventoryCard';
import VehicleQuoteBox from '../../../../components/VehicleQuoteBox';
import { ShieldCheck, Truck, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ModelPageProps {
  params: { category: string; make: string; model: string };
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const modelSlug = params.model.toLowerCase();
  const items = await getInventoryByVehicle(category.slug, makeSlug, modelSlug);
  if (items.length === 0) {
    notFound();
  }
  const makeName = items[0].make;
  const modelName = items[0].model;

  return {
    title: `Used ${makeName} ${modelName} ${category.shortTitle} | OEM Replacement & Warranty`,
    description: `Find certified recycled OEM ${makeName} ${modelName} ${category.shortTitle.toLowerCase()} with verified mileage, compression/bench testing, 6-month warranty, and fast nationwide delivery.`,
    alternates: {
      canonical: `/${category.slug}/${makeSlug}/${modelSlug}`,
    },
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const modelSlug = params.model.toLowerCase();
  const [items, availableYears] = await Promise.all([
    getInventoryByVehicle(category.slug, makeSlug, modelSlug),
    getActiveYears(category.slug, makeSlug, modelSlug),
  ]);

  if (items.length === 0) {
    notFound();
  }
  const makeName = items[0].make;
  const modelName = items[0].model;

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
          {
            '@type': 'ListItem',
            position: 4,
            name: `${makeName} ${modelName}`,
            item: `${siteUrl}/${category.slug}/${makeSlug}/${modelSlug}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `Used ${makeName} ${modelName} ${category.shortTitle}`,
        description: `Certified recycled OEM ${makeName} ${modelName} ${category.shortTitle.toLowerCase()} catalog.`,
        url: `${siteUrl}/${category.slug}/${makeSlug}/${modelSlug}`,
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
          <Link href={`/${category.slug}/${makeSlug}`} className="hover:text-blue-600 transition-colors">
            {makeName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium">{modelName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            Hollander Interchange Matched
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Used OEM {makeName} {modelName} {category.shortTitle}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-3xl mb-4 leading-relaxed">
            Find the exact replacement {category.shortTitle.toLowerCase()} for your {makeName} {modelName}. All assemblies are tested for mechanical integrity, backed by our standard 6-month warranty, and shipped via insured freight.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              6-Month Replacement Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              Direct Freight to Shop or Home
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Year Navigation */}
            {availableYears.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Select {makeName} {modelName} Model Year
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Choose your model year for exact engine codes, gear ratios, and live inventory.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableYears.map((yr) => (
                    <Link
                      key={yr}
                      href={`/${category.slug}/${makeSlug}/${modelSlug}/${yr}`}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 font-bold text-center transition-all"
                    >
                      {yr} {modelName}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Available {makeName} {modelName} Inventory
                </h2>
                <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  {items.length} Units In Stock
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
                    Looking for another year or engine trim for {makeName} {modelName}?
                  </p>
                  <p className="text-slate-500 text-sm mb-4">
                    Our salvage yard network stocks multiple trim configurations. Submit a quote request with your VIN for direct interchange verification.
                  </p>
                </div>
              )}
            </div>

            {/* Fitment & Interchange Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {makeName} {modelName} Fitment & Ordering Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Check the VIN 8th digit:</strong> For {makeName} {modelName}, the engine code is identified by the 8th character of your VIN.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Hollander Interchange:</strong> We verify all cross-year compatibility numbers before dispatching parts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Warranty Coverage:</strong> Includes internal lubricated components, cylinder block, heads, and transmission gearing for 6 months.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <VehicleQuoteBox
              vehicleDetails={{
                make: makeName,
                model: modelName,
                category: category.title,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
