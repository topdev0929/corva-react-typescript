import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles<any, any>(theme => ({
  root: {
    width: '100%',
    paddingBottom: '10px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  indicatorContainer: {
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  indicator: {
    fontSize: '12px',
    lineHeight: '14px',
  },
  mainBar: {
    position: 'relative',
    height: '16px',
    width: '100%',
  },
  addIcon: {
    fontSize: '16px',
  },
  removeButton: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    padding: 0,
    width: '36px',
    height: '36px',
    '&:hover': {
      background: theme.palette.background.b7,
    },
  },
  deleteIcon: {
    fontSize: '20px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  posTextfield: {
    position: 'absolute',
    bottom: '14px',
    right: '8px',
    width: '64px',
    '& input::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  posOutlinedRoot: {
    height: '24px',
    background: theme.palette.background.b6,
  },
  posOutlinedInput: {
    color: theme.palette.primary.text6,
    padding: '2px 4px',
    textAlign: 'right',
    fontSize: '14px',
    '&:focus': {
      color: theme.palette.primary.text1,
    },
  },
  addCircle: {
    position: 'absolute',
    top: '-4px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    border: '1px solid #ffffff',
  },
  circle: ({ readonly }) => ({
    position: 'absolute',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: readonly ? 'none' : '1px solid #ffffff',
    '&:hover': {
      border: readonly ? 'none' : '3px solid #ffffff',
    },
    '&.highlight': {
      border: '3px solid #ffffff',
    }
  })
}));
