import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ClickToRevealEmail } from "./ProtectedEmail";

export default function Footer() {
  return (
    <footer className="bg-[#428eff] text-white">
      {/* Trust/Payment/Delivery Image Section */}
      <div className="bg-gray-100 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src="/new-trust-payment-delivery.png"
            alt="Trusted Shopping, Payment Options, Delivery Partners"
            width={1200}
            height={100}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">

          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4 md:mb-6">
              <Image
                src="/logo1.png"
                alt="Bionics Auto Parts Logo"
                width={50}
                height={50}
                className="rounded-full mr-3 md:mr-4"
              />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Bionics Auto Parts</h2>
                <p className="text-gray-300 text-xs md:text-sm">Quality Parts Since 2015</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Your trusted partner for premium automotive parts and accessories.
              We provide reliable, high-quality components to keep your vehicle
              running at peak performance.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition-colors">
                <FaFacebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition-colors">
                <FaLinkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/parts" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                  Browse Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Phone and Address */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Contact Info</h3>
            <div className="space-y-2 md:space-y-3">
              <div>
                <p className="text-gray-300 text-xs md:text-sm mb-1">Phone</p>
                <p className="text-white text-sm md:text-base">+1 617-390-7248</p>
              </div>

              <div>
                <p className="text-gray-300 text-xs md:text-sm mb-1">Address</p>
                <p className="text-white text-xs md:text-sm">
                  6332 Deep Canyon Dr<br />
                  Beverly Hills, CA 90210
                </p>
              </div>
            </div>
          </div>

          {/* Email - Last Column */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Email</h3>
            <div>
              <ClickToRevealEmail
                email="parts@bionicsautoparts.com"
                label="Click to reveal email"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 md:pt-8 mt-6 md:mt-8">
          <div className="text-center">
            <p className="text-gray-300 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} Bionics Auto Parts. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

