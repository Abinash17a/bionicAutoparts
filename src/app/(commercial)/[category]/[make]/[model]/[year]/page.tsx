import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getCategoryBySlug,
  getInventoryByVehicle,
  getRelatedInventory,
} from '@/lib/inventory/inventoryRepository';
import InventoryCard from '../../../../../components/InventoryCard';
import VehicleQuoteBox from '../../../../../components/VehicleQuoteBox';
import { ShieldCheck, Truck, Wrench, ChevronRight, CircleHelp, Phone } from 'lucide-react';

interface YearModelPageProps {
  params: { category: string; make: string; model: string; year: string };
}

export async function generateMetadata({ params }: YearModelPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const modelSlug = params.model.toLowerCase();
  const year = params.year;
  const items = await getInventoryByVehicle(category.slug, makeSlug, modelSlug, year);
  if (items.length === 0) {
    notFound();
  }
  const makeName = items[0].make;
  const modelName = items[0].model;

  return {
    title: `${year} ${makeName} ${modelName} Used ${category.shortTitle} | OEM Fitment & Warranty`,
    description: `Buy tested OEM ${year} ${makeName} ${modelName} used ${category.shortTitle.toLowerCase()}. Tested compression/gears, verified donor mileage, 6-month warranty, Hollander interchange, and nationwide freight.`,
    alternates: {
      canonical: `/${category.slug}/${makeSlug}/${modelSlug}/${year}`,
    },
    openGraph: {
      title: `${year} ${makeName} ${modelName} Used ${category.shortTitle}`,
      description: `Buy tested OEM ${year} ${makeName} ${modelName} used ${category.shortTitle.toLowerCase()} with warranty and freight delivery.`,
      url: `/${category.slug}/${makeSlug}/${modelSlug}/${year}`,
    },
  };
}

export default async function YearModelPage({ params }: YearModelPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const makeSlug = params.make.toLowerCase();
  const modelSlug = params.model.toLowerCase();
  const year = params.year;

  const [items, relatedParts] = await Promise.all([
    getInventoryByVehicle(category.slug, makeSlug, modelSlug, year),
    getRelatedInventory(makeSlug, modelSlug, year, category.slug),
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
          {
            '@type': 'ListItem',
            position: 5,
            name: `${year} ${modelName}`,
            item: `${siteUrl}/${category.slug}/${makeSlug}/${modelSlug}/${year}`,
          },
        ],
      },
      {
        '@type': 'ItemPage',
        name: `${year} ${makeName} ${modelName} Used ${category.shortTitle}`,
        description: `Tested recycled OEM ${year} ${makeName} ${modelName} ${category.shortTitle.toLowerCase()} replacement assemblies with verified interchange and 6-month warranty.`,
        url: `${siteUrl}/${category.slug}/${makeSlug}/${modelSlug}/${year}`,
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
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href={`/${category.slug}`} className="hover:text-blue-600 transition-colors">
            {category.shortTitle}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href={`/${category.slug}/${makeSlug}`} className="hover:text-blue-600 transition-colors">
            {makeName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href={`/${category.slug}/${makeSlug}/${modelSlug}`} className="hover:text-blue-600 transition-colors">
            {modelName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-bold">{year}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
            ✓ Genuine Recycled OEM Auto Parts
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {year} {makeName} {modelName} Used {category.shortTitle}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-3xl mb-6 leading-relaxed">
            Direct replacement {category.shortTitle.toLowerCase()} for {year} {makeName} {modelName}. Sourced from clean recycled donor vehicles, rigorously tested for compression and mechanical operation, and protected with our 6-month replacement warranty.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-blue-200">
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              6-Month Standard Warranty
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <Truck className="w-4 h-4 text-emerald-400" />
              Insured Freight Delivery (3-5 Days)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <Wrench className="w-4 h-4 text-amber-400" />
              Hollander Interchange Verified
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Matching In-Stock Inventory Units */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Matching {year} {makeName} {modelName} Units
                  </h2>
                  <p className="text-sm text-slate-500">
                    Exact fitment units inspected and ready for crated freight dispatch
                  </p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  {items.length} {items.length === 1 ? 'Unit In Stock' : 'Units In Stock'}
                </span>
              </div>

              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <InventoryCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
                  <CircleHelp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Request Live Salvage Yard Inventory
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-4 leading-relaxed">
                    While an online catalog unit is being photographed or prepared, our network carries additional {year} {makeName} {modelName} {category.shortTitle.toLowerCase()} ready to ship. Submit your VIN below for a free guaranteed fitment quote.
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specifications & Vehicle Fitment Instructions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {year} {makeName} {modelName} OEM Interchange & Fitment Guidelines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Vehicle Specification</span>
                  <p className="font-semibold text-slate-800">{year} {makeName} {modelName}</p>
                  <p className="text-xs text-slate-600 mt-1">Direct factory replacement assembly adhering to OEM engineering specs.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">VIN Compatibility</span>
                  <p className="font-semibold text-slate-800">17-Digit VIN Verification</p>
                  <p className="text-xs text-slate-600 mt-1">Our technicians match the 8th VIN digit (engine code) or 10th VIN digit (year code) before shipping.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Testing & Certification</span>
                  <p className="font-semibold text-emerald-700">Compression & Functional Tested</p>
                  <p className="text-xs text-slate-600 mt-1">Engines compression checked; transmissions bench shifted and pan inspected.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Freight & Logistics</span>
                  <p className="font-semibold text-slate-800">Crated Pallet Delivery</p>
                  <p className="text-xs text-slate-600 mt-1">Secured in protective wooden crates with liftgate assistance available for residential delivery.</p>
                </div>
              </div>

              {/* Warranty & Return Disclosures */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Warranty Terms & Installation Requirements</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  All {category.shortTitle.toLowerCase()} assemblies include our 6-Month Standard Replacement Warranty covering internal lubricated parts, engine cylinder blocks, cylinder heads, and transmission gear assemblies. Wear-and-tear accessory components (belts, spark plugs, water pumps, sensors, gaskets) must be replaced prior to installation as standard automotive protocol.
                </p>
                <Link href="/refunds" className="text-blue-600 text-xs font-semibold hover:underline">
                  Read complete returns and refund policy guidelines &rarr;
                </Link>
              </div>
            </div>

            {/* Related Parts for this Vehicle */}
            {relatedParts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Other Available Parts for {year} {makeName} {modelName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedParts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/parts/${rel.id}`}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {rel.partName}
                        </p>
                        <p className="text-xs text-slate-500">{rel.categoryName} • {rel.priceFormatted}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VehicleQuoteBox
              vehicleDetails={{
                year,
                make: makeName,
                model: modelName,
                category: category.title,
              }}
            />

            {/* Quick Contact Assistance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-base mb-1">Need Immediate Fitment Help?</h4>
              <p className="text-xs text-slate-600 mb-4">
                Our parts specialists can verify Hollander interchange over the phone right now.
              </p>
              <a
                href="tel:16175163140"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
              >
                (617) 516-3140
              </a>
              <p className="text-[11px] text-slate-400 mt-2">Mon–Fri 9AM–5PM ET • Sat 10AM–2PM ET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
