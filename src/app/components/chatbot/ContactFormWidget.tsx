"use client";

import React, { useState } from "react";

interface ContactFormWidgetProps {
  onSubmit: (formattedMessage: string) => void;
  disabled?: boolean;
}

const COUNTRY_CODES = [
  { code: "+1", country: "US / Canada", flag: "🇺🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
];

export const ContactFormWidget: React.FC<ContactFormWidgetProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || submitted) return;

    const cleanPhone = phone.trim();
    const cleanZip = zip.trim();

    const rawDigits = cleanPhone.replace(/\D/g, "");
    if (rawDigits.length !== 10 && rawDigits.length !== 11) {
      setError("Please enter a valid 10 or 11-digit contact number.");
      return;
    }

    if (!/^\d{6}$/.test(cleanZip)) {
      setError("ZIP code must be exactly 6 numeric digits.");
      return;
    }

    setError(null);
    setSubmitted(true);

    let finalPhone = cleanPhone;
    if (!finalPhone.startsWith("+")) {
      finalPhone = `${countryCode} ${finalPhone}`;
    }

    onSubmit(`${finalPhone}, ZIP: ${cleanZip}`);
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
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={disabled || submitted}
              className="col-span-5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-lg px-1.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code + c.country} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>

            {/* Box 2: Phone Number Input */}
            <input
              type="tel"
              placeholder="e.g. 6175551234"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(null);
              }}
              disabled={disabled || submitted}
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
            maxLength={6}
            placeholder="6-digit ZIP (e.g. 411001 or 021100)"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value);
              setError(null);
            }}
            disabled={disabled || submitted}
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
          disabled={disabled || submitted}
          className="w-full bg-[#023047] hover:bg-[#034262] text-white text-xs font-bold py-2 px-3 rounded-lg shadow transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {submitted ? "Submitted ✓" : "Submit Contact Info"}
        </button>
      </form>
    </div>
  );
};
