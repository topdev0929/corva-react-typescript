import palette from './palette.mjs';

const {
  primary: { text6 },
} = palette;

export default {
  MuiRadio: {
    root: {
      '&.small': {
        padding: 6,
        marginLeft: 4,
        '& .MuiSvgIcon-root': { fontSize: 16 },
      },
      color: text6,
      '&.MuiRadio-colorPrimary.Mui-checked:hover': {
        backgroundColor: 'rgba(3, 188, 212, 0.04)', // NOTE: primary color
      },
    },

    colorPrimary: {
      '&:hover': { backgroundColor: 'rgba(189, 189, 189, 0.04)' },
      '&.Mui-disabled': { color: 'rgb(218, 218, 218, 0.4)' },
      '&.Mui-checked.Mui-disabled': { color: 'rgba(3, 188, 212, 0.4)' },
    },
  },
};
