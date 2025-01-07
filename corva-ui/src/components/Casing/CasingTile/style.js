import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  tileContainer: {
    width: '100%',
    background: theme.palette.background.b7,
    borderRadius: '4px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
      background: 'rgba(51, 51, 51, 0.7)',
      cursor: 'pointer',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casingTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  bhaCaption: {
    fontWeight: 500,
    fontSize: ({ isMobile }) => (isMobile ? '16px' : '18px'),
    lineHeight: '22px',
  },
  componentsCount: {
    width: 115,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.b9,
    borderRadius: '4px',
    color: theme.palette.primary.text6,
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: 700,
    letterSpacing: '0.18px',
  },
  schematic: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '16px 0px 24px',
    gap: '1px',
  },
  schematicMobile: {
    paddingBottom: 0,
  },
  metricsContainer: {
    display: 'flex',
    marginLeft: '-12px',
  },
  metricItem: {
    display: 'flex',
    flex: 1,
    paddingLeft: '12px',
  },
  metricItemContent: {
    flex: 1,
  },
  metricItemSplit: {
    margin: '6px 0px',
    width: '1px',
    background: '#545454',
  },
  metricItemLabel: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    color: theme.palette.primary.text6,
  },
  metricItemValue: {
    marginTop: '4px',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '24px',
    color: theme.palette.primary.text1,
  },
  noComponents: {
    padding: '32px 0px 45px',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: '23px',
    textAlign: 'center',
    color: theme.palette.primary.text7,
  },
  noComponentsMobile: {
    padding: '9px 0px 4px',
    lineHeight: '19px',
    fontSize: '16px',
  },
}));
