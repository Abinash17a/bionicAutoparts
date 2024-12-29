'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Award, Recycle, Users } from 'lucide-react';

export default function AboutUs() {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">About Our Company</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering quality auto parts with unparalleled service since 1985
          </p>
        </section>

        {/* Main Content */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              For over three decades, we've been at the forefront of the auto parts industry,
              providing top-quality used and new parts for all makes and models of vehicles.
              Our journey began with a simple mission: to offer reliable parts at competitive
              prices while ensuring customer satisfaction through dedicated service.
            </p>
            <p className="text-gray-700 mb-4">
              Today, we're proud to be a leader in the industry, known for our vast inventory,
              cutting-edge technology, and commitment to sustainability. Our computerized search
              network connects us to over 200 affiliated recycling centers, allowing us to find
              the exact part you need in seconds.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/aboutusmain.jpg"
              alt="About Us"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Recycle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainability</h3>
            <p className="text-gray-600">
              We're committed to recycling and reusing auto parts to reduce waste and protect the environment.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Every part we sell undergoes rigorous quality checks to ensure reliability and performance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Support</h3>
            <p className="text-gray-600">
              Our knowledgeable staff is always ready to assist you in finding the perfect part for your vehicle.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="bg-blue-900 text-white p-12 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-xl text-center max-w-3xl mx-auto">
            To provide the best quality auto parts at competitive prices while ensuring
            customer satisfaction through our dedicated service and commitment to sustainability.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Ready to Find Your Part?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our wide selection of high-quality auto parts at unbeatable prices.
            Head back to our homepage to find the perfect part for your vehicle and enjoy
            a seamless shopping experience.
          </p>
          <button
            onClick={goToHomePage}
            className="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Go to Home
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </section>
      </div>
    </div>
  );
}

