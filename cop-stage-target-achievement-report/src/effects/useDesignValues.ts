/* eslint-disable camelcase */
import { useState, useEffect } from 'react';

import { DesignValues } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { loadScorecardSettings } from '../api/scorecardSetting';

const useDesignValues = (
  assetId: number,
  fracFleetId: number
): {
  designValues: DesignValues;
  companyId: number;
  basinValue: string;
  isDesignValuesLoading: boolean;
  setDesignValues: (state: DesignValues) => void;
} => {
  const [companyId, setCompanyId] = useState<number>(null);
  const [basinValue, setBasinValue] = useState<string>(null);
  const [designValues, setDesignValues] = useState<DesignValues>(DEFAULT_SETTINGS.designValues);
  const [isDesignValuesLoading, setIsDesignValuesLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDesignValuesLoading(true);
        const { rawScorecardSettings, basin, company_id } = await loadScorecardSettings(assetId);
        console.log('*basin* ->', basin);
        if (basin) {
          setBasinValue(basin);
        }
        if (company_id) {
          setCompanyId(company_id);
        }
        if (rawScorecardSettings.length) {
          const newMaxRate = rawScorecardSettings.find(
            item => item.data.frac_fleet_id === fracFleetId
          )?.data.max_rate;

          if (newMaxRate) {
            setDesignValues((prev: any) => ({ ...prev, designRate: newMaxRate }));
          }

          if (basin) {
            const newMaxPressure = rawScorecardSettings.find(item => item.data.basin === basin)
              ?.data.max_pressure;

            if (newMaxPressure) {
              setDesignValues((prev: any) => ({ ...prev, designPressure: newMaxPressure }));
            }
          }
        }
      } finally {
        setIsDesignValuesLoading(false);
      }
    };

    if (assetId) {
      loadData();
    }
  }, [assetId]);

  return { designValues, setDesignValues, companyId, basinValue, isDesignValuesLoading };
};

export default useDesignValues;
