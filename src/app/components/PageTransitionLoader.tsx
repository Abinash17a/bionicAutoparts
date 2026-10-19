"use client";
import React, { useEffect } from 'react';
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

  return null;
};

export default PageTransitionLoader;


