import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import icons for social media

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold">Grade Auto Parts</h3>
            <p className="text-sm">
              Providing quality auto parts since 2020. Your reliable partner for all automotive needs.
            </p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h4 className="text-md font-semibold">Quick Links</h4>
              <ul>
                <li>
                  <a href="/" className="text-sm hover:underline">Home</a>
                </li>
                <li>
                  <a href="/about" className="text-sm hover:underline">About Us</a>
                </li>
                <li>
                  <a href="/services" className="text-sm hover:underline">Services</a>
                </li>
                <li>
                  <a href="/contact" className="text-sm hover:underline">Contact</a>
                </li>
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h4 className="text-md font-semibold">Contact Us</h4>
              <p className="text-sm">Email: support@gradeautoparts.com</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <a href="https://facebook.com" className="mx-2 text-white hover:text-gray-300">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" className="mx-2 text-white hover:text-gray-300">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" className="mx-2 text-white hover:text-gray-300">
            <FaInstagram size={24} />
          </a>
          <a href="https://linkedin.com" className="mx-2 text-white hover:text-gray-300">
            <FaLinkedin size={24} />
          </a>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm">&copy; 2024 Grade Auto Parts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
