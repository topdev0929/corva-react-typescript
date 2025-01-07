import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  icon: {
    padding: 0,
    '&:hover': {
      '& .MuiBadge-root .MuiBadge-badge svg path': {
        '&:first-of-type': { fill: theme.palette.primary.light },
      },
      '& .MuiAvatar-root': {
        outline: `1px solid ${theme.palette.primary.light}`,
      },
    },
    marginTop: 4,
  },
  badge: {
    top: 2,
    right: 6,
    '&:hover': {
      '& svg path': { '&:first-of-type': { fill: theme.palette.primary.light } },
    },
  },
}));
