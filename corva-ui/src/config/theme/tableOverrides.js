import palette from './palette.mjs';

const { primary, background } = palette;

export default {
  MuiTableCell: {
    root: {
      borderBottomColor: primary.text9,
      height: 56,
      letterSpacing: '0.4px',
      lineHeight: '20px',
      paddingLeft: 8,
      paddingRight: 8,
      '&.dense': {
        fontSize: 14,
        lineHeight: '14px',
        height: 28,
      },
    },
    stickyHeader: {
      backgroundColor: background.b6,
    },
    head: {
      color: primary.text7,
      fontSize: 14,
      lineHeight: '14px',
      '&.MuiTableCell-sizeSmall': {
        fontSize: 12,
        height: 48,
        lineHeight: '14px',
      },
      '&.dense': {
        fontSize: 12,
        lineHeight: '12px',
        height: 28,
      },
    },
    body: {
      fontSize: 16,
    },
    sizeSmall: {
      fontSize: 14,
      height: 48,
      lineHeight: '20px',
      paddingRight: 16,
    },
  },
  MuiTableRow: {
    root: {
      '&.MuiTableRow-hover:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&.Mui-selected, .MuiTableRow-root.Mui-selected:hover': {
        backgroundColor: 'rgba(3, 188, 212, 0.2)',
      },
    },
    head: {
      borderTop: `1px solid ${primary.text9}`,
    },
  },
  MuiTableSortLabel: {
    root: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      '&:hover': {
        color: palette.primary.contrastText,
        '& .MuiTableSortLabel-icon': {
          opacity: 1,
          color: palette.primary.contrastText,
        },
        '&.MuiTableSortLabel-active': {
          color: palette.primary.contrastText,
          '&.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiSvgIcon-root.MuiTableSortLabel-icon': {
            color: palette.primary.contrastText,
          },
        },
      },
      '&.MuiTableSortLabel-active': {
        color: palette.primary.text7,
        '&.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiSvgIcon-root.MuiTableSortLabel-icon': {
          color: palette.primary.text7,
        },
      },
    },
    icon: {
      marginRight: 0,
      color: palette.primary.text7,
      fontSize: 16,
    },
  },
  MuiTablePagination: {
    toolbar: {
      paddingTop: 10,
    },
    caption: {
      fontSize: 12,
    },
    selectRoot: {
      marginRight: 31,
      marginLeft: 3,
      '& .MuiTablePagination-select': {
        paddingRight: 31,
        paddingLeft: 2,
      },
    },
    input: {
      fontSize: 12,
      position: 'relative',
      top: 1,
    },
    selectIcon: {
      '&.MuiSvgIcon-root.MuiSelect-icon': {
        fontSize: 16,
        top: 5,
      },
    },
    actions: {
      marginLeft: 23,
      '& .MuiIconButton-root': {
        color: primary.text6,
        fontSize: 16,
        padding: 7,
        '&:hover': {
          color: primary.contrastText,
        },
        '&.Mui-disabled': {
          color: primary.text8,
        },
      },
    },
    root: {
      '& .MuiSvgIcon-root': {
        color: 'inherit',
        fontSize: 'inherit',
      },
    },
  },
};
