import { makeStyles } from '@material-ui/core';

// NOTE: Do not extract these styles to .css file as they are collected for zoid isolated container with ServerStyleSheets
export const useStyles = makeStyles(({ palette }) => ({
  appHeaderWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  appHeaderContainer: {
    display: 'flex',
  },
  titleBlock: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginRight: 16,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    maxWidth: '130px',
    maxHeight: '40px',
  },
  separateLine: {
    width: '1px',
    height: '16px',
    backgroundColor: palette.primary.text9,
    borderRadius: '1px',
    margin: 'auto 12px',
  },
  title: {
    margin: '0 8px 0 1px',
    fontSize: '18px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: '24px',
    zIndex: 1000,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    margin: '0 0 0 1px',
    fontSize: '12px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 400,
    lineHeight: '16px',
  },
}));
