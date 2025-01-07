import { useEffect, useState, useRef } from 'react';
import { isEmpty, get } from 'lodash';

import { fetchWells, fetchBicWellSections, fetchWellhubWells } from '../utils/apiCalls';

export function useWells(companyId) {
  const initialLoadingRef = useRef(true);
  const [wells, setWells] = useState(null);

  useEffect(() => {
    async function handleFetchWells() {
      const data = await fetchWells(companyId);
      setWells(data);
    }

    if (initialLoadingRef.current) {
      setWells(null);
      handleFetchWells();
      initialLoadingRef.current = false;
    }
  }, [companyId]);

  return wells;
}

export const useFetchBicWellsData = assetId => {
  const [bicData, setBicData] = useState([]);

  useEffect(() => {
    const handleOffsetWellBicData = async () => {
      try {
        const data = assetId ? await fetchBicWellSections(assetId) : [];
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

    handleOffsetWellBicData();
  }, [assetId]);

  return bicData;
};

export const useFetchWellhubWells = assetId => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleOffsetWells = async () => {
      try {
        const record = await fetchWellhubWells(assetId);
        const savedOffsetWells = get(record[0], 'data.offset_wells') || [];
        setData(savedOffsetWells);
      } catch (e) {
        setData([]);
      }
    };

    handleOffsetWells();
  }, [assetId]);

  return data;
};
