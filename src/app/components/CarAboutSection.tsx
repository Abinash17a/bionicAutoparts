"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  FaShippingFast,
  FaCar,
  FaTools,
  FaHandHoldingUsd,
  FaTruck,
  FaPhoneAlt,
  FaUndoAlt,
  FaClock,
  FaFilePdf,
  FaCalendarAlt,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa"
import { ClickToRevealEmail } from "./ProtectedEmail"

// Image data
const carPartsImages = [
  {
    src: "/mainpage1.jpg",
    title: "Engine Components",
    description: "High-performance parts for optimal engine function",
  },
  {
    src: "/mainpage2.jpg",
    title: "Exterior Accessories",
    description: "Stylish additions to enhance your vehicle's appearance",
  },
  {
    src: "/mainpage3.jpg",
    title: "Brake Systems",
    description: "Safety-critical components for reliable stopping power",
  },
  {
    src: "/mainpage4.jpg",
    title: "Interior Upgrades",
    description: "Comfort and convenience enhancements for your cabin",
  },
]

// Static content
const staticContent = [
  {
    icon: FaCar,
    title: "Premium Car Parts",
    content: [
      {
        icon: FaTools,
        text: "Discover a comprehensive range of car parts for every make and model. From engine components to stylish accessories, we've got you covered.",
      },
      {
        icon: FaHandHoldingUsd,
        text: "Affordable prices, high-quality parts, and fast shipping options make maintaining and upgrading your vehicle easier than ever.",
      },
      {
        icon: FaSearch,
        text: "Our extensive catalog includes OEM and aftermarket options to suit your specific needs and budget requirements.",
      },
    ],
  },
  {
    icon: FaShippingFast,
    title: "USA Nationwide Shipping",
    content: [
      {
        icon: FaTruck,
        text: "We deliver across all 50 states in the USA. Fast and reliable shipping to every corner of the country.",
      },
      {
        icon: FaCalendarAlt,
        text: "Estimated delivery dates are provided based on availability and selected shipping options.",
      },
    ],
  },
  {
    icon: FaUndoAlt,
    title: "Returns & Warranty",
    content: [
      {
        icon: FaPhoneAlt,
        text: "Contact us at +1 412 926 8644, email ",
        emailComponent: (
          <ClickToRevealEmail
            email="Bionicsautoparts@usa.com"
            label="Click to reveal email"
            className="inline text-blue-600 hover:text-blue-800 transition-colors"
          />
        ),
        textAfter: ", or chat live for assistance with returns.",
      },
      {
        icon: FaClock,
        text: "Refunds are processed within 1-2 business days. However, credit card processing may take an additional 3-5 days.",
      },
    ],
  },
]

export const CarAboutSection = () => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-full mx-auto px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Premium Auto Parts
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Quality components for your vehicle with a commitment to excellence.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left column - Static content */}
          <div className="xl:col-span-5 space-y-6">
            {staticContent.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md border border-gray-100 p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-3 rounded-lg mr-4 text-white">
                    <section.icon size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="text-blue-600 mt-1 mr-3">
                        <item.icon size={18} />
                      </div>
                      <p className="text-gray-700 text-base">
                        {item.text}
                        {item.emailComponent && item.emailComponent}
                        {item.textAfter && item.textAfter}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div>
              <a
                href="/files/warranty.pdf"
                className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFilePdf className="mr-2 text-lg" />
                Terms and Conditions
              </a>
            </div>
          </div>

          {/* Right column - Images and Stats */}
          <div className="xl:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {carPartsImages.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-md border border-gray-100 h-64"
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src={image.src || "/logo1.png"}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gray-900/70 flex flex-col justify-end p-6 transition-opacity duration-300 ${
                      hoveredImage === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h3 className="text-white text-lg font-semibold">{image.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{image.description}</p>
                    <Link href="/parts" passHref legacyBehavior>
                      <a className="mt-3 inline-flex items-center text-blue-400 text-sm hover:text-blue-300 focus:outline-none">
                        View Details <FaChevronRight className="ml-1" size={12} />
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Parts Available", value: "10,000+" },
                { label: "Brands", value: "30+" },
                { label: "Delivery States", value: "50" },
                { label: "Satisfied Customers", value: "6000+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-100"
                >
                  <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

