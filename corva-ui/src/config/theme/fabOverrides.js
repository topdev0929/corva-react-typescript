import palette from './palette.mjs';

const { main: primary } = palette.primary;

export default {
  MuiFab: {
    root: {
      width: 40,
      height: 40,
      '&:active': {
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',
      },
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      '&.Mui-disabled': {
        backgroundColor: primary,
        color: '#FFFFFF',
        opacity: '0.4',
      },
    },
    sizeSmall: {
      width: 30,
      height: 30,
      minHeight: 30,
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    sizeMedium: {
      width: 36,
      height: 36,
    },
  },
};
