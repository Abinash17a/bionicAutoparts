"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Truck, CheckCircle2, Send } from "lucide-react";
import { toast } from "react-toastify";

interface VehicleQuoteBoxProps {
  vehicleDetails?: {
    year?: string | number;
    make?: string;
    model?: string;
    category?: string;
    partName?: string;
  };
}

export default function VehicleQuoteBox({ vehicleDetails }: VehicleQuoteBoxProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [vin, setVin] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedVehicle = [
      vehicleDetails?.year,
      vehicleDetails?.make,
      vehicleDetails?.model,
      vehicleDetails?.partName || vehicleDetails?.category,
    ]
      .filter(Boolean)
      .join(" ");

    const searchedPartFormatted = `${formattedVehicle} ${vin ? `| VIN: ${vin}` : ""} ${
      notes ? `| Notes: ${notes}` : ""
    }`.trim();

    try {
      const response = await fetch("/api/saveSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          email,
          zipCode,
          searchedPartFormatted,
        }),
      });

      if (response.ok) {
        toast.success("Quote request received! Our parts team is checking live interchange.");
        router.push("/confirmation");
      } else {
        toast.error("Error submitting request. Please call us at (617) 516-3140.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting request. Please call us at (617) 516-3140.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-blue-800">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
          Fitment Guarantee • Direct Salvage Network
        </span>
        <h3 className="text-2xl font-bold text-white mb-2">
          {vehicleDetails?.year && vehicleDetails?.make
            ? `Request Exact Quote: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model || ""}`
            : "Request Vehicle Part & Fitment Quote"}
        </h3>
        <p className="text-blue-200 text-sm leading-relaxed">
          Need a specific VIN match, engine code verification, or freight quote to your zip code? Submit your details below for instant priority processing.
        </p>
      </div>

      <form method="POST" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Phone Number (For Fast Quote) *</label>
            <input
              type="tel"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Shipping Zip Code *</label>
            <input
              type="text"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 90210"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">VIN (Optional for 100% Fitment Match)</label>
            <input
              type="text"
              maxLength={17}
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="17-Digit Vehicle Identification No."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Engine Size / Trim / Specific Part</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 2.5L 4-Cyl Gas, Automatic, 4WD"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-base transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          {submitting ? (
            "Submitting Quote Request..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Request Fitment & Pricing Quote
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-200">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400 shrink-0" />
          <span>6-Month Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Nationwide Freight</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Hollander Verified</span>
        </div>
      </div>
    </div>
  );
}
