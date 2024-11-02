"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Confirmation: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-16746690398',
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center">
      {/* Logo Section */}
      <img 
        src="/confirmation.png" // Replace with the actual path to your logo
        alt="Confirm Logo"
        className="mb-6 h-16" // Adjust the height as necessary
      />
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Thank You for Your Submission!
      </h1>
      
      <p className="text-lg text-gray-600 mb-6 max-w-md leading-relaxed">
        We’ve received your information and will be in touch shortly. If you have any additional questions, feel free to reach out to us.
      </p>
      
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Confirmation;
