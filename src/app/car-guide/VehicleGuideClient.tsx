// src/app/car-guide/VehicleGuideClient.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  RefreshCw,
  FileText,
  Send,
} from "lucide-react";
import {
  MakeOption,
  DecodedVehicle,
  VehicleVerificationResult,
} from "@/lib/nhtsa/types";
import InventoryCard from "../components/InventoryCard";
import VinInquiryModal from "./VinInquiryModal";

interface Props {
  initialPopularMakes?: MakeOption[];
  initialAllMakes?: MakeOption[];
  supportedYears: number[];
}

export default function VehicleGuideClient({
  supportedYears,
}: Props) {
  // VIN Lookup State
  const [vinInput, setVinInput] = useState<string>("");
  const [vinError, setVinError] = useState<string | null>(null);
  const [decodingVin, setDecodingVin] = useState<boolean>(false);
  const [decodedVinResult, setDecodedVinResult] = useState<DecodedVehicle | null>(null);

  // Vehicle Verification & Inventory State (populated automatically on VIN decode)
  const [verificationResult, setVerificationResult] = useState<VehicleVerificationResult | null>(null);

  // Inquiry Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);

  // Live VIN Formatting & Validation
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/\s+/g, "");
    if (val.length > 17) {
      val = val.slice(0, 17);
    }
    setVinInput(val);

    if (/[IOQ]/.test(val)) {
      setVinError("VINs cannot contain letters I, O, or Q (to avoid confusion with 1 and 0).");
    } else {
      setVinError(null);
    }
  };

  // Decode VIN and automatically verify catalog + inventory match
  const decodeAndMatchVin = async (rawVin: string) => {
    const cleanVin = rawVin.trim().toUpperCase();

    if (cleanVin.length !== 17) {
      setVinError("VIN must be exactly 17 characters long.");
      return;
    }

    if (/[IOQ]/.test(cleanVin)) {
      setVinError("VIN contains illegal characters (I, O, or Q).");
      return;
    }

    setDecodingVin(true);
    setVinError(null);

    try {
      const res = await fetch(`/api/car-guide/decode-vin?vin=${encodeURIComponent(cleanVin)}`);
      const data: DecodedVehicle = await res.json();

      if (!res.ok) {
        setVinError(data.errorText || (data as unknown as { error?: string }).error || "NHTSA was unable to decode this VIN.");
        setDecodedVinResult(null);
        setVerificationResult(null);
      } else {
        setDecodedVinResult(data);

        // Automatically cross-reference NHTSA catalog & Bionic Auto Parts inventory if make/model/year decoded
        if (data.make && data.model && data.modelYear) {
          try {
            const verifyUrl = `/api/car-guide/verify?make=${encodeURIComponent(data.make)}&model=${encodeURIComponent(data.model)}&year=${encodeURIComponent(data.modelYear)}`;
            const verifyRes = await fetch(verifyUrl);
            if (verifyRes.ok) {
              const verifyData: VehicleVerificationResult = await verifyRes.json();
              setVerificationResult(verifyData);
            } else {
              setVerificationResult(null);
            }
          } catch {
            setVerificationResult(null);
          }
        } else {
          setVerificationResult(null);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "VIN decoding timed out or failed.";
      setVinError(msg);
    } finally {
      setDecodingVin(false);
    }
  };

  // Handle Decode VIN form submission
  const handleDecodeVin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await decodeAndMatchVin(vinInput);
  };

  return (
    <div className="w-full">
      {/* Compact Hero Header */}
      <section className="bg-gradient-to-b from-[#023047] to-[#034466] text-white pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-10 lg:pb-8 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2 sm:mb-3 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Official NHTSA vPIC Catalog & VIN Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-2.5 drop-shadow-sm">
            Free US Vehicle Guide
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed mb-2 sm:mb-2.5">
            Decode 17-character VINs with official US DOT NHTSA data, verify factory build specifications, and
            cross-reference recycled OEM auto parts from the USA Used Auto Parts inventory.
          </p>
          <p className="text-[11px] sm:text-xs text-blue-300/80">
            Covers US DOT standard passenger & truck models (1995–{supportedYears[0] || 2026})
          </p>
        </div>
      </section>

      {/* Main Interactive Guide Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Form: VIN Lookup */}
          <div className="lg:col-span-5">
            {/* VIN Lookup Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">VIN Lookup</h2>
                </div>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Direct Decode
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Decode a 17-character North American VIN directly against NHTSA&apos;s database to extract factory
                build specs, engine family, assembly plant, and matching in-stock parts.
              </p>

              <form onSubmit={handleDecodeVin} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="vinInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      17-Character VIN
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        vinInput.length === 17
                          ? "text-emerald-600 font-bold"
                          : vinInput.length > 0
                          ? "text-amber-600"
                          : "text-slate-400"
                      }`}
                    >
                      {vinInput.length}/17 chars
                    </span>
                  </div>
                  <input
                    id="vinInput"
                    type="text"
                    value={vinInput}
                    onChange={handleVinChange}
                    maxLength={17}
                    placeholder="e.g. 1FTEW1EP5JFB12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-sm tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:font-sans placeholder:tracking-normal"
                  />
                  {vinError && <p className="text-xs text-red-600 mt-1">{vinError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={vinInput.length !== 17 || decodingVin}
                  className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {decodingVin ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Decoding Through NHTSA...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Decode VIN</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Results, Vehicle Specs & Inventory */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Results Presentation Panel */}
            {decodedVinResult ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-indigo-200 inline-block mb-1 font-mono">
                        VIN: {decodedVinResult.vin}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {decodedVinResult.modelYear || "Year N/A"} {decodedVinResult.make || "Make N/A"} {decodedVinResult.model || "Model N/A"} {decodedVinResult.trim}
                      </h3>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 sm:text-right flex sm:flex-col gap-3 sm:gap-0">
                      <div>
                        Check Digit:{" "}
                        <span className={`font-semibold ${decodedVinResult.checkDigitValid ? "text-emerald-600" : "text-amber-600"}`}>
                          {decodedVinResult.checkDigitValid ? "Valid" : "Mismatch / Override"}
                        </span>
                      </div>
                      <div>
                        ErrorCode: <span className="font-mono text-slate-700">{decodedVinResult.errorCode || "0"}</span>
                      </div>
                    </div>
                  </div>

                  {/* NHTSA Error Code Note */}
                  {decodedVinResult.errorText && decodedVinResult.errorCode !== "0" && (
                    <div className="p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                      <div className="font-bold">NHTSA Decoding Advisory:</div>
                      <p>{decodedVinResult.errorText}</p>
                    </div>
                  )}

                  {/* Specifications Grid */}
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">
                      Factory Build Specifications (NHTSA Records)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Body Class</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.bodyClass || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Vehicle Type</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.vehicleType || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Drive Type</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.driveType || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Engine Displacement</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.displacementL ? `${decodedVinResult.displacementL}L` : "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Cylinders</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.engineCylinders || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Primary Fuel</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.fuelTypePrimary || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Plant Country</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.plantCountry || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Plant City</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.plantCity || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">Manufacturer</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                          {decodedVinResult.manufacturer || decodedVinResult.make || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Matching In-Stock Inventory Section */}
                  {verificationResult && verificationResult.matchingInventory.length > 0 && (
                    <div className="space-y-3 pt-3 sm:pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          In-Stock Recycled Parts for {verificationResult.modelYear} {verificationResult.make} {verificationResult.model}
                        </h4>
                        <span className="text-[10px] sm:text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified Inventory
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {verificationResult.matchingInventory.map((item) => (
                          <InventoryCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Find Used Parts CTA with Decoded VIN prefilled */}
                  <div className="p-3.5 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-blue-950">
                        Find Matching Used OEM Parts by VIN
                      </h5>
                      <p className="text-[11px] sm:text-xs text-blue-800/80 mt-0.5">
                        We can match exact Hollander interchange numbers using your decoded VIN ({decodedVinResult.vin}).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shrink-0 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Inquire With This VIN</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Initial State - hidden on mobile so no dead whitespace appears below input */
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 p-8 xl:p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">Enter a VIN to Begin</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Enter a 17-character VIN on the left to decode official NHTSA vPIC safety data and
                  cross-reference Bionic Auto Parts inventory.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Responsive VIN Inquiry Form Modal */}
      {decodedVinResult && (
        <VinInquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          decodedVehicle={decodedVinResult}
        />
      )}
    </div>
  );
}
