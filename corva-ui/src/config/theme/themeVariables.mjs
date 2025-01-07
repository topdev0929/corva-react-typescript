// This file is used in both Node.js end browser envs.
// It has .mjs extension to make ESM syntax work in Node
import teal from '@material-ui/core/colors/teal.js';
import palette from './palette.mjs';
import lightThemePalette from './lightThemePalette.mjs';

const { main: primary } = palette.primary;

export const themeVariables = { palette };
export const lightThemeVariables = { palette: lightThemePalette };

export const darkThemeVariables = {
  ...themeVariables,
  palette: {
    ...themeVariables.palette,
    charts: {
      background: '#2a2e2e',
      gaugeArrow: 'white',
    },
  },
  status: {
    loginTextField: teal['400'],
    loginButton: primary,
    loginButtonHovered: primary,
    loginButtonLabel: '#ffffff',
    loginLinearProgress: teal.A400,
  },
};
