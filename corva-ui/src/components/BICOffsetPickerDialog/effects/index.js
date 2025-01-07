import { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'lodash';

import { fetchWells, fetchBicWellSections } from '../utils/apiCalls';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useWells(companyId, open) {
  const initialLoadingRef = useRef(true);
  const [wells, setWells] = useState(null);

  useEffect(() => {
    async function handleFetchWells() {
      const data = await fetchWells(companyId);
      setWells(data);
    }

    if (open && initialLoadingRef.current) {
      setWells(null);
      handleFetchWells();
      initialLoadingRef.current = false;
    }
  }, [companyId, open]);

  return wells;
}

export const useFetchBicWellsData = (assetId, isOpen) => {
  const [bicData, setBicData] = useState([]);

  useEffect(() => {
    const handleOffsetWellBicData = async () => {
      let data;
      try {
        [data] = assetId ? await Promise.all([fetchBicWellSections(assetId)]) : [];
        const filters = (!isEmpty(data) && JSON.parse(data[0].data.filters)) || undefined;
        const result =
          (!isEmpty(data) && data[0].data.result && JSON.parse(data[0].data.result)) || undefined;
        setBicData({
          filters,
          result,
        });
      } catch (e) {
        setBicData(null);
      }
    };

    if (isOpen) {
      handleOffsetWellBicData();
    }
  }, [assetId, isOpen]);

  return bicData;
};
