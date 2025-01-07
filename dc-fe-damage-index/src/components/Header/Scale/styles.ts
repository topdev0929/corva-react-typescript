import { makeStyles } from '@material-ui/core';

import { Theme } from '@/shared/types';

export const useStyles = makeStyles<Theme>(theme => ({
  label: {
    color: theme.palette.primary.text6,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '8px',
  }
}));
