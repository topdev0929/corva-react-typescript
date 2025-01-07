import { createContext } from 'react';

export default createContext({
  mapping: [],
  parsedData: [],
  indexes: {
    min: 0,
    max: 0,
    keys: {}
  }
});
