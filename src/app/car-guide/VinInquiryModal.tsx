// src/app/car-guide/VinInquiryModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Car,
  FileText,
} from "lucide-react";
import { DecodedVehicle } from "@/lib/nhtsa/types";

interface VinInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  decodedVehicle: DecodedVehicle;
}

export default function VinInquiryModal({
  isOpen,
  onClose,
  decodedVehicle,
}: VinInquiryModalProps) {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [requestedPart, setRequestedPart] = useState("");
  const [message, setMessage] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    orderId: string;
    message: string;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  // Build vehicle engine summary string
  const engineSummary = [
    decodedVehicle.displacementL ? `${decodedVehicle.displacementL}L` : null,
    decodedVehicle.engineCylinders ? `${decodedVehicle.engineCylinders}-Cyl` : null,
    decodedVehicle.fuelTypePrimary || null,
  ]
    .filter(Boolean)
    .join(" ");

  const bodyAndDrive = [
    decodedVehicle.bodyClass || null,
    decodedVehicle.driveType || null,
  ]
    .filter(Boolean)
    .join(" • ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone.trim() || digitsOnly.length < 7) {
      setErrorMessage("Please enter a valid phone number (at least 7 digits).");
      return;
    }

    // ZIP Code validation (US 5-digit or ZIP+4)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (zipCode.trim() && !zipRegex.test(zipCode.trim())) {
      setErrorMessage("Please enter a valid 5-digit ZIP code (or ZIP+4 format).");
      return;
    }

    if (!requestedPart.trim() || requestedPart.trim().length < 2) {
      setErrorMessage("Please describe the part you need.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/car-guide/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          zipCode: zipCode.trim(),
          requestedPart: requestedPart.trim(),
          message: message.trim(),
          vin: decodedVehicle.vin,
          vehicleYear: decodedVehicle.modelYear,
          vehicleMake: decodedVehicle.make,
          vehicleModel: decodedVehicle.model,
          vehicleTrim: decodedVehicle.trim || "",
          vehicleEngine: engineSummary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setSuccessResult({
        orderId: data.orderId || "SUBMITTED",
        message: data.message || "Your parts inquiry was submitted successfully!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected network error occurred.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (submitting) return;
    if (successResult) {
      // Reset after success
      setName("");
      setEmail("");
      setPhone("");
      setRequestedPart("");
      setMessage("");
      setSuccessResult(null);
      setErrorMessage(null);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#023047] to-[#034466] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="inquiry-modal-title" className="text-lg font-bold">
                Check Part Through Decoded VIN
              </h3>
              <p className="text-xs text-blue-200">
                Direct inquiry to Bionic Auto Parts inventory specialists
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            disabled={submitting}
            aria-label="Close dialog"
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successResult ? (
            /* Success View */
            <div className="py-6 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-slate-900">
                  Inquiry Received Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  Order ID:{" "}
                  <span className="font-mono font-bold text-indigo-600 text-sm">
                    {successResult.orderId}
                  </span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-800">
                    {decodedVehicle.modelYear} {decodedVehicle.make} {decodedVehicle.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VIN:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {decodedVehicle.vin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Part Requested:</span>
                  <span className="font-bold text-blue-700">{requestedPart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="text-slate-800">{email} • {phone}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Our parts specialists are cross-referencing live Hollander interchange records for your vehicle. We will contact you directly with pricing, warranty details, and availability.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Pre-populated Decoded Vehicle Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>Auto-Linked Vehicle</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified NHTSA VIN
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Vehicle:</span>
                    <strong className="text-slate-900 text-sm">
                      {decodedVehicle.modelYear || "Year N/A"} {decodedVehicle.make} {decodedVehicle.model} {decodedVehicle.trim}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">VIN (17-Chars):</span>
                    <span className="font-mono font-bold text-indigo-700 text-xs tracking-wider">
                      {decodedVehicle.vin}
                    </span>
                  </div>
                  {engineSummary && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Engine Specs:</span>
                      <span className="text-slate-700 font-medium">{engineSummary}</span>
                    </div>
                  )}
                  {bodyAndDrive && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Body & Drive:</span>
                      <span className="text-slate-700 font-medium">{bodyAndDrive}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Submission Error:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="inquiry-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="inquiry-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="inquiry-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (617) 555-0199"
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label htmlFor="inquiry-zip" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    ZIP Code <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="inquiry-zip"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter ZIP code (e.g. 90210 or 90210-1234)"
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                  />
                </div>

                {/* Part Requested */}
                <div className="sm:col-span-2">
                  <label htmlFor="inquiry-part" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Part Requested <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-part"
                    type="text"
                    required
                    value={requestedPart}
                    onChange={(e) => setRequestedPart(e.target.value)}
                    placeholder="e.g. Engine Assembly, 8-Speed Transmission, Front Bumper, Headlight..."
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                  />
                </div>

                {/* Additional Details */}
                <div className="sm:col-span-2">
                  <label htmlFor="inquiry-message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Details / Specifications <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Engine code, transmission type, preferred condition, shipping zip code, or any notes..."
                    disabled={submitting}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Parts Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
