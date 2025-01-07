import { useState, useEffect } from 'react';
import { fetchWells } from '../utils/apiCalls';

export function useFetchWells(companyId, addWellsUsabilityInfo) {
  const [wells, setWells] = useState(null);

  useEffect(() => {
    async function handleFetchWells() {
      const data = companyId ? await fetchWells(companyId, addWellsUsabilityInfo) : null;
      setWells(data);
    }

    setWells(null);
    handleFetchWells();
  }, [companyId]);

  return wells;
}
