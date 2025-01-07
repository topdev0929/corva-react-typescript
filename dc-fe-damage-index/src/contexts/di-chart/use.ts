import { useContext } from 'react';

import { DIChartContext } from './context';

export const useDIChartStore = () => {
  return useContext(DIChartContext);
};
