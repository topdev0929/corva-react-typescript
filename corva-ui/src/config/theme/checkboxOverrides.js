import palette from './palette.mjs';

const { primary } = palette;

export default {
  MuiCheckbox: {
    root: {
      color: primary.text6,
      padding: 8,
      '&.MuiCheckbox-colorPrimary.Mui-checked:hover': {
        backgroundColor: 'rgba(3, 188, 212, 0.04)', // NOTE: primary color
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.625rem',
      },
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '1.125rem',
      },
    },
    colorPrimary: {
      '&:hover': {
        backgroundColor: 'rgba(3, 188, 212, 0.04)', // NOTE: primary color
      },
      '&.MuiCheckbox-indeterminate': {
        color: primary.main,
      },
      '&.Mui-disabled': {
        opacity: 0.4,
        color: primary.text6,
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: primary.main,
        },
      },
    },
  },
};
