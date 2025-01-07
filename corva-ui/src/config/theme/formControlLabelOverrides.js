export default {
  MuiFormControlLabel: {
    root: {
      '& .MuiRadio-root': { marginRight: 3 },
      '&.dense': { marginTop: -4, marginBottom: -4 },
      '&.small': {
        marginTop: 4,
        marginBottom: 4,
        '& .MuiRadio-root': {
          padding: 6,
          marginLeft: 4,
          marginRight: 2,
          '& .MuiSvgIcon-root': { fontSize: 16 },
        },
        '& .MuiFormControlLabel-label': { fontSize: 14 },
        '&.dense': { marginTop: 0, marginBottom: 0 },
      },
    },
    label: { '&.Mui-disabled': { color: 'white', opacity: 0.4 } },
  },
};
