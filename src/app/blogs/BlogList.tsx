"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlogSummary } from "../data/blogsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export interface BlogListProps {
  blogs?: BlogSummary[];
}

export default function BlogList({ blogs = [] }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNoResults = searchTerm.length > 0 && filteredBlogs.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Blog Cards Section */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="group flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-blue-500/60 bg-white"
            >
              <Link href={`/blogs/${blog.slug}`} className="relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-100 block">
                <img
                  src={blog.heroImage?.src || blog.image}
                  alt={blog.heroImage?.alt || blog.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                {blog.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wide uppercase">
                    {blog.category}
                  </span>
                )}
              </Link>
              <CardContent className="flex flex-col flex-1 p-6 gap-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                  <span>{blog.date}</span>
                  {blog.readTime && <span>{blog.readTime}</span>}
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">
                  <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 transition-colors">
                    {blog.title}
                  </Link>
                </CardTitle>
                <div className="text-slate-600 text-sm flex-1 line-clamp-3">
                  {blog.metaDescription || truncateText(blog.description.replace(/\*\*/g, ""), 24)}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-fit px-5 py-2 text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-800 transition"
                >
                  <Link href={`/blogs/${blog.slug}`}>
                    Read Guide <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : showNoResults ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Search className="w-16 h-16 text-blue-300 mb-4" />
            <div className="text-2xl font-semibold text-slate-700 mb-2">No guides found</div>
            <div className="text-slate-500">Try a different search term or explore all auto parts categories.</div>
          </div>
        ) : null}
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-24 h-fit">
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold">Search Articles</CardTitle>
          </CardHeader>
          <Input
            type="text"
            placeholder="Search guides, engines, fitment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </Card>

        <Card className="p-6 bg-blue-50 border border-blue-200">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-lg font-semibold text-blue-900">Commercial Part Inquiries</CardTitle>
          </CardHeader>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Need an engine or transmission fitment match? Our automotive technicians are ready to verify Hollander interchange and VIN numbers.
          </p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/contact">Request Parts Assistance</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
