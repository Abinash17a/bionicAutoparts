"use client"; // Add this if you are using client-side components
import React, { useState } from "react";
import Link from "next/link";
import { blogs } from "../data/blogsData"; // Import the data

const Blogs = () => {
    // State to store the search input
    const [searchTerm, setSearchTerm] = useState("");

    // Helper function to truncate text to a given word count
    const truncateText = (text: any, wordLimit: any) => {
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    // Filtered blogs based on the search term
    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-8 px-4">
            {/* Main Blog Section */}
            <div className="w-full md:w-2/3">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="flex flex-col md:flex-row mb-6 bg-white shadow rounded-lg overflow-hidden"
                        >
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full md:w-1/3 object-cover h-48 md:h-32"
                            />
                            <div className="ml-4 p-4">
                                <h3 className="text-xl font-semibold">{blog.title}</h3>
                                <p className="text-gray-600 text-sm">{blog.date}</p>
                                <p className="text-gray-700 mt-2">
                                    {truncateText(blog.description, 50)} {/* Truncate description */}
                                </p>
                                <Link
                                    href={`/blogs/${blog.id}`}
                                    className="text-blue-500 hover:underline mt-2 inline-block"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700 text-center">No blogs found.</p>
                )}
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-1/3 md:pl-6 mt-8 md:mt-0">
                {/* Search Section */}
                <div className="bg-gray-100 p-4 rounded mb-6">
                    <h4 className="text-lg font-semibold mb-2">Search</h4>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Welcome Section */}
                <div className="bg-gray-100 p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Hi there!</h4>
                    <p className="text-gray-700">
                        Welcome to our car blogs section, where you’ll find useful tips,
                        reviews, and updates about the automobile world. Thanks for
                        reading!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blogs;
