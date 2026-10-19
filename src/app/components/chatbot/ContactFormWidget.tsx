"use client";

import React, { useState, useEffect } from "react";
import {
  CONTACT_COUNTRIES,
  detectDefaultCountry,
  findCountryByDialDigits,
  formatContactMessage,
  getCountry,
  normalizePhone,
  normalizePostal,
} from "@/lib/tony_beta3/contact_rules";

interface ContactFormWidgetProps {
  onSubmit: (formattedMessage: string) => void;
  disabled?: boolean;
}

export const ContactFormWidget: React.FC<ContactFormWidgetProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const [iso, setIso] = useState("US");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const country = getCountry(iso)!;

  // Auto-detect country based on browser timezone/locale on mount (client-only to avoid SSR hydration mismatch)
  useEffect(() => {
    const detected = detectDefaultCountry();
    if (detected && detected !== "US") {
      setIso(detected);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // a request is already processing

    const p = normalizePhone(iso, phone);
    if (!p.ok) return setError(p.error);
    const z = normalizePostal(iso, zip);
    if (!z.ok) return setError(z.error);

    setError(null);
    onSubmit(formatContactMessage(iso, p.value, z.value));
  };
  return (
    <div className="mt-3 bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-blue-200 dark:border-slate-700 shadow-sm text-left">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
          Contact Details
        </span>
        <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
          Final Step
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Phone Number Section */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-12 gap-1.5">
            {/* Box 1: Country Code Selector */}
            <select
              value={iso}
              onChange={(e) => { setIso(e.target.value); setError(null); }}
              disabled={disabled}
              className="col-span-5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-lg px-1.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CONTACT_COUNTRIES.map((c) => (
                <option key={c.iso} value={c.iso} title={c.name}>
                  {c.flag} {c.iso} +{c.dial}
                </option>
              ))}
            </select>

            {/* Box 2: Phone Number Input */}
            <input
              type="tel"
              placeholder="National number"
              value={phone}
              onChange={(e) => {
                const val = e.target.value;
                setPhone(val);
                setError(null);

                const trimmed = val.trim();
                if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
                  const digits = (trimmed.startsWith("00") ? trimmed.slice(2) : trimmed.slice(1)).replace(/\D/g, "");
                  const matched = findCountryByDialDigits(digits);
                  if (matched && matched.iso !== iso) {
                    setIso(matched.iso);
                  }
                } else {
                  const digits = trimmed.replace(/\D/g, "");
                  const matched = findCountryByDialDigits(digits);
                  if (matched && matched.iso !== iso && matched.national.test(digits.slice(matched.dial.length))) {
                    setIso(matched.iso);
                  } else if (iso === "US" && digits.length === 10 && /^[6-9]\d{9}$/.test(digits) && (digits[3] === "0" || digits[3] === "1")) {
                    setIso("IN");
                  }
                }
              }}
              disabled={disabled}
              className="col-span-7 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ZIP Code Section (directly below phone number) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            ZIP / Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`${country.name}: ${country.postalExample}`}
            value={zip}
            onChange={(e) => {
              setZip(e.target.value);
              setError(null);
            }}
            disabled={disabled}
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {error && (
          <p className="text-[11px] text-red-500 font-medium leading-tight">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-[#023047] hover:bg-[#034262] text-white text-xs font-bold py-2 px-3 rounded-lg shadow transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {disabled ? "Submitting…" : "Submit Contact Info"}
        </button>
      </form>
    </div>
  );
};
