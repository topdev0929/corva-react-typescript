import { FC } from 'react';
import { makeStyles, useTheme } from '@material-ui/core';

import { Theme } from '@/shared/types';

import { Option } from '../types';

type Props = {
  option?: Option<unknown> | Option<unknown>[];
};

const useStyles = makeStyles({
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
});

export const RenderedValue: FC<Props> = ({ option }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const textColor = theme.palette.primary.text1;

  if (Array.isArray(option)) {
    const clearValue = option.filter(item => item.value !== 'All');
    return <span style={{ color: textColor }}>{clearValue.length} Selected</span>;
  }

  return option ? (
    <span style={{ color: textColor }} className={classes.item}>
      {option.icon && <img src={option.icon} alt="" width={18} />}
      {`${option.label}`}
    </span>
  ) : null;
};
