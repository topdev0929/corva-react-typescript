import { createContext } from 'react';

export default createContext({
  charts: new Map(),
  onChartChange: () => {}
});
