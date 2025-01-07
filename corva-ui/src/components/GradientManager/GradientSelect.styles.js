import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(({ palette }) => ({
  select: {
    '& > .MuiSelect-root': {
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
      paddingRight: 0,
    },
    '& > .MuiSelect-root > button': {
      display: 'none',
    },
    width: '100%',
    marginBottom: 20,
  },
  customGradientListItem: {
    width: '300px',
    '& span': {
      flexGrow: 1,
      padding: '0 8px',
    },
    '& button': {
      visibility: 'hidden',
    },
    '&:hover button': {
      visibility: 'visible',
    },
    '&:hover button.disabled': {
      opacity: 0.3,
    },
  },
  listHeader: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    color: palette.common.white,
  },
  subHeader: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '10px',
    color: palette.primary.text7,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    pointerEvents: 'all',
    '&:hover': {
      background: 'transparent',
    },
  },
  removeButton: {
    color: palette.primary.text7,
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
    '& .MuiIconButton-label': {
      padding: 0,
    },
  },
}));
