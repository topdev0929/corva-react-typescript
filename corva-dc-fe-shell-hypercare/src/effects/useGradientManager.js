import { useState } from 'react';
import { DEFAULT_GRADIENTS } from '~/constants';

export const useGradientManager = () => {
  const [gradientId, setGradientId] = useState('standard');
  const [gradients, setGradients] = useState(DEFAULT_GRADIENTS);
  const [isBusy, setIsBusy] = useState(false);

  const updateGradients = async gradients => {
    setGradients(gradients);
    setIsBusy(true);
    try {
      await new Promise(resolve => setTimeout(() => resolve('saved'), 2000));
    } finally {
      setIsBusy(false);
    }
  };

  return {
    gradientId,
    gradients,
    updateGradientId: setGradientId,
    updateGradients,
    isBusy,
  };
};
