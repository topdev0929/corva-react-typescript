import { get, flatMap, some, lowerFirst } from 'lodash';

const includes = (range, timestamp) => {
  return range[0] < timestamp && timestamp < range[1];
};

export function checkPhaseOverlapped(phases, timeRange) {
  const timestamp = timeRange[0];
  const isDotOverlapped = some(phases, yard => {
    return some(yard, item => item.start_time < timestamp && item.end_time > timestamp);
  });

  const isRangeOverlapped = some(phases, yard => {
    return some(
      yard,
      item => includes(timeRange, item.start_time) || includes(timeRange, item.end_time)
    );
  });

  return isDotOverlapped || isRangeOverlapped;
}

export function checkCurrentPhaseOverlapped(phases, timestamp) {
  const overlapped = phases
    .slice(0, -1)
    .some(item => item.start_time < timestamp && item.end_time > timestamp);

  return overlapped;
}

export function getPhaseByPoint(phases, timestamp) {
  const phaseArray = flatMap(phases, value => value);
  const found = phaseArray.find(
    item => item.start_time < timestamp && (!item.end_time || timestamp <= item.end_time)
  );
  return found ?? null;
}

export function getEndTime(phases, timestamp) {
  const candidate = Object.keys(phases).reduce((acc, key) => {
    const filtered = phases[key].filter(phase => phase.start_time > timestamp);
    return acc.concat(filtered.map(_ => _.start_time));
  }, []);

  return candidate.length > 0 ? Math.min(...candidate) : null;
}

export function parseCriticalPoint(obj) {
  return {
    id: get(obj, '_id'),
    color: obj.data.color,
    title: obj.data.title,
    user: obj.data.user,
    // eslint-disable-next-line no-nested-ternary
    trace: obj.data.trace
      ? obj.data.trace.includes(' | ')
        ? lowerFirst(obj.data.trace.split(' | ')[0])
        : obj.data.trace
      : '',
    timestamp: obj.data.timestamp,
  };
}
