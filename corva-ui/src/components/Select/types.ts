import { ReactNode } from 'react';
import {
  FormControlProps,
  InputLabelProps,
  SelectProps as MuiSelectProps,
} from '@material-ui/core';

export type SelectProps<T> = {
  FormControlProps?: FormControlProps;
  InputLabelProps?: InputLabelProps;
  label?: string | ReactNode;
  formHelperText?: string | ReactNode;
  error?: boolean;
  value?: T;
  onChange?: (e: React.ChangeEvent<{ name?: string; value: T }>, child: ReactNode) => void;
} & Omit<MuiSelectProps, 'value' | 'onChange'>;
