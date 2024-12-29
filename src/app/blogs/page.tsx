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
        <div className="mx-auto mt-8 px-6 lg:px-8" style={{ maxWidth: '130rem' }}>
            {/* Main Content Section with Blog Cards and Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Blog Card Section */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                            >
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="p-6 space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{blog.title}</h3>
                                    <p className="text-sm text-gray-500">{blog.date}</p>
                                    <p className="text-gray-700 text-lg">
                                        {truncateText(blog.description, 20)}
                                    </p>
                                    <Link
                                        href={`/blogs/${blog.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-center text-xl">No blogs found.</p>
                    )}
                </div>

                {/* Sidebar with Search and Welcome Section */}
                <div className="space-y-6 mt-8 lg:mt-0">
                    {/* Search Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-4">Search Blogs</h4>
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 transition duration-300"
                        />
                    </div>

                    {/* Welcome Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-4">Hi there!</h4>
                        <p className="text-gray-700 text-lg">
                            Welcome to our car blogs section! Here you will find useful tips,
                            reviews, and updates from the automobile world. Happy reading!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogs;
