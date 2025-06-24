"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogs } from "../../data/blogsData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Share2 } from 'lucide-react';
import Link from "next/link";

export default function BlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const blog = blogs.find((b) => Number(b.id) === Number(params.id));
  const blogIndex = blogs.findIndex((b) => Number(b.id) === Number(params.id));
  const prevBlog = blogIndex > 0 ? blogs[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogs.length - 1 ? blogs[blogIndex + 1] : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Blog Not Found</h1>
        <Button onClick={() => router.back()} variant="outline" className="px-4 py-2">
          <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      {/* Floating Back Button on Mobile */}
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="fixed z-30 top-4 left-4 md:hidden flex items-center px-3 py-2 shadow-lg bg-white/90 backdrop-blur border border-blue-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
      </Button>

      {/* Back Button for Desktop */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 hidden md:flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blogs
      </Button>

      <Card className="overflow-hidden shadow-xl animate-fade-in">
        <div className="relative h-56 sm:h-80 w-full overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-0 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1 w-4 h-4" /> {blog.date}
              </span>
              <Button variant="ghost" size="icon" onClick={handleShare} title="Share this blog">
                <Share2 className="w-5 h-5 text-blue-600" />
              </Button>
            </div>
          </div>
          <main className="prose prose-lg max-w-none mb-8 text-gray-800">
            {blog.description.split("\n").map((line: string, index: number) => {
              const boldTextRegex = /\*\*(.*?)\*\*/g;
              if (boldTextRegex.test(line)) {
                const updatedLine = line.replace(boldTextRegex, (match, p1) => (
                  `<span class=\"font-bold text-xl text-blue-700\">${p1}</span>`
                ));
                return (
                  <p
                    key={index}
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: updatedLine }}
                  />
                );
              }
              return <p key={index} className="mb-4">{line.trim()}</p>;
            })}
          </main>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6 mt-8">
            {prevBlog ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/blogs/${prevBlog.id}`}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                </Link>
              </Button>
            ) : <div />}
            {nextBlog ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/blogs/${nextBlog.id}`}>
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : <div />}
          </div>
        </CardContent>
      </Card>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: none;
          }
        }
        .prose :where(h1, h2, h3, h4) {
          color: #1e293b;
        }
        .prose :where(a) {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose :where(strong) {
          color: #be123c;
        }
      `}</style>
    </div>
  );
}

