"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.3,
  easing: 'ease',
  speed: 400,
  trickleSpeed: 200,
});

interface PageTransitionLoaderProps {
  isLoading: boolean;
}

const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({ isLoading }) => {
  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm pointer-events-none"
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 border-r-blue-500 rounded-full animate-spin shadow-lg"></div>
            </div>
            <p className="text-gray-700 font-semibold text-sm">
              Loading...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitionLoader;


