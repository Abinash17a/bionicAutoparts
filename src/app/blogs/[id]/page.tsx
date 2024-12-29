"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogs } from "../../data/blogsData";
import { ArrowLeft, Calendar } from 'lucide-react';

export default function BlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const blog = blogs.find((b) => Number(b.id) === Number(params.id));

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Blog Not Found</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Blogs
      </button>

      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600">
          <div className="flex items-center mr-6 mb-2">
            <Calendar className="mr-2" size={16} />
            <span>{blog.date}</span>
          </div>
          {/* <div className="flex items-center mr-6 mb-2">
            <Clock className="mr-2" size={16} />
            <span>{blog.readTime} min read</span>
          </div>
          <div className="flex items-center mb-2">
            <User className="mr-2" size={16} />
            <span>By {blog.author || 'Anonymous'}</span>
          </div> */}
        </div>
      </header>

      {/* Blog Image */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={blog.image}
          alt={blog.title}
          width={800}
          height={400}
          layout="responsive"
          objectFit="cover"
          className="w-full"
        />
      </div>

      {/* Blog Content */}
      <main className="prose prose-lg max-w-none mb-12">
        {blog.description.split("\n").map((line: string, index: number) => {
          const boldTextRegex = /\*\*(.*?)\*\*/g;

          if (boldTextRegex.test(line)) {
            const updatedLine = line.replace(boldTextRegex, (match, p1) => (
              `<span class="font-bold text-xl">${p1}</span>`
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

      {/* Footer Section */}
      <footer className="border-t border-gray-300 pt-8 mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Exploring</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
        >
          More Blogs
        </button>
      </footer>
    </div>
  );
}

