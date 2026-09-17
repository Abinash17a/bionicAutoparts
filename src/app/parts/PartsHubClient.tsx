"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryMeta, InventoryItem } from '@/lib/inventory/inventoryRepository';
import InventoryCard from '../components/InventoryCard';
import { Search, ChevronRight, Layers } from 'lucide-react';

const POPULAR_MAKES = [
  { name: 'Toyota', slug: 'toyota', logo: '/car-logos/toyota.png' },
  { name: 'Ford', slug: 'ford', logo: '/car-logos/ford.png' },
  { name: 'Chevy', slug: 'chevy', logo: '/car-logos/chevrolet.png' },
  { name: 'Honda', slug: 'honda', logo: '/car-logos/honda.png' },
  { name: 'BMW', slug: 'bmw', logo: '/car-logos/bmw.png' },
  { name: 'Nissan', slug: 'nissan', logo: '/car-logos/nissan.png' },
  { name: 'Jeep', slug: 'jeep', logo: '/car-logos/jeep.png' },
  { name: 'Dodge', slug: 'dodge', logo: '/car-logos/dodge.png' },
];

interface PartsHubClientProps {
  initialCategories?: CategoryMeta[];
  initialInventory?: InventoryItem[];
}

export default function PartsHubClient({
  initialCategories,
  initialInventory,
}: PartsHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = (initialCategories || []).filter(c => c.slug !== 'used-auto-parts');

  const inventorySource = initialInventory !== undefined
    ? initialInventory
    : [];

  const filteredInventory = inventorySource.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categorySlug === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Category Discovery Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-slate-500 text-sm">Select a major component family to view certified recycled OEM assemblies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-500 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white font-bold text-base drop-shadow">
                    {cat.shortTitle}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {cat.heroDescription}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-600 pt-3 border-t border-slate-100">
                <span>Browse {cat.shortTitle} Catalog</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Makes Shortcut */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Browse by Vehicle Make</h2>
        <p className="text-slate-500 text-sm mb-6">Direct access to recycled OEM engines, transmissions, and parts for top automakers</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {POPULAR_MAKES.map((make) => (
            <Link
              key={make.slug}
              href={`/used-engines/${make.slug}`}
              className="flex flex-col items-center p-3 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-center group"
            >
              <div className="w-12 h-12 relative mb-2 flex items-center justify-center">
                <Image
                  src={make.logo}
                  alt={`${make.name} logo`}
                  width={40}
                  height={40}
                  className="object-contain max-h-10 group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                {make.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Inventory Explorer & Search */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Live In-Stock Inventory</h2>
            <p className="text-slate-500 text-sm">
              Verified OEM assemblies with donor VIN documentation and compression test records
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, engine code, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Parts ({inventorySource.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === c.slug
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.shortTitle}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No exact inventory match found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
              We carry hundreds of unlisted assemblies in our warehouse partner network. Submit a quick quote request with your vehicle details.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Submit Custom Part Request
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
