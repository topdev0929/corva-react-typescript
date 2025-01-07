import get from 'lodash/get';

const getPlaybackValue = (playback, convertedRecord) => {
  const startTimestamp = get(convertedRecord, ['data', 'activity_groups', 'start_timestamp']);
  const endTimestamp = get(convertedRecord, ['data', 'activity_groups', 'end_timestamp']);

  const [startValue, endValue] = playback;
  const isIncludedPlayback =
    startValue &&
    endValue &&
    startValue !== endValue &&
    startValue >= startTimestamp &&
    startValue <= endTimestamp &&
    endValue >= startTimestamp &&
    endValue <= endTimestamp;

  const playbackValue = isIncludedPlayback ? playback : [startTimestamp, endTimestamp];
  const isValidPlayback =
    playbackValue[0] && playbackValue[1] && playbackValue[0] !== playbackValue[1];

  return {
    playbackValue,
    isValidPlayback,
  };
};

export { getPlaybackValue };
