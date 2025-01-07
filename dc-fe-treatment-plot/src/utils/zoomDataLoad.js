import { METADATA } from '../meta';
import { VIEW_MODE_KEYS } from '../constants';

const ZOOM_DATA_LOAD_BREAKPOINT_SERIES = {
  wits: 7200, // 2 hours
  wits10s: 43200, // 12 hours
};
const ZOOM_DATA_LOAD_BREAKPOINT_OVERLAY = {
  wits: 50000,
  wits10s: 200000,
};

// for series mode we have simple time limits for collection options
// for overlay mode we should use time limit divided by stages count
const getTimeRangeLimit = (collectionsKey, stagesCount, viewMode) =>
  viewMode === VIEW_MODE_KEYS.series
    ? ZOOM_DATA_LOAD_BREAKPOINT_SERIES[collectionsKey]
    : Math.min(
        ZOOM_DATA_LOAD_BREAKPOINT_OVERLAY[collectionsKey] / stagesCount / 60,
        ZOOM_DATA_LOAD_BREAKPOINT_SERIES[collectionsKey] / 60
      );

export const resolveZoomCollection = ({ newZoom, viewMode, stagesCount }) => {
  const newZoomSpan = newZoom.endValue - newZoom.startValue;

  if (newZoomSpan <= getTimeRangeLimit('wits', stagesCount, viewMode)) {
    return METADATA.collections.wits;
  }
  if (newZoomSpan <= getTimeRangeLimit('wits10s', stagesCount, viewMode)) {
    return METADATA.collections.wits10s;
  }
  return METADATA.collections.wits1m;
};
