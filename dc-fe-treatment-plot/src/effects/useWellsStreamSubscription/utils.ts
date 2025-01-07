const MODERATE_DELAY_THRESHOLD = 60; // 1 minute
const SEVERE_DELAY_THRESHOLD = 900; // 15 minutes

const STATUS_CONFIGS = {
  online: {
    label: 'Online',
    color: '#4CAF50',
  },
  offline: {
    label: 'Offline',
    color: '#E00101',
  },
  delayed: {
    label: 'Delayed',
    color: '#FFF350',
    textColor: 'dark',
  },
};

type StatusInfo = {
  color: string;
  label: string;
  textColor?: string;
};

export const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

export const getStatusInfo = (activityTimestamp: number): StatusInfo => {
  const currentTimestamp = getCurrentTimestamp();

  if (currentTimestamp - activityTimestamp > SEVERE_DELAY_THRESHOLD) {
    return STATUS_CONFIGS.offline;
  }
  if (currentTimestamp - activityTimestamp > MODERATE_DELAY_THRESHOLD) {
    return STATUS_CONFIGS.delayed;
  }
  return STATUS_CONFIGS.online;
};
