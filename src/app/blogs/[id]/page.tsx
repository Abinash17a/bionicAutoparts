"use client"; // Mark this file as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { blogs } from "../../data/blogsData"; // Import blogs data

// Page component for each blog
export default function BlogPage({ params }: { params: { id: string } }) {
  const router = useRouter(); // Initialize useRouter

  // Find the blog by ID
  const blog = blogs.find((b: any) => Number(b.id) === Number(params.id));

  if (!blog) {
    return <h1 className="text-center text-2xl mt-6">404 - Blog Not Found</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-6 lg:px-4">
      {/* Blog Title */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          {blog.title}
        </h1>
        <p className="text-sm text-gray-500 text-center mt-2">{blog.date}</p>
      </header>

      {/* Blog Image */}
      <div className="w-full mb-6">
  <img
    src={blog.image}
    alt={blog.title}
    className="w-full h-80 object-contain" // Use object-contain for proper scaling
  />
</div>

      {/* Blog Content */}
      <main className="text-lg text-gray-700 leading-relaxed mb-6 space-y-4">
        {blog.description.split("\n").map((line: string, index: number) => {
          // Regex to match any text wrapped with **
          const boldTextRegex = /\*\*(.*?)\*\*/g;

          // If there is bold text in the line, replace and make it bold
          if (boldTextRegex.test(line)) {
            const updatedLine = line.replace(boldTextRegex, (match, p1) => (
              `<span class="font-bold text-xl">${p1}</span>`
            ));
            return (
              <p
                key={index}
                className="text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: updatedLine }}
              />
            );
          }
          return <p key={index}>{line.trim()}</p>;
        })}
      </main>

      {/* Footer Section */}
      <footer className="border-t border-gray-300 pt-4 mt-6 text-center text-sm text-gray-600">
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-blue-500 font-medium hover:bg-blue-100 rounded"
        >
          <p className="underline text-blue-600 font-semibold hover:text-blue-800">
            Continue exploring more blogs
          </p>
        </button>
      </footer>
    </div>
  );
}

