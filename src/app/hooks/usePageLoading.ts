"use client";
import { useLoading } from '../context/LoadingContext';
import { useCallback } from 'react';

export const usePageLoading = () => {
  const { isLoading, setIsLoading, isContentLoaded } = useLoading();

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    isContentLoaded,
    startLoading,
    stopLoading,
    withLoading,
  };
};

