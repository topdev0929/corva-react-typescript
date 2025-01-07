import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

import { STAGE_MODE_KEYS } from '../constants';

// app is live if last update is from a minute ago
const isStageLive = (witsTimestamp, liveStageNumber, lastStageNumber, stageMode, manualStages) => {
  if (lastStageNumber && liveStageNumber !== lastStageNumber) return false;
  if (stageMode === STAGE_MODE_KEYS.manual && !manualStages.includes(liveStageNumber)) return false;

  const now = moment();
  const timestamp = moment.unix(witsTimestamp);
  return now.diff(timestamp, 'minutes') <= 1;
};

export function useLiveTimer(witsSubData, mainData, { stageMode, manualStages }) {
  const timerRef = useRef(null);
  const witsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const lastChartStageNumber = Math.max(...mainData?.map(stage => stage.stage_number));

  useEffect(() => {
    const prevWitsData = witsRef.current;
    witsRef.current = witsSubData;
    if (!prevWitsData) {
      return;
    }
    if (prevWitsData.asset_id !== witsSubData?.asset_id) {
      setIsLive(false);
      return;
    }
    if (
      prevWitsData.asset_id === witsSubData?.asset_id &&
      prevWitsData.timestamp !== witsSubData?.timestamp
    ) {
      setIsLive(
        isStageLive(
          prevWitsData.data.timestamp,
          prevWitsData.stage_number,
          lastChartStageNumber,
          stageMode,
          manualStages
        )
      );
    }

    // Note: If live data doesn't come within 15 seconds, remove the live tag.
    timerRef.current = setTimeout(() => {
      setIsLive(false);
    }, 15 * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [witsSubData, stageMode, manualStages, lastChartStageNumber]);

  return isLive;
}
