import { useContext } from 'react';

import { SelectedInsightsContext } from './context';

export const useSelectedInsightsStore = () => {
  return useContext(SelectedInsightsContext);
};
