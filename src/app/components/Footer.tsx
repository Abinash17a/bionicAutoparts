import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-blue-50 pt-10 pb-4">
      {/* Trust/Payment/Delivery Image Section */}
      <div className="flex justify-center py-8">
        <Image
          src="/trust-payment-delivery.png"
          alt="Trusted Shopping, Payment Options, Delivery Partners"
          width={1500}
          height={175}
          className="w-full max-w-7xl h-auto object-contain"

        />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-blue-600">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <Image src="/visa.png" alt="Visa" width={120} height={40} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">Bionics Auto Parts</h2>
            <p className="text-blue-100 text-center md:text-left">
              Providing quality auto parts since 2020.<br />
              Your reliable partner for all automotive needs.
            </p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2 text-blue-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="hover:text-yellow-400 transition">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-yellow-400 transition">Refund Policy</Link>
              </li>
            </ul>
          </div>
          {/* Contact & Social */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-bold mb-2 text-blue-200">Contact Us</h3>
            <p className="text-blue-100">Email: <a href="mailto:parts@bionicsautoparts.com" className="hover:text-yellow-400">parts@bionicsautoparts.com</a></p>
            <p className="text-blue-100">Phone: +1 617-390-7248</p>
            <p className="text-blue-100">6332 Deep Canyon Dr, Beverly Hills, CA 90210</p>
            <div className="flex gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="hover:text-yellow-400" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="hover:text-yellow-400" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-yellow-400" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="hover:text-yellow-400" /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-blue-200 text-sm pt-6  border-blue-600 mt-4">
          &copy; {new Date().getFullYear()} Bionics Auto Parts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

