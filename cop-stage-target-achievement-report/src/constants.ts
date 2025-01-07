export const TIME_RANGE_OPTIONS_KEYS = {
  last12h: 'last12h',
  last24h: 'last24h',
  last5: 'last5',
  allStages: 'allStages',
  customTimeRange: 'customTimeRange',
};

export const TIME_RANGE_OPTIONS = [
  { label: 'Last 12h', key: TIME_RANGE_OPTIONS_KEYS.last12h },
  { label: 'Last 24h', key: TIME_RANGE_OPTIONS_KEYS.last24h },
  { label: 'Last 5 stages', key: TIME_RANGE_OPTIONS_KEYS.last5 },
  { label: 'All stages', key: TIME_RANGE_OPTIONS_KEYS.allStages },
  { label: 'Custom time range', key: TIME_RANGE_OPTIONS_KEYS.customTimeRange },
];

export const SCORE_TYPES = {
  high: {
    label: 'On target',
    color: '#75db29',
    className: 'highScore',
  },
  medium: {
    label: 'Pressure limited',
    color: '#ffc107',
    className: 'mediumScore',
  },
  low: {
    label: 'Requires attention',
    color: '#d32f2f',
    className: 'lowScore',
  },
};

export const DEFAULT_SETTINGS = {
  designValues: {
    designRate: 78,
    designPressure: 8500,
  },
  metricsFunction: 'avg' as 'avg' | 'sum',
  timeRange: {
    mode: TIME_RANGE_OPTIONS_KEYS.last12h,
    customTimeStart: null,
    customTimeEnd: null,
  },
  padOrderSetting: {},
};
