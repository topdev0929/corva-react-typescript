import palette from './palette.mjs';

const { primary, error } = palette;

export default {
  MuiTextField: {
    root: {
      '&:hover': {
        '& .MuiFormLabel-root:not(.Mui-disabled, .Mui-focused)': {
          color: primary.contrastText,
        },
        '& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.Mui-error': {
          color: error.main,
        },
        '& .MuiInput-root.MuiInput-underline:not(.Mui-disabled):before': {
          borderBottom: `1px solid ${primary.contrastText}`,
        },
        '& .MuiInput-root.Mui-error.MuiInput-underline::after': {
          borderBottom: `2px solid ${error.main}`,
        },
      },
      '& .MuiFormLabel-root': {
        color: primary.text6,
        '&.MuiInputLabel-shrink': {
          letterSpacing: '0.4px',
          top: 1,
        },
        '&.Mui-error': {
          color: error.main,
          '&.Mui-focused': {
            color: error.main,
          },
        },
        '&.Mui-focused': {
          color: primary.main,
        },
        '&.Mui-disabled': {
          opacity: '0.5',
        },
        '&:not(.MuiInputLabel-shrink)+.MuiInputAdornment-root': {
          marginRight: 8,
        },
        '& .MuiFormLabel-asterisk': {
          display: 'none',
        },
      },
      '& .MuiInput-root': {
        color: primary.contrastText,
        '& .MuiInput-input': {
          paddingTop: 5,
          paddingBottom: 5,
          height: 22,
        },
        '& .MuiInput-input.MuiInputBase-inputMarginDense': {
          paddingTop: 2,
          paddingBottom: 4,
        },
        '&.Mui-focused .MuiInputAdornment-root svg': {
          fill: primary.main,
        },
        '&.MuiInput-underline:before': {
          borderBottom: `1px solid ${primary.text6}`,
        },
        '&.Mui-error.MuiInput-underline::after': {
          borderBottom: `1px solid ${error.main}`,
        },
        '&.Mui-error.Mui-focused.MuiInput-underline::after': {
          borderBottom: `2px solid ${error.main}`,
        },
        '&.Mui-disabled': {
          opacity: '0.5',
          '&.MuiInput-underline:before': {
            borderBottom: `1px solid ${primary.text6}`,
          },
        },
        '&.Mui-error .MuiInputAdornment-root svg': {
          fill: primary.contrastText,
        },
        '& .MuiInputAdornment-root': {
          marginBottom: 2,
          '&.MuiInputAdornment-marginDense': {
            marginBottom: '1px',
          },
          '& svg': {
            fontSize: 16,
            fill: primary.contrastText,
          },
          '& p': {
            fontSize: 14,
            lineHeight: '24px',
            color: primary.text8,
          },
        },
      },
    },
  },
};
