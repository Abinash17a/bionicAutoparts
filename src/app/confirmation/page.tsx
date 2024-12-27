"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Confirmation: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      console.log('Sending conversion event to Google Ads');
      console.log('type of gtag:', typeof window.gtag);
      window.gtag('event', 'conversion', {
        send_to: 'AW-16746690398',
      });
      console.log('Google Ads SENT');
    } else {
      console.error('Google Ads tag is not initialized.');
    }
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center">
      <img
        src="/confirmation.png"
        alt="Confirm Logo"
        className="mb-6 h-16"
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
