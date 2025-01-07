import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  customGradientName: {
    minWidth: 175,
    marginBottom: 20,
  },
  iconButton: {
    '&:hover': {
      background: 'transparent',
    },
  },
});
