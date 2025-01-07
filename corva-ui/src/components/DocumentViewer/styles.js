import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  cDocsViewer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cDocsViewerToolbar: {
    position: 'absolute',
    top: 0,
    height: 48,
    width: '100%',
    background: theme.palette.background.b4,
    zIndex: 1001,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cDocsViewerFrame: {
    position: 'absolute',
    top: 48,
    width: 'calc(100% - 64px)',
    height: 'calc(100% - 64px)',
    left: 32,
    border: 'none',
    borderRadius: 4,
    background: '#eee',
  },
  cDocsViewerFrameFailed: {
    color: '#000',
    fontWeight: 'bold',
  },
  cDocsViewerFrameHidden: {
    visibility: 0,
    height: 0,
  },
  cDocsViewerToolbarIconButton: {
    marginLeft: 12,
    color: theme.palette.primary.text6,
    '& a': { color: theme.palette.primary.text6, width: 20, height: 20 },
  },
}));
