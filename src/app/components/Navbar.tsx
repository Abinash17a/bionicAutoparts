"use client"; // This indicates that the component is a client component.
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          {/* Placeholder for logo */}
          <img
            src="/logo.png" // Replace with your logo's URL
            alt="Bionic Auto Parts Logo"
            className="h-10 w-10 mr-3" // Adjust the height/width as needed
          />
          <div className="text-white text-3xl font-bold">
            <Link href="/">Bionic Auto Parts</Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Links Section */}
        <div className={`hidden md:flex md:items-center md:space-x-4`}>
          <Link href="/" className="text-white hover:bg-gray-700 transition duration-300 ease-in-out px-4 py-2 rounded-lg font-semibold">
            Home
          </Link>
          <Link href="/about-us" className="text-white hover:bg-gray-700 transition duration-300 ease-in-out px-4 py-2 rounded-lg font-semibold">
            About Us
          </Link>
          <Link href="/contact" className="text-white hover:bg-gray-700 transition duration-300 ease-in-out px-4 py-2 rounded-lg font-semibold">
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-2 px-6 py-4">
          <Link href="/" className="text-white hover:bg-gray-600 transition duration-300 ease-in-out px-4 py-2 rounded-lg">
            Home
          </Link>
          <Link href="/about-us" className="text-white hover:bg-gray-600 transition duration-300 ease-in-out px-4 py-2 rounded-lg">
            About Us
          </Link>
          <Link href="/blogs" className="text-white hover:bg-gray-600 transition duration-300 ease-in-out px-4 py-2 rounded-lg">
            Blogs
          </Link>
          <Link href="/contact" className="text-white hover:bg-gray-600 transition duration-300 ease-in-out px-4 py-2 rounded-lg">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
