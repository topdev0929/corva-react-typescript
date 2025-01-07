import { ReactNode, ReactElement } from 'react';
import { TooltipProps } from '@material-ui/core';

export type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface Notification {
  alertLevel?: 'info' | 'warning' | 'critical';
  autoHideDuration?: number;
  content: ReactNode;
  hideIcon?: boolean;
  icon?: ReactElement;
  id: string;
  onClick?: () => void;
  onClose?: () => void;
  timestamp?: string;
  title?: string;
  tooltipProps?: TooltipProps;
  variant?: Variant;
}
