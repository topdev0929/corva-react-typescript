import { Status } from '@/types/global.type';

export const StatusBGColor = {
  [Status.Critical]: '#F44336',
  [Status.Medium]: '#FFC107',
  [Status.Info]: '#2196F3',
  [Status.Done]: '#03BCD4',
};

export const StatusBorderColor = {
  [Status.Critical]: '#F44336',
  [Status.Medium]: '#FFC107',
  [Status.Info]: '#64B5F6',
  [Status.Done]: '#616161',
};

export const StatusHoverColor = {
  [Status.Critical]: 'rgba(211, 47, 47, 0.2)',
  [Status.Medium]: 'rgba(255, 193, 7, 0.2)',
  [Status.Info]: 'rgba(100, 181, 246, 0.2)',
  [Status.Done]: 'rgba(3, 188, 212, 1)',
};
