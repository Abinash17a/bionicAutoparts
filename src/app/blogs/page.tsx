"use client"; // Add this if you are using client-side components
import React, { useState } from "react";
import Link from "next/link";
import { blogs } from "../data/blogsData"; // Import the data
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const Blogs = () => {
    // State to store the search input
    const [searchTerm, setSearchTerm] = useState("");
    const [showNoResults, setShowNoResults] = useState(false);

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

    // Show no results animation
    React.useEffect(() => {
        setShowNoResults(searchTerm.length > 0 && filteredBlogs.length === 0);
    }, [searchTerm, filteredBlogs.length]);

    return (
        <div className="mx-auto mt-8 px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Blog Cards Section */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog, idx) => (
                            <Card
                                key={blog.id}
                                className="group flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-blue-500/60 bg-white animate-fade-in"
                                style={{ animationDelay: `${idx * 60}ms` }}
                            >
                                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardContent className="flex flex-col flex-1 p-6 gap-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
                                        {blog.title}
                                    </CardTitle>
                                    <div className="text-xs text-gray-500 mb-1">{blog.date}</div>
                                    <div className="text-gray-700 text-base flex-1 line-clamp-4">
                                        {truncateText(blog.description, 24)}
                                    </div>
                                    <Button asChild variant="outline" className="mt-4 w-fit px-5 py-2 text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-800 transition">
                                        <Link href={`/blogs/${blog.id}`}>
                                            Read More <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : showNoResults ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 animate-fade-in">
                            <Search className="w-16 h-16 text-blue-300 mb-4" />
                            <div className="text-2xl font-semibold text-gray-700 mb-2">No blogs found</div>
                            <div className="text-gray-500">Try a different search term or browse all blogs.</div>
                        </div>
                    ) : null}
                </div>

                {/* Sidebar */}
                <div className="space-y-8 lg:sticky lg:top-24 h-fit animate-fade-in">
                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl font-semibold">Search Blogs</CardTitle>
                        </CardHeader>
                        <Input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-2"
                        />
                    </Card>
                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl font-semibold">Hi there!</CardTitle>
                        </CardHeader>
                        <div className="text-gray-700 text-base">
                            Welcome to our car blogs section! Here you will find useful tips, reviews, and updates from the automobile world. Happy reading!
                        </div>
                    </Card>
                </div>
            </div>
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
            `}</style>
        </div>
    );
};

export default Blogs;

