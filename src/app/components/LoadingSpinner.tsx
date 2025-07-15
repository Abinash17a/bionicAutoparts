"use client";
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo or Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <img
            src="/logo1.png"
            alt="Bionics Autoparts"
            className="h-16 w-auto"
          />
        </motion.div>

        {/* Spinning Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative"
        >
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 font-medium">Loading...</p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm text-gray-400 mt-1"
          >
            Please wait while we prepare your page
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

