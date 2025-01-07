import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  tableContainer: {
    marginTop: '22px',
    overflowX: 'auto',
    overflowY: 'hidden',
    position: 'relative',
    minHeight: '150px',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    position: 'sticky',
    left: 0,
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '24px',
    color: theme.palette.primary.text1,
  },
  addWellInput: {
    width: ({ isTablet, isMobile }) => (isMobile && !isTablet ? '153px' : '260px'),
  },
  tableTopBorder: {
    borderTop: '1px solid rgba(81, 81, 81, 1)',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      textTransform: 'none',
      borderBottom: theme.isLightTheme
        ? '1px solid rgba(224, 224, 224, 1)'
        : '1px solid rgba(81, 81, 81, 1)',
    },
    '& .ReactVirtualized__Table__row': {
      borderBottom: theme.isLightTheme
        ? '1px solid rgba(224, 224, 224, 1)'
        : '1px solid rgba(81, 81, 81, 1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
      },
    },
    '& .ReactVirtualized__Table__Grid': {
      outline: 'none',
    },
    '& .ReactVirtualized__Table__headerColumn': {
      outline: 'none',
    },
  },
  cell: {
    color: 'rgba(255, 255, 255, 0.54)',
    padding: '5px 10px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  nameWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  nameCell: {
    padding: 0,
  },
  unitCell: {
    padding: 0,
  },
  settingsCell: {
    textAlign: 'right',
  },
  sortIconButton: {
    padding: '8px',
    '&:hover $sortIcon': {
      color: '#fff',
    },
  },
  ascendingSortIcon: {
    transform: 'scaleY(-1)',
  },
  sortIcon: {
    fontSize: '14px',
    color: '#BDBDBD',
  },
  metricsColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  tableCellLabel: {
    fontSize: '0.90rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#fff',
  },
  tableCellLabelDisabled: {
    color: '#C4C4C4',
  },
  errorMsg: {
    color: '#C4C4C4',
    fontStyle: 'italic',
    fontSize: '14px',
    padding: '0 16px',
    whiteSpace: 'nowrap',
  },
}));
