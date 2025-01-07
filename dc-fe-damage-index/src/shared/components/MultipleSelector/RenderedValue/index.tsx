import { FC } from 'react';
import { useTheme } from '@material-ui/core';

import { Theme } from '@/shared/types';

type Props = {
  value: unknown;
};

export const RenderedValue: FC<Props> = ({ value }) => {
  const theme = useTheme<Theme>();
  const textColor = theme.palette.primary.text1;
  if (Array.isArray(value)) {
    const clearValue = value.filter(item => item !== 'All');
    return <span style={{ color: textColor }}>{clearValue.length} Selected</span>;
  }

  return value ? <span style={{ color: textColor }}>{`${value}`}</span> : null;
};
