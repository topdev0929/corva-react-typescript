import { useState } from 'react';

import { useDelayLoading } from './useDelayLoading';

export const useDelayedLoading = (timeout?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const isDelayedLoading = useDelayLoading(isLoading, timeout);

  const startLoading = () => {
    setIsLoading(true);
  };

  const cancelLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading: isDelayedLoading,
    startLoading,
    cancelLoading,
  };
};
