import { useMemo } from 'react';
import { AssetStreamStatus, StreamDataItem, StreamType } from '../types';
import { getCurrentTimestamp } from '../utils/time';

type StreamDataResolveParams = {
  isStatusShown: boolean;
  currentWellId: number;
  wirelineData: StreamDataItem;
  fracData: StreamDataItem;
};

const fallbackStreamData: StreamDataItem = {
  timestamp: 0,
};

const MINUTE_IN_SECONDS = 60;
const SIMULTANEOUS_TIME_TRESHOLD = 5;

function useWellStreamsData({
  isStatusShown,
  currentWellId,
  wirelineData,
  fracData,
}: StreamDataResolveParams): AssetStreamStatus {
  return useMemo(() => {
    if (!isStatusShown || !fracData || !wirelineData) return {};

    const fracTimestamp = (fracData || fallbackStreamData).timestamp;
    const wirelineTimestamp = (wirelineData || fallbackStreamData).timestamp;
    const currentTimeStamp = getCurrentTimestamp();

    if (currentTimeStamp - fracTimestamp > MINUTE_IN_SECONDS && currentTimeStamp - wirelineTimestamp > MINUTE_IN_SECONDS) {
      return {};
    }

    const isFracStream = currentTimeStamp - fracTimestamp <= MINUTE_IN_SECONDS;
    const isWLStream = currentTimeStamp - wirelineTimestamp <= MINUTE_IN_SECONDS;

    if (!isFracStream && !isWLStream) {
      return {};
    }

    let streamType = StreamType.Frac;
    if (isFracStream !== isWLStream) {
      streamType = isFracStream ? StreamType.Frac : StreamType.Wireline;
    } else {
      streamType = fracTimestamp < wirelineTimestamp ? StreamType.Frac : StreamType.Wireline;
    }

    if (Math.abs(fracTimestamp - wirelineTimestamp) <= SIMULTANEOUS_TIME_TRESHOLD) {
      streamType = StreamType.Frac;
    }

    return {
      wellId: currentWellId,
      streamType,
    };

  }, [wirelineData, fracData, isStatusShown]);
}

export default useWellStreamsData;
