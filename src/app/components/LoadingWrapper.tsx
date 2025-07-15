"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

interface LoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  fallback,
  className = ""
}) => {
  const { isContentLoaded } = useLoading();

  return (
    <AnimatePresence>
      {isContentLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={className}
        >
          {children}
        </motion.div>
      ) : (
        fallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={className}
          >
            {fallback}
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

export default LoadingWrapper;

