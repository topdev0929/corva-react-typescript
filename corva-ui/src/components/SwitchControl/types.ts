import { ChangeEvent, ReactNode } from 'react';
import { SwitchClassKey } from '@material-ui/core';

export type SwitchControlTypes = {
  title?: string | ReactNode;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  leftLabel?: string | ReactNode;
  rightLabel?: string | ReactNode;
  disabled?: boolean;
  size?: 'small' | 'medium';
  className?: string;
  customClasses?: Partial<Record<SwitchClassKey, string>>;
  rightLabelTooltip?: string | ReactNode;
  leftLabelTooltip?: string | ReactNode;
  'data-testid'?: string;
};
