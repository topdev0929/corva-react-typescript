import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modalTitle: {
    background: ({ isCompletionApp }) =>
      isCompletionApp
        ? 'linear-gradient(270deg, #3F33A9 0%, #DA4583 98.46%)'
        : 'linear-gradient(90deg, #05B58B 1.96%, #3A83D3 101.28%)',
    paddingBottom: 24,
  },
  modalTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  appStoreButton: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    cursor: 'pointer',
    width: 'fit-content',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  closeIcon: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
    },
  },
  appVersionSelect: {
    marginTop: 16,
    width: '100%',
  },
  modalActions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginLeft: 16,
  },
  appIcon: {
    marginRight: 12,
  },
  accordionDetails: {
    flexDirection: 'column',
    paddingTop: ({ hasCustomAppSettings }) => (hasCustomAppSettings ? 12 : 0),
    paddingLeft: ({ hasCustomAppSettings }) => (hasCustomAppSettings ? 32 : 0),
  },
  summaryContent: {
    display: ({ hasCustomAppSettings }) => (hasCustomAppSettings ? 'block' : 'none'),
    fontSize: 16,
    color: theme.palette.primary.contrastText,
  },
  expandIcon: {
    display: ({ hasCustomAppSettings }) => (hasCustomAppSettings ? 'block' : 'none'),
    '& svg': {
      width: 24,
      height: 24,
    },
  },
  hiddenAppSettings: {
    position: 'fixed',
    left: '-10000px',
    top: '-10000px',
  },
  accordion: {
    marginTop: ({ hasCustomAppSettings }) =>
      hasCustomAppSettings ? '24px !important' : '0px !important',
  },
  modalContainer: {
    width: 600,
    maxWidth: 600,
  },
  assetAccordion: {
    marginTop: ({ hasCustomAppSettings }) =>
      hasCustomAppSettings ? '8px !important' : '-24px !important',
  },
}));

export default useStyles;
