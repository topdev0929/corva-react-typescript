import { useMemo } from 'react';
import { sortBy } from 'lodash';
import moment from 'moment';

import { StageScore, TimeRangeSetting, WellsStagesData } from '../types';
import { TIME_RANGE_OPTIONS_KEYS } from '../constants';

const getTimeRange = (
  timeRangeSetting: TimeRangeSetting,
  lastStageEnd: number
): [number, number] => {
  if (timeRangeSetting.mode === TIME_RANGE_OPTIONS_KEYS.customTimeRange) {
    return [timeRangeSetting.customTimeStart, timeRangeSetting.customTimeEnd];
  }
  let hoursToSubtract;
  if (timeRangeSetting.mode === TIME_RANGE_OPTIONS_KEYS.last12h) {
    hoursToSubtract = 12;
  }
  if (timeRangeSetting.mode === TIME_RANGE_OPTIONS_KEYS.last24h) {
    hoursToSubtract = 24;
  }

  return [moment.unix(lastStageEnd).subtract(hoursToSubtract, 'hours').unix(), lastStageEnd];
};

const useScoresInTimeRange = (
  timeRangeSetting: TimeRangeSetting,
  data: WellsStagesData
): StageScore[] => {
  const filteredScores = useMemo(() => {
    if (data) {
      const latestStageEnd = Math.max(
        ...Object.values(data).map(item => item.scores[0]?.data.stage_end_time)
      );
      const stageTimesFlat = Object.values(data)
        .map(item => item.scores || [])
        .flat();
      const stageTimesSorted = sortBy(stageTimesFlat, stage => -stage.data.stage_end_time);
      let targetStages = [];
      if (timeRangeSetting.mode === TIME_RANGE_OPTIONS_KEYS.last5) {
        targetStages = stageTimesSorted.slice(0, 5);
      } else if (timeRangeSetting.mode === TIME_RANGE_OPTIONS_KEYS.allStages) {
        targetStages = stageTimesSorted;
      } else {
        const [firstTimestamp, lastTimestamp] = getTimeRange(timeRangeSetting, latestStageEnd);
        targetStages = stageTimesSorted.filter(
          stage =>
            stage.data.stage_start_time >= firstTimestamp &&
            stage.data.stage_end_time <= lastTimestamp
        );
      }
      return targetStages;
    }
    return [];
  }, [timeRangeSetting, data]);

  return filteredScores;
};

export default useScoresInTimeRange;
