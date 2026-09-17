import React from "react";
import { Metadata } from "next";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Used Auto Parts Guides | OEM, Fitment and Buying Advice",
  description:
    "Explore expert auto parts guides on recycled OEM engines, transmissions, VIN fitment verification, and buying advice from USA Used Auto Parts.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Used Auto Parts Guides | OEM, Fitment and Buying Advice",
    description:
      "Explore expert auto parts guides on recycled OEM engines, transmissions, VIN fitment verification, and buying advice from USA Used Auto Parts.",
    url: "/blogs",
  },
};

export default function BlogsPage() {
  return (
    <div className="mx-auto mt-8 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mb-16">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
          Automotive Guides & Salvage Insights
        </h1>
        <p className="text-slate-600 text-lg">
          Expert articles on recycled OEM parts, vehicle maintenance, transmission diagnostics, and engine replacement.
        </p>
      </div>
      <BlogList />
    </div>
  );
}
