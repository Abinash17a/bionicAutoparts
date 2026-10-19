import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getCategoryBySlug,
  getActiveMakes,
  CATEGORIES,
} from '@/lib/inventory/inventoryRepository';
import VehicleQuoteBox from '../../components/VehicleQuoteBox';
import { ShieldCheck, Truck, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: {
      canonical: `/${category.slug}`,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `/${category.slug}`,
      images: [{ url: category.image, alt: category.title }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const availableMakes = await getActiveMakes(category.slug);

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
        ],
      },
      {
        '@type': 'CollectionPage',
        name: category.title,
        description: category.metaDescription,
        url: `${siteUrl}/${category.slug}`,
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
          <span className="text-slate-800 font-medium">{category.shortTitle}</span>
        </div>
      </div>

      {/* Category Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
              Certified Recycled OEM Auto Parts
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {category.title}
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-6 leading-relaxed">
              {category.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-blue-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                6-Month Standard Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                Nationwide Commercial Freight
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                Hollander Interchange Matched
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Inventory & Makes */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Make Drill-Down */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Browse {category.shortTitle} by Popular Makes
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Select your vehicle make to view verified OEM compatibility and inventory.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableMakes.map((make) => (
                  <Link
                    key={make.slug}
                    href={`/${category.slug}/${make.slug}`}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 font-semibold text-sm transition-all flex items-center justify-between group"
                  >
                    <span>{make.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>


            {/* Testing and Quality Assurance Standards */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Our Certified Inspection Process
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Every {category.shortTitle.toLowerCase()} assembly undergoes thorough quality testing prior to inventory entry:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.inspectionDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Fitment Quote Form */}
          <div className="space-y-6">
            <VehicleQuoteBox vehicleDetails={{ category: category.title }} />

            {/* Warranty & Returns Info Box */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-base">Warranty & Guarantee</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {category.warrantySummary}
              </p>
              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                <Link href="/refunds" className="text-blue-600 hover:underline font-medium">
                  Read full warranty and 30-day refund policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
