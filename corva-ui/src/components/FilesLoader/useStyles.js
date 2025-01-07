import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => createStyles({
  fileStateWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '16px',
  },
  fileState: {
    display: 'flex',
    flexGrow: '1',
    alignItems: 'center',
  },
  fileStateProgress: {
    flexGrow: '1',
  },
  fileNameWrapper: {
    display: 'table',
    tableLayout: 'fixed',
    width: '100%',
  },
  fileName: {
    display: 'flex',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.palette.primary.text1,
  },
  fileNameLarge: {
    fontSize: '18px',
    lineHeight: '24px',
  },
  firstPart: {
    maxWidth: `calc(100% - 72px)`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileSize: {
    fontSize: '12px',
    lineHeight: '16px',
    color: theme.palette.primary.text6,
  },
  fileSizeLarge: {
    fontSize: '14px !important',
    lineHeight: '20px !important',
  },
  checkIcon: {
    color: theme.palette.success.bright,
  },
  iconButton: {
    padding: '7px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  iconButtonLarge: {
    padding: '8px',
  },
  actionIcon: {
    fontSize: '16px !important',
    cursor: 'pointer',
    color: 'white #important',
  },
  actionIconLarge: {
    fontSize: '24px !important',
  },
  progressBar: {
    borderRadius: '2px',
    height: '2px',
    margin: '4px 0',
  },
  fileActions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
  },
  progressBackground: {
    backgroundColor: `${theme.palette.primary.light}66`,
  },
  progressBarColor: {
    backgroundColor: theme.palette.primary.light,
  },
  progressBarError: {
    backgroundColor: `#ffffff66`,
  },
  loaderProgressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '11px',
    fontWeight: '400',
    letterSpacing: '0.4px',
    color: theme.palette.primary.text6,
    marginTop: '4px',
  },
  progressStatus: {
    fontSize: '12px',
    lineHeight: '16px',
    color: theme.palette.primary.text6,
  },
  errorContainer: {
    display: 'flex',
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginLeft: '8px',
  },
  loadingIcon: {
    width: '30px',
    height: '30px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    animation: '$rotation 1.4s infinite linear',
  },
  '@keyframes rotation': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  loadingLargeIcon: {
    width: '40px',
    height: '40px',
  },
}));
