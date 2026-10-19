"use client";
import React, { createContext, useContext, useState } from 'react';
import PageTransitionLoader from '../components/PageTransitionLoader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isContentLoaded: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
  isContentLoaded: true,
});

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isContentLoaded = true;

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, isContentLoaded }}>
      {children}
      <PageTransitionLoader isLoading={isLoading} />
    </LoadingContext.Provider>
  );
};


