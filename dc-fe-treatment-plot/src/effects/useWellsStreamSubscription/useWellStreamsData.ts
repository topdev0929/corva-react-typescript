import { useMemo } from 'react';
import { AssetStreamStatus, STREAM_TYPES, StreamData, StreamDataItem } from '@/types/Stream';

import { getCurrentTimestamp } from './utils';

const HOUR_IN_SECONDS = 3600;
const PERF_MAX_DEPTH = 2000;
const SIMULTANEOUS_TIME_THRESHOLD = 60;

type StreamDataResolveParams = {
  wellIds: number[];
  currentWellId: number;
  fracData: StreamData;
  wirelineData: StreamData;
  wirelineActivityData: StreamData;
  isLive: boolean;
  latestWits: {
    timestamp: number;
  };
};

const fallbackStreamData: StreamDataItem = {
  timestamp: 0,
  stageNumber: 0,
  data: {
    measured_depth: 0,
  },
};

function useWellStreamsData({
  wellIds,
  currentWellId,
  fracData,
  wirelineData,
  wirelineActivityData,
  isLive,
  latestWits = { timestamp: 0 },
}: StreamDataResolveParams): AssetStreamStatus[] {
  return useMemo(() => {
    let fracNumber = 0;
    let wirelineNumber = 0;

    return wellIds.reduce((result, wellId) => {
      const currentTimestamp = getCurrentTimestamp();
      const wellFrac = fracData[wellId] || fallbackStreamData;
      const wellWireline = wirelineData[wellId] || fallbackStreamData;
      const wellWirelineActivity = wirelineActivityData[wellId] || fallbackStreamData;

      const wellFracTimestamp =
        (wellId === currentWellId && isLive ? latestWits.timestamp : wellFrac.timestamp) || 0;
      const wellWirelineTimestamp = wellWireline.timestamp || 0;

      const isFracStream =
        wellFracTimestamp >= wellWirelineTimestamp ||
        wellWirelineTimestamp - wellFracTimestamp <= SIMULTANEOUS_TIME_THRESHOLD;
      const activityTimestamp = isFracStream ? wellFracTimestamp : wellWirelineTimestamp;

      if (activityTimestamp < currentTimestamp - HOUR_IN_SECONDS) {
        return result;
      }

      // if wireline state and pull out is done, don't show WL stream
      if (!isFracStream) {
        const wirelineMeasuredDepth = wellWireline.data.measured_depth || 0;
        const isDonePullOut =
          wellWireline?.stageNumber === wellWirelineActivity?.stageNumber
            ? wellWirelineActivity.data?.['pull out of hole'] || 0 > 0
            : false;

        if (wirelineMeasuredDepth < PERF_MAX_DEPTH && isDonePullOut) {
          return result;
        }
      }

      return [
        ...result,
        {
          wellId,
          activityTimestamp,
          streamType: isFracStream ? STREAM_TYPES.frac : STREAM_TYPES.wireline,
          index: isFracStream ? ++fracNumber : ++wirelineNumber,
        },
      ];
    }, []);
  }, [fracData, wirelineData, wirelineActivityData, latestWits]);
}

export default useWellStreamsData;
