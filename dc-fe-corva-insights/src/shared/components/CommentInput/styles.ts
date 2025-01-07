import { makeStyles } from '@material-ui/core';

export const useCommentInputStyles = makeStyles({
  input: {
    padding: '6px 8px',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    '& input': {
      padding: 0,
      fontSize: 14,
      fontWeight: 300,
    },
    '&::after': {
      display: 'none',
    },
    '&::before': {
      display: 'none',
    },
  },
});
