import { makeStyles } from '@material-ui/core';

export const useFormulaStyles = makeStyles(theme => ({
  formulaContainer: {
    width: '474px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: '16px',
    gap: '16px',
    background: theme.palette.background.b8,
  },
  formulaHeaderWrapper: {
    width: '100%',
    height: '14px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  formulaHeaderTextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  formulaHeaderText: {
    fontSize: '10px',
    lineHeight: '16px',
    marginLeft: '5px',
  },
  formulaHeaderButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.text7,
    '&:hover': {
      color: ({ isValue }) => (isValue ? theme.palette.primary.text1 : theme.palette.primary.text7),
      cursor: ({ isValue }) => (isValue ? 'pointer' : 'default'),
    },
  },
  formulaCloseIcon: {
    width: '12px',
    height: '12px',
  },
  formulaEditorWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  formulaFooterWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  formulaFooterIcon: {
    width: '12px',
    height: '12px',
    marginRight: '6px',
    color: '#DADADA',
  },
  formulaFooterTextWrapper: {},
  formulaFooterText: {
    fontSize: '10px',
    lineHeight: '14px',
    letterSpacing: '0.4px',
    color: theme.palette.primary.text7,
  },
  funcText: {
    padding: '0px 5px',
    color: theme.palette.primary.text1,
    backgroundColor: theme.palette.background.b10,
    fontWeight: 700,
    borderRadius: '4px',
  },
  verifyButton: {
    width: '64px',
    height: '30px',
  },
  resultText: {
    marginTop: '-12px',
    fontSize: '12px',
    lineHeight: '17px',
    letterSpacing: '0.4px',
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  successColor: {
    color: theme.palette.primary.main,
  },
  resultSuccessColor: {
    color: theme.palette.success.bright,
  },
  tooltipWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '124px',
    padding: '8px',
  },
  tooltipLine: {
    padding: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tooltipValue: {
    color: theme.palette.primary.text1,
  },
  tooltipLabelContainer: {
    color: theme.palette.primary.text7,
    display: 'flex',
    alignItems: 'center',
  },
  tooltipSymbol: {
    marginRight: '2px',
    marginBottom: '2px',
  },
}));
