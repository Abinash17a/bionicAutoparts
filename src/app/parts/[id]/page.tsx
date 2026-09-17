import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getInventoryById, getRelatedInventoryByMake } from '@/lib/inventory/inventoryRepository';
import VehicleQuoteBox from '../../components/VehicleQuoteBox';
import {
  ShieldCheck,
  Truck,
  ChevronRight,
  Phone,
  RotateCcw,
  FileText,
} from 'lucide-react';

interface PartDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PartDetailPageProps): Promise<Metadata> {
  const item = await getInventoryById(params.id);

  if (!item) {
    notFound();
  }

  return {
    title: `${item.year} ${item.make} ${item.model} ${item.partName} | Used OEM Part ${item.id}`,
    description: `Buy genuine used OEM ${item.year} ${item.make} ${item.model} ${item.partName}. Hollander: ${item.interchangeNumber}, OEM: ${item.oemPartNumber}. Grade A tested with 6-month warranty and freight delivery.`,
    alternates: {
      canonical: `/parts/${item.id}`,
    },
    openGraph: {
      title: `${item.year} ${item.make} ${item.model} ${item.partName}`,
      description: `Grade A Tested OEM ${item.partName} with 6-Month Warranty. Stock ID: ${item.id}`,
      url: `/parts/${item.id}`,
      images: [{ url: item.image, alt: item.partName }],
    },
  };
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const item = await getInventoryById(params.id);

  if (!item) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';

  // Real Product Schema matching visible content
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
            name: item.categoryName,
            item: `${siteUrl}/${item.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${item.year} ${item.make} ${item.model}`,
            item: `${siteUrl}/${item.categorySlug}/${item.makeSlug}/${item.modelSlug}/${item.year}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: item.partName,
            item: `${siteUrl}/parts/${item.id}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: `${item.year} ${item.make} ${item.model} ${item.partName}`,
        image: [`${siteUrl}${item.image}`],
        description: item.fitmentNotes,
        sku: item.id,
        mpn: item.oemPartNumber,
        brand: {
          '@type': 'Brand',
          name: item.make,
        },
        itemCondition: 'https://schema.org/UsedCondition',
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/parts/${item.id}`,
          priceCurrency: 'USD',
          price: item.price,
          availability:
            item.availability === 'In Stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
          itemCondition: 'https://schema.org/UsedCondition',
          warranty: item.warranty,
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'US',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
          },
        },
      },
    ],
  };

  // Related parts from the same make
  const relatedParts = await getRelatedInventoryByMake(item.makeSlug, item.id, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href={`/${item.categorySlug}`} className="hover:text-blue-600 transition-colors">
            {item.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href={`/${item.categorySlug}/${item.makeSlug}/${item.modelSlug}/${item.year}`}
            className="hover:text-blue-600 transition-colors"
          >
            {item.year} {item.make} {item.model}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-bold font-mono">{item.id}</span>
        </div>
      </div>

      {/* Product Detail Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 overflow-hidden">
              <div className="relative h-80 sm:h-[420px] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                <Image
                  src={item.image}
                  alt={item.partName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
                  {item.categoryName}
                </div>
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  {item.availability}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span>Stock Item ID: <strong className="font-mono text-slate-800">{item.id}</strong></span>
                <span>Interchange #{item.interchangeNumber}</span>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Verified OEM Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Vehicle Fitment</span>
                  <span className="font-bold text-slate-900 text-base">{item.year} {item.make} {item.model}</span>
                  {item.trim && <span className="text-xs text-slate-500 block mt-0.5">Trim: {item.trim}</span>}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Hollander Interchange</span>
                  <span className="font-mono font-bold text-blue-700 text-base">{item.interchangeNumber}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">OEM Ref: {item.oemPartNumber}</span>
                </div>

                {item.engineCode && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Engine Designation</span>
                    <span className="font-semibold text-slate-900">{item.engineCode}</span>
                  </div>
                )}

                {item.transmissionCode && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Transmission Code</span>
                    <span className="font-semibold text-slate-900">{item.transmissionCode}</span>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Donor Vehicle</span>
                  <span className="font-semibold text-slate-900 block">{item.donorVehicle}</span>
                  <span className="text-xs text-slate-500 font-mono">VIN: {item.donorVin}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Verified Mileage</span>
                  <span className="font-bold text-slate-900">{item.donorMileage}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 sm:col-span-2">
                  <span className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">Inspection Condition</span>
                  <span className="font-semibold text-emerald-800">{item.condition}</span>
                </div>
              </div>

              {/* Fitment Notes */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Detailed Fitment & Inclusions</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  {item.fitmentNotes}
                </p>
              </div>
            </div>

            {/* Trust Policies Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Protection & Shipping Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="font-bold text-slate-900 mb-1">6-Month Warranty</p>
                  <p className="text-slate-600">{item.warranty}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="font-bold text-slate-900 mb-1">Freight Shipping</p>
                  <p className="text-slate-600">{item.shipping}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-5 h-5 text-amber-600 mb-2" />
                  <p className="font-bold text-slate-900 mb-1">30-Day Return Period</p>
                  <p className="text-slate-600">Satisfaction guaranteed with pre-authorized return label.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price Card & Immediate Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Stock ID: {item.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
                {item.year} {item.make} {item.model} {item.partName}
              </h1>

              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 mb-6">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-slate-600 font-semibold uppercase">Recycled OEM Price</span>
                  <span className="text-xs text-emerald-700 font-bold">In Stock & Verified</span>
                </div>
                <div className="text-4xl font-black text-blue-700">
                  {item.priceFormatted}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Includes 6-month warranty + insured commercial freight delivery.
                </p>
              </div>

              {/* Instant Call to Order */}
              <div className="space-y-3 mb-6">
                <a
                  href="tel:16175163140"
                  className="w-full inline-flex items-center justify-center py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call to Order: (617) 516-3140
                </a>
                <p className="text-center text-xs text-slate-500">
                  Mention Stock ID <strong className="font-mono text-slate-800">{item.id}</strong> for instant reservation.
                </p>
              </div>

              {/* Online Quote / Fitment Confirmation Form */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Request Fitment Check & Freight Quote
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Prefer an online quote? Enter your shipping zip code and details below for a formal invoice.
                </p>
                <VehicleQuoteBox
                  vehicleDetails={{
                    year: item.year,
                    make: item.make,
                    model: item.model,
                    partName: `${item.partName} (Stock: ${item.id})`,
                  }}
                />
              </div>
            </div>

            {/* Related Inventory Items */}
            {relatedParts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base mb-3">
                  Other {item.make} Recycled Parts
                </h4>
                <div className="space-y-3">
                  {relatedParts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/parts/${rel.id}`}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                          {rel.year} {rel.make} {rel.model} - {rel.partName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">{rel.priceFormatted} • Stock #{rel.id}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
