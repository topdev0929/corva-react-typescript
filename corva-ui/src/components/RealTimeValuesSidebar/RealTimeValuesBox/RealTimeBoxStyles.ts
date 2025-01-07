import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: any) => ({
  dragIcon: {
    width: 16,
    height: 16,
  },
  divider: {
    margin: '0 12px',
    width: 206,
  },
  rtBox: {
    padding: '8px 0px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.isLightTheme ? theme.palette.primary.contrastText : theme.palette.background.b5,
    alignItems: 'center',
    '&.notDraggable': {
      marginLeft: 12,
      marginBottom: 12,
      padding: 0,
    },
    '&:hover': {
      backgroundColor: theme.palette.background.b6,
      '&>$rtBoxButtonContainer': {
        display: 'block',
      },
    },
  },
  rtBoxSelected: {
    borderBottom: `0px solid ${theme.palette.background.b6}`,
    backgroundColor: theme.palette.background.b6,
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.5)',
  },
  rtBoxInner: {
    paddingLeft: 8,
    borderLeft: `2px solid ${theme.palette.primary.contrastText}`,
    borderRadius: '2px',
    cursor: 'pointer',
  },
  rtBoxTitle: {
    fontSize: '11px',
    lineHeight: '14px',
    color: theme.palette.primary.text7,
    letterSpacing: '0.4px',
  },
  rtBoxValue: {
    marginTop: 8,
    fontSize: '20px',
    lineHeight: '14px',
    '& > span': {
      fontSize: '11px',
      lineHeight: '14px',
      color: theme.palette.primary.text7,
    },
  },
  rtBoxButtonContainer: {
    display: 'none',
  },
}));
