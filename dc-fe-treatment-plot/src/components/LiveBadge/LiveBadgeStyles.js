import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  liveBadge: {
    display: 'flex',
    alignItems: 'end',
    position: 'absolute',
    width: 40,
    height: 20,
    fontSize: 13,
    color: theme.palette.success.bright,
  },

  liveBadgeOuterCircle: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: theme.palette.success.bright,
    animation: '$dotpulse 2s infinite alternate',
  },

  liveBadgeInnerCircle: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: theme.palette.success.bright,
    animation: '$innerdotpulse 2s infinite alternate',
  },

  '@keyframes dotpulse': {
    from: {
      opacity: 0.2,
      transform: 'scale(0.5)',
    },
    to: {
      opacity: 0.4,
      transform: 'scale(1)',
    },
  },

  '@keyframes innerdotpulse': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));
