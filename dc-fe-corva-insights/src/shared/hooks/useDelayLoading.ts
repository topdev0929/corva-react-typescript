import { useEffect, useRef, useState } from 'react';

const DEFAULT_TIMEOUT = 200;

export const useDelayLoading = (isLoading: boolean, timeout?: number) => {
  const [isDelayedLoading, setDelayedLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadingTimer = () => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
  };

  const scheduleLoading = () => {
    loadingTimerRef.current = setTimeout(() => {
      setDelayedLoading(true);
    }, timeout || DEFAULT_TIMEOUT);
  };

  const cancelLoading = () => {
    clearLoadingTimer();
    setDelayedLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      scheduleLoading();
    }
    return () => {
      cancelLoading();
    };
  }, [isLoading]);

  return isDelayedLoading;
};
