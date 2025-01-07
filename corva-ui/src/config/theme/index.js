import { createMuiTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { dateTimePickerThemeOverrides } from './dateTimePickerThemeOverrides';
import accordionOverrides from './accordionOverrides';
import buttonOverrides from './buttonOverrides';
import checkboxOverrides from './checkboxOverrides';
import chipOverrides from './chipOverrides';
import fabOverrides from './fabOverrides';
import formControlLabelOverrides from './formControlLabelOverrides';
import formGroupOverrides from './formGroupOverrides';
import palette from './palette.mjs';
import radioOverrides from './radioOverrides';
import tableOverrides from './tableOverrides';
import textFieldOverrides from './textFieldOverrides';
import tooltipOverrides from './tooltipOverrides';

import { lightThemeVariables, darkThemeVariables } from './themeVariables';
import toggleButtonsGroupOverrides from './toggleButtonsGroupOverrides';

const { text7, text9 } = palette.primary;

const muiThemeOverrides = {
  overrides: {
    MuiMenu: {
      paper: {
        root: {
          overscrollBehaviorY: 'contain',
          '& .MuiMenuItem-root': {
            backgroundColor: palette.background.b9,
            '&$selected': {
              backgroundColor: palette.primary.text9,
            },
          },
        },
        // backgroundColor: '#ffffff',
        // NOTE: We need this because of bug in native app with dropdowns scrolling.
        // https://developers.google.com/web/updates/2017/11/overscroll-behavior
      },
    },
    MuiMenuItem: {
      root: {
        minHeight: 36,
        color: palette.primary.contrastText,
      },
    },
    MuiTooltip: {
      tooltip: { backgroundColor: palette.background.b9 },
    },
    MuiSwitch: {
      switchBase: { color: text7 },
      track: { backgroundColor: text9, opacity: 1 },
      colorPrimary: { '&$checked': { '& + $track': { opacity: 0.38 } } },
      colorSecondary: { '&$checked': { '& + $track': { opacity: 0.38 } } },
    },
    MuiDialogTitle: {
      root: {
        padding: '40px 40px 16px 40px',
        '@media (max-width: 960px)': {
          padding: '16px',
        },
      },
    },
    MuiDialogContent: {
      root: {
        padding: '0 40px 0 40px',
        '@media (max-width: 960px)': {
          padding: '0 16px',
        },
      },
    },
    MuiDialogContentText: {
      root: {
        color: palette.primary.text6,
        lineHeight: '22.5px',
        marginBottom: 0,
      },
    },
    MuiDialogActions: {
      root: {
        padding: '32px 40px 40px 40px',
        '@media (max-width: 960px)': {
          padding: 16,
        },
      },
      spacing: {
        // NOTE: Increased margin between buttons from 8 to 16
        '&>:not(:first-child)': { marginLeft: 16 },
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 48,
      },
    },
    ...accordionOverrides,
    ...buttonOverrides,
    ...checkboxOverrides,
    ...chipOverrides,
    ...dateTimePickerThemeOverrides,
    ...fabOverrides,
    ...formControlLabelOverrides,
    ...formGroupOverrides,
    ...radioOverrides,
    ...tableOverrides,
    ...textFieldOverrides,
    ...tooltipOverrides,
    ...toggleButtonsGroupOverrides,
  },
};

// TODO: Delete this when migrating to mui v5
// We override default menu props to address this issue:
// https://github.com/mui-org/material-ui/issues/19245
const defaultProps = {
  MuiMenu: { getContentAnchorEl: () => null }, // produces warning
  MuiCheckbox: { color: 'primary' },
  MuiRadio: { color: 'primary' },
  MuiChip: { deleteIcon: <CloseIcon /> },
};

export const lightTheme = createMuiTheme({
  props: defaultProps,
  ...lightThemeVariables,
  ...muiThemeOverrides,
  isLightTheme: true,
});

export const darkTheme = createMuiTheme({
  props: defaultProps,
  ...darkThemeVariables,
  palette: {
    ...darkThemeVariables.palette,
    type: 'dark',
  },
  ...muiThemeOverrides,
  isLightTheme: false,
});
