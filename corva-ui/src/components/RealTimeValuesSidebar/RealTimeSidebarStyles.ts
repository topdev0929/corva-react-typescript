import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: any) => ({
  rtSidebarVertical: {
    width: '48px',
    height: '100%',
    background: theme.palette.background.b5,
    boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    '&.fullSize': {
      width: '235px',
    },
  },
  rtSidebarHorizontal: (props: any) => ({
    position: 'absolute',
    top: props.sidebarHorizontalHeight,
    left: 0,
    width: '100%',
    height: props.sidebarHorizontalHeight,
    background: theme.palette.background.b5,
    '&.fullSize': {
      height: 'auto',
    },
  }),
  rtSidebarWhiteTheme: {
    background: theme.palette.primary.contrastText,
  },
  rtSidebarContent: {
    overflowY: 'auto',
    height: 'calc(100% - 150px)',
    visibility: 'hidden',
  },
  rtSidebarContentFullSize: {
    visibility: 'visible',
    marginTop: '50px',
    '&.vertical': {
      height: 'calc(100% - 100px)',
    },
    '&.horizontal': {
      height: 'auto',
    },
  },
  rtSidebarHandler: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.background.b7,
      opacity: '0.3',
      zIndex: '999',
    },
  },
  rtSidebarHandlerFullSize: {
    display: 'none',
  },
}));
