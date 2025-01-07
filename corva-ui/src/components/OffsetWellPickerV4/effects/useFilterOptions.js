import { useState, useEffect } from 'react';
import { FilterOptions } from '../constants';

export function useFilterOptions(wells) {
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    if (wells) {
      const result = FilterOptions.map(({ value, label }) => {
        const options = wells.reduce((acc, well) => {
          if (well[value] !== 'Null' && !acc.includes(well[value])) return [...acc, well[value]];
          return acc;
        }, []);
        return { value, label, options: [...options.sort(), 'Null'] };
      });
      setFilterOptions(result);
    }
  }, [wells]);

  return filterOptions;
}
