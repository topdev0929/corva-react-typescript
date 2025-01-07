import { useEffect, useState } from 'react';

import { Well, WellsStagesData } from '../types';
import { loadWellsStageData } from '../api/stageData';

const useHistoricalAppData = (
  currentWells: Well[],
  recalculate: boolean,
  setRecalculate: (state: boolean) => void
): {
  data: WellsStagesData;
  isLoading: boolean;
} => {
  const [data, setData] = useState<WellsStagesData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const wellIds = currentWells.map(well => well.asset_id).join();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const stageData = await loadWellsStageData(currentWells);

      setData(stageData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentWells.length) {
      loadData();
    }
  }, [wellIds]);

  useEffect(() => {
    if (recalculate) {
      setRecalculate(false);
      loadData();
    }
  }, [recalculate]);

  return { data, isLoading };
};

export default useHistoricalAppData;
