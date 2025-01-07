import { useContext } from 'react';

import { InsightFormContext } from './context';

export const useInsightFormStore = () => {
  return useContext(InsightFormContext);
};
