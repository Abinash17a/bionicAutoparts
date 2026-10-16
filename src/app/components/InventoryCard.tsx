"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { InventoryItem } from '@/lib/inventory/inventoryRepository';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  const defaultFallback = item.categorySlug === 'used-transmissions' 
    ? '/cardcarpartsmpage.jpg'
    : item.categorySlug === 'used-body-parts'
    ? '/mainpage2.jpg'
    : item.categorySlug === 'used-interior-parts'
    ? '/cardinteriormpage.jpg'
    : '/cardmpageengine.jpg';

  const [imgSrc, setImgSrc] = useState(item.image || defaultFallback);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header & Image */}
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
          <img
            src={imgSrc}
            alt={item.partName}
            onError={() => setImgSrc(defaultFallback)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {item.categoryName}
          </div>
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {item.availability}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5">
          <div className="text-xs text-slate-500 font-medium mb-1">
            Stock ID: <span className="font-mono text-slate-700">{item.id}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-3">
            {item.year} {item.make} {item.model} {item.partName}
          </h3>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {item.engineCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Engine / Spec:</span>
                <span className="font-semibold text-slate-800 text-right">{item.engineCode}</span>
              </div>
            )}
            {item.transmissionCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Transmission:</span>
                <span className="font-semibold text-slate-800 text-right">{item.transmissionCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Hollander / OEM:</span>
              <span className="font-semibold text-slate-800">{item.interchangeNumber} / {item.oemPartNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Donor Vehicle:</span>
              <span className="font-semibold text-slate-800">{item.donorMileage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Condition:</span>
              <span className="text-emerald-700 font-medium">Grade A Tested</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>6-Month Replacement Warranty Included</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Commercial Freight Dispatch (3-5 Days)</span>
          </div>
        </div>
      </div>

      {/* Footer Section with Price & Action */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block">Recycled OEM Price</span>
          <span className="text-2xl font-black text-blue-700">{item.priceFormatted}</span>
        </div>
        <Link
          href={`/parts/${item.id}`}
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}
