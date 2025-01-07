const MODERATE_DELAY_THRESHOLD = 60; // 1 minute
const SEVERE_DELAY_THRESHOLD = 900; // 15 minutes

const LATENCY_THRESHOLDS = {
  high: 10,
  medium: 5,
};

const STATUS_CONFIGS = {
  online: {
    isLive: true,
    label: 'ONLINE',
    color: '#75DB29',
  },
  offline: {
    isLive: false,
    label: 'OFFLINE',
    color: '#F44336',
  },
  delayed: {
    isLive: false,
    label: 'DELAYED',
    color: '#FFC107',
  },
};

type StatusInfo = {
  color: string;
  isLive: boolean;
  label: string;
};

export const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

export const getStatusInfo = (delay: number): StatusInfo => {
  if (delay > SEVERE_DELAY_THRESHOLD) {
    return STATUS_CONFIGS.offline;
  }
  if (delay > MODERATE_DELAY_THRESHOLD) {
    return STATUS_CONFIGS.delayed;
  }
  return STATUS_CONFIGS.online;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day} ${hour}:${minute}:${seconds}`;
};

export const getTooltipTitle = (timestamp: number, delay: number): string => {
  const minutes = Math.floor(delay / 60);
  const info = `Last data received at ${formatTimestamp(timestamp * 1000)}`;
  if (delay <= MODERATE_DELAY_THRESHOLD || delay > SEVERE_DELAY_THRESHOLD) {
    return info;
  }

  return `${info} (${minutes} minute${minutes === 1 ? '' : 's'} delayed)`;
};

export const getLatencyColor = (delay: number) => {
  if (delay > LATENCY_THRESHOLDS.high) {
    return '#F44336';
  }
  if (delay > LATENCY_THRESHOLDS.medium) {
    return '#FFC107';
  }
  return '#75DB29';
};
