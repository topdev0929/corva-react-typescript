import palette from './palette.mjs';

export default {
  MuiToggleButtonGroup: {
    root: {
      '&>:first-child': { borderRadius: '24px 0px 0px 24px' },
      '&>:last-child': { borderRadius: '0px 24px 24px 0px' },
      '& .MuiToggleButton-root': {
        height: 36,
        minHeight: 36,
        fontWeight: 500,
        fontSize: 14,
        padding: '10px 20px',
        backgroundColor: palette.background.b7,
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        border: 'none',
        color: palette.primary.text6,
        '&:hover': {
          color: palette.primary.contrastText,
          background: palette.background.b11,
        },
      },
      '& .MuiToggleButton-root.Mui-selected': {
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText,
        '&:hover': {
          background: palette.primary.main,
        },
      },
      '& .MuiToggleButton-root.Mui-disabled': {
        color: palette.primary.text9,
        pointerEvents: 'all',
        '&:hover': {
          background: palette.background.b7,
        },
        '&.Mui-selected': {
          opacity: 0.4,
          color: palette.primary.contrastText,
        },
      },
      '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
        borderLeft: `1px solid ${palette.background.b9}`,
      },
      '& .MuiToggleButton-root.MuiToggleButton-sizeLarge': {
        height: 40,
        minHeight: 40,
        fontWeight: 500,
        fontSize: 16,
        padding: '10px 26px',
      },
      '& .MuiToggleButton-root.MuiToggleButton-sizeSmall': {
        height: 30,
        minHeight: 30,
        fontWeight: 500,
        fontSize: 14,
        padding: '7px 12px',
      },
      '& .MuiToggleButton-label': {
        textTransform: 'none',
      },
    },
  },
};
