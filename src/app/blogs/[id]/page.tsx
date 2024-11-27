import React from "react";
import { blogs } from "../../data/blogsData"; // Import blogs data

// Generate static parameters (optional, for pre-rendering)
export async function generateStaticParams() {
  return blogs.map((blog: any) => ({
    id: String(blog.id), // Ensure the id is a string
  }));
}

// Page component for each blog
export default function BlogPage({ params }: { params: { id: string } }) {
  // Convert params.id to a number if blog.id is a number
  console.log("params id", params, params.id);
  console.log("blogs", blogs);

  const blog = blogs.find((b: any) => Number(b.id) === Number(params.id)); // Since params.id is now a string, no need for Number()

  if (!blog) {
    return <h1 className="text-center text-2xl mt-8">404 - Blog Not Found</h1>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Blog Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center my-6">{blog.title}</h1>

        {/* Blog Date */}
        <p className="text-sm text-gray-500 text-center mb-8">{blog.date}</p>

        {/* Blog Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full object-cover h-80 md:h-96 rounded-t-lg"
        />

        {/* Blog Content */}
        <div className="px-6 py-4">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {blog.description}
          </p>

          {/* Optional: Add "Read More" or other sections */}
          <p className="text-gray-600 text-sm">
            Continue reading for more details about the blog content, tips, or guides.
          </p>
        </div>
      </article>
    </div>
  );
}

