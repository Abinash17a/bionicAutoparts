"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AboutUs() {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/'); // Redirect to the homepage
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/bgimagev8fsi.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Section with the content */}
      <section className="container mx-auto px-6 py-8 bg-white rounded-lg text-[#333333]">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-4 text-[#4A90E2]">
          About Us
        </h1>
        <p className="mt-2 text-center text-lg text-[#555555]">
          We are the best car parts provider in the industry!
        </p>

        <div className="flex flex-col md:flex-row mt-8">
          {/* Left Side: About the Company */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-[#4A90E2]">
              About Our Company
            </h2>
            <p className="mt-4 text-lg text-[#333333]">
              Our Huge Inventory and Computerized Search Network. We encourage you to contact us at
              any time that you are looking for used auto parts. Our inventory is organized and
              coded, so we can look up parts for you in seconds on our computers. We also have
              access to the Computerized Search Network that is connected to over affiliated
              recycling centers.
            </p>
            <p className="mt-4 text-lg text-[#333333]">
              With years of experience in the auto parts industry, we pride ourselves on offering
              top-quality used and new parts for all makes and models of vehicles. Our knowledgeable
              staff is always ready to assist you in finding exactly what you need. Whether you're a
              mechanic, car enthusiast, or everyday driver, we are committed to delivering
              excellence in every interaction.
            </p>
            <p className="mt-4 text-lg text-[#333333]">
              At our company, sustainability and customer satisfaction go hand in hand. We believe
              in recycling and reusing auto parts to reduce waste and protect the environment, while
              ensuring our customers get the best value for their money. We aim to build long-term
              relationships with our customers by consistently exceeding their expectations.
            </p>
          </div>

          {/* Right Side: Large Image */}
          <div className="w-full md:w-1/2 md:pl-8">
            <img
              src="/aboutusmain.jpg"
              alt="About Us"
              className="w-full h-auto rounded-lg shadow-lg border-2 border-[#4A90E2]"
            />
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-[#4A90E2]">Our Mission</h2>
          <p className="mt-4 text-lg text-[#333333]">
            Our mission is to provide the best quality auto parts at competitive prices while
            ensuring customer satisfaction through our dedicated service.
          </p>
        </div>

        {/* Fancy Bottom Section */}
        <div
          className="mt-12 text-center p-6 rounded-lg shadow-lg bg-[#f0f0f0] text-[#333333]"
        >
          <h2 className="text-2xl font-bold text-[#4A90E2]">Let’s Go Back Home and Buy Parts!</h2>
          <p className="mt-4 text-[#555555]">
            Explore our wide selection of high-quality auto parts at unbeatable prices. Head back to
            our homepage to find the perfect part for your vehicle and enjoy a seamless shopping
            experience.
          </p>
          <button
            onClick={goToHomePage}
            className="mt-4 px-4 py-2 rounded-lg font-semibold transition duration-300 bg-[#4A90E2] text-[#FFFFFF] hover:bg-[#357ABD] hover:text-[#FFFFFF]"
          >
            Go to Home
          </button>
        </div>
      </section>
    </div>
  );
}
