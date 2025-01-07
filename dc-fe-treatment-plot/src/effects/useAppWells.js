import { useMemo } from 'react';
import { isEmpty } from 'lodash';

export function useAppWells(well, wells) {
  const wellsData = useMemo(() => {
    if (well) {
      return [well];
    }
    if (isEmpty(wells)) {
      return [];
    }
    return wells;
  }, [well, wells]);

  return wellsData;
}
