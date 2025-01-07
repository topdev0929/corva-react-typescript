import { MuiThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { darkTheme, lightTheme } from '~/config/theme';
import { THEMES } from '~/constants/theme';

/* eslint-disable react/prop-types */
const withMUIProvidersHOC = WrappedComponent => ({ theme = THEMES.DARK, ...props }) => {
  return (
    <MuiThemeProvider theme={theme === THEMES.DARK ? darkTheme : lightTheme}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <WrappedComponent {...props} />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default withMUIProvidersHOC;
