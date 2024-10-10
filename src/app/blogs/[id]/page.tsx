"use client"
import { useParams } from 'next/navigation';

// Sample blog data for demonstration
const blogData = [
  {
    id: 1,
    title: "How to Maintain Your Car for Optimal Performance",
    content: "Content for maintaining your car...",
  },
  {
    id: 2,
    title: "Top 5 Car Maintenance Tips",
    content: "Content for car maintenance tips...",
  },
  {
    id: 3,
    title: "Understanding Your Car's Warning Lights",
    content: "Content about warning lights...",
  },
  {
    id: 4,
    title: "The Importance of Regular Oil Changes",
    content: "Content about oil changes...",
  },
  {
    id: 5,
    title: "Choosing the Right Tires for Your Vehicle",
    content: "Content about tires...",
  },
];

export default function BlogPost() {
  const params = useParams();
  let { id } = params;

  // Handle both string and string[] types
  if (Array.isArray(id)) {
    id = id[0]; // Take the first element if id is an array
  }

  // Ensure id is a string before parsing
  const blogId = id ? parseInt(id, 10) : null; // Parse to int or null if undefined

  // Find the blog post by ID
  const blog = blogId !== null ? blogData.find((post) => post.id === blogId) : null;

  if (!blog) {
    return <p>Blog not found!</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p>{blog.content}</p>
    </div>
  );
}
