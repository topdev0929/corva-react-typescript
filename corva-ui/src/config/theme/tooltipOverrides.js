import palette from './palette.mjs';

export default {
  MuiTooltip: {
    popper: {
      '& .MuiTooltip-tooltip': {
        backgroundColor: palette.background.b9,
        boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.12)',
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: '0.4px',
        lineHeight: '16px',
        padding: 4,

        '&.MuiTooltip-tooltipPlacementTop': {
          marginBottom: 8,
        },
        '&.MuiTooltip-tooltipPlacementBottom': {
          marginTop: 8,
        },
        '&.MuiTooltip-tooltipPlacementRight': {
          marginLeft: 8,
        },
        '&.MuiTooltip-tooltipPlacementLeft': {
          marginRight: 8,
        },
      },
    },
  },
};
