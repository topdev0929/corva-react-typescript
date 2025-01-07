import { useMemo, useRef } from 'react';

const CSV_CHECK_DELAY = 60000;

// NOTE: Subscribe to all collections used in the app
export function useWitsFilter({ witsSubData, convertedWitsSubData }) {
  const prevWitsData = useRef();
  const updateTime = useRef();

  const witsData = useMemo(() => {
    const update = () => {
      prevWitsData.current = {
        filteredWitsSubData: witsSubData,
        filteredConvertedWitsSubData: convertedWitsSubData,
      };
      updateTime.current = +new Date();

      return prevWitsData.current;
    };

    if (!prevWitsData.current) {
      return update();
    }

    const prevData = prevWitsData.current.filteredWitsSubData?.data;
    const witsData = witsSubData?.data;

    const isPrevWitCsv = prevData?.is_csv === true;
    const isCsv = witsData?.is_csv === true;
    const isCsvWitTimedOut =
      updateTime.current && +new Date() - updateTime.current > CSV_CHECK_DELAY;

    if (!isCsvWitTimedOut && isCsv && !isPrevWitCsv) {
      return prevWitsData.current;
    }

    return update();
  }, [witsSubData, convertedWitsSubData]);

  return witsData;
}
