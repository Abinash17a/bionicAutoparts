"use client";
import React from 'react';

interface LoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default LoadingWrapper;


