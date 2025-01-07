import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles<Theme>(theme => ({
  main: {
    width: 443,
    height: 48,
    maxWidth: '85vw',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    padding: 0,
    marginBottom: theme.spacing(2),
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    '& .MuiSvgIcon-root': {
      color: theme.palette.background.b7,
    },
    '& p': {
      color: theme.palette.background.b7,
    },
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  neutral: {
    backgroundColor: theme.palette.background.b9,
    '& .MuiSvgIcon-root': { color: theme.palette.primary.text7 },
  },
  title: {
    color: theme.palette.grey[600],
    fontWeight: 400,
  },
  alertTitle: {
    color: theme.palette.primary.contrastText,
  },
  content: {
    fontSize: '14px',
    lineHeight: '16px',
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    height: 'fit-content',
    display: '-webkit-box',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  alertContent: {
    color: '#CCCCCC',
  },
  iconWrapper: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    height: 35,
    padding: '0px 10px 0 18px',
  },
  icon: {
    width: 20,
    height: 20,
    transform: 'scale(1.2)',
  },
  closeIconButton: {
    '&.MuiButtonBase-root': {
      color: theme.palette.primary.contrastText,
      padding: 11,
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
      '&:active': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    },
  },
  closeIcon: {
    width: 14,
    height: 14,
    '&.MuiSvgIcon-root': {
      fontSize: 14,
      transform: 'scale(1.715)',
    },
  },
  messageContainer: {
    overflowX: 'hidden',
    flex: 1,
  },
  messageWrapper: {
    display: 'flex',
  },
  message: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    minHeight: 35,
    height: '100%',
    overflowY: 'hidden',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  messageTop: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  messageContent: {
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  timestamp: {
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  actionContainer: {
    paddingLeft: '8px',
    marginRight: '16px',
  },
  alertNotification: {
    paddingLeft: 12,
    backgroundColor: theme.palette.background.b9,
    height: 'unset',
  },
  'alertLevels-info': {
    borderLeft: '15px solid rgb(119, 195, 241)',
  },
  'alertLevels-warning': {
    borderLeft: '15px solid rgb(242, 192, 70)',
  },
  'alertLevels-critical': {
    borderLeft: '15px solid rgb(237, 70, 48)',
  },
  tooltip: {
    marginTop: 8,
    color: theme.palette.primary.contrastText,
  },
}));
