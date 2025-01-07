import palette from './palette.mjs';

const { primary, background } = palette;

export default {
  MuiButton: {
    root: {
      height: 36,
      padding: '12px 16px',
      letterSpacing: '1px',
      '&.Mui-disabled': {
        opacity: 0.4,
      },
      '&:hover': {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
      },
      '& .MuiSvgIcon-root': {
        color: 'inherit',
      },
      '& .MuiButton-startIcon': {
        '&.MuiButton-iconSizeSmall': {
          marginLeft: '-4px',
          marginRight: 4,
        },
        '&.MuiButton-iconSizeMedium': {
          marginLeft: '-8px',
        },
        '&.MuiButton-iconSizeLarge': {
          marginLeft: '-8px',
        },
      },
      '& .MuiButton-endIcon': {
        '&.MuiButton-iconSizeSmall': {
          marginRight: '-4px',
          marginLeft: 4,
        },
        '&.MuiButton-iconSizeMedium': {
          marginRight: '-8px',
        },
        '&.MuiButton-iconSizeLarge': {
          marginRight: '-8px',
        },
      },
      '& .MuiButton-iconSizeMedium > *:first-child': {
        fontSize: '24px',
      },
      '& .MuiButton-iconSizeLarge > *:first-child': {
        fontSize: '24px',
      },
      '& .MuiButton-iconSizeSmall > *:first-child': {
        fontSize: '24px',
      },
    },
    sizeLarge: {
      height: 40,
      fontSize: 16,
      fontWeight: 700,
      padding: '12px 16px',
    },
    sizeSmall: {
      height: 30,
      padding: 8,
    },
    contained: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
      '&:hover': {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
      },
    },
    containedPrimary: {
      '&.Mui-disabled': {
        backgroundColor: primary.main,
        color: '#FFFFFF',
      },
    },
    textPrimary: {
      '&:hover': {
        color: primary.main,
        backgroundColor: 'rgba(3, 188, 212, 0.2)',
      },
      '&.Mui-disabled': {
        color: primary.main,
      },
    },
    text: {
      padding: '12px 16px',
      color: primary.text6,
      '&:hover': {
        color: '#FFFFFF',
        backgroundColor: background.b7,
      },
      '&.Mui-disabled': {
        color: primary.text6,
      },
    },
  },
};
