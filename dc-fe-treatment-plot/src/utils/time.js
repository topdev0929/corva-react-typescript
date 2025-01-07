const isValueInRange = ({ firstTimestamp, lastTimestamp }, unixValue) =>
  unixValue >= firstTimestamp && unixValue <= lastTimestamp;

export { isValueInRange };
