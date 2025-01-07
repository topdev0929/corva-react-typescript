import { makeStyles, Theme } from "@material-ui/core";

type DQUnvalidatedContentStyleProps = {
  maxHeight?: number;
};

export const useDQUnvalidatedContentStyles = makeStyles<Theme, DQUnvalidatedContentStyleProps>(theme => ({
  alertIcon: {
    width: 16,
    height: 16,
  },
  assetWrapper: { display: 'table-row' },
  assetTable: {
    display: 'table',
    color: theme.palette.primary.contrastText,
    marginLeft: 8,
  },
  assetCell: {
    display: 'table-cell',
    padding: '5px 0',
    verticalAlign: 'middle',
    width: 111,
  },
  assetName: {
    fontSize: '12px',
    width: 89,
  },
  container: { padding: '12px 0 4px 12px' },
  headerText: {
    lineHeight: '19px',
    fontSize: '16px',
    fontWeight: 500,
  },
  subheaderText: {
    lineHeight: '14px',
    fontSize: '12px',
    fontWeight: 400,
    marginRight: 16,
    color: theme.palette.primary.text7,
    marginTop: 4,
  },
  Issue: { color: '#ffa500' },
  Missing: { color: theme.palette.error.main },
  Resolved: { color: theme.palette.success.bright },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    height: 22,
  },
  missingContainer: { marginLeft: 0, },
  errorText: {
    marginLeft: 4,
    fontSize: '14px',
  },
  errorNum: {
    fontSize: '16px',
    marginLeft: 4,
  },
  accordion: {
    '&:not(:first-child)': {
      marginTop: '16px !important',
    },
    marginTop: '8px !important',
    color: theme.palette.primary.contrastText,
    '& .MuiAccordionSummary-content': {
      fontWeight: '400 !important',
    }
  },
  accordionDetails: { marginTop: 8 },
  categoryName: { marginTop: 4 },
  accordionsWrapper: {
    maxHeight: ({ maxHeight }) => maxHeight,
    overflowY: 'auto',
    paddingRight: 16,
    '&::before, &::after': {
      content: '""',
      width: '100%',
      height: 16,
      position: 'absolute',
      zIndex: 1,
    },
    '&::before': {
      background: `linear-gradient(180deg, ${theme.palette.background.b9} 18.23%, rgba(59, 59, 59, 0) 100%)`,
      opacity: 0.8,
      top: 0,
    },
    '&::after': {
      background: `linear-gradient(0deg, ${theme.palette.background.b9} 18.23%, rgba(59, 59, 59, 0) 100%)`,
      opacity: 0.8,
      bottom: 0,
    }
  },
  relative: {
    position: 'relative',
    padding: '8px 0',
  },
  reportDQIssueButtonWrapper: {
    display: 'flex',
    justifyContent: 'end',
  },
  reportDQIssueButton: {
    marginRight: 12,
    marginBottom: 8,
  },
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  linkIcon: {
    width: 24,
    height: 24,
    color: theme.palette.primary.main,
  },
  link: {
    lineHeight: 0,
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    '&:hover': { backgroundColor: theme.palette.background.b7 }
  },
}));
