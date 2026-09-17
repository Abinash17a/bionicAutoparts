import Link from 'next/link';
import { Metadata } from 'next';
import { Home, Phone, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The requested auto parts page or vehicle listing could not be found. Explore our catalog of used OEM engines, transmissions, and auto body parts.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-slate-200">
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-4">
          Error 404 • Resource Not Found
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Auto Part Or Page Not Found
        </h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          The vehicle part or URL you requested could not be located in our active inventory. It may have been sold, updated, or moved to another catalog category.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          <Link
            href="/used-engines"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800 group-hover:text-blue-600">Used OEM Engines</p>
              <p className="text-xs text-slate-500">Tested compression with 6-month warranty</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/used-transmissions"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800 group-hover:text-blue-600">Used Transmissions</p>
              <p className="text-xs text-slate-500">Automatic & manual OEM assemblies</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/parts"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800 group-hover:text-blue-600">Browse All Categories</p>
              <p className="text-xs text-slate-500">Body, interior, mechanical parts</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800 group-hover:text-blue-600">Request Custom Quote</p>
              <p className="text-xs text-slate-500">Speak with an automotive parts specialist</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
          <a
            href="tel:16175163140"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Parts Hotline: (617) 516-3140
          </a>
        </div>
      </div>
    </div>
  );
}
