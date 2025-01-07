import { useEffect, useState } from 'react';
import { uniqBy, sortBy } from 'lodash';

import { FILTERS } from '../constants';

const DYNAMIC_FILTERS = Object.values(FILTERS);

// NOTE: Bi-directional filtering.
function getFilterList(currentFilterKey, restFilterKeys, dynamicFilters, allWells) {
  const filteredWells = restFilterKeys.reduce((result, filterKey) => {
    return result.filter(
      well =>
        !dynamicFilters[filterKey] ||
        dynamicFilters[filterKey].length === 0 ||
        dynamicFilters[filterKey].includes(well[filterKey])
    );
  }, allWells);

  const filterList = sortBy(uniqBy(filteredWells.map(well => well[currentFilterKey])));

  return filterList.includes('Null')
    ? filterList.filter(item => item !== 'Null').concat('Null')
    : filterList;
}

export default function useBidirectionalFiltering(dynamicFilters, allWells) {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!allWells) {
      return;
    }

    setFilters(
      DYNAMIC_FILTERS.reduce(
        (result, filterKey) => ({
          ...result,
          [filterKey]: getFilterList(
            filterKey,
            DYNAMIC_FILTERS.filter(item => item !== filterKey),
            dynamicFilters,
            allWells
          ),
        }),
        {}
      )
    );
  }, [dynamicFilters, allWells]);

  return filters;
}
