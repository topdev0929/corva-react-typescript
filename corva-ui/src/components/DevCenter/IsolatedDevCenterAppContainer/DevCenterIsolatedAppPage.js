import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import classNames from 'classnames';
import moment from 'moment-timezone';
import { DevCenterAppContainer } from '~/components';
import { withMUIProvidersHOC } from '~/hocs';
import AppContext from '~/components/DevCenter/AppContext';
import { THEMES } from '~/constants/theme';
import { LOCAL_STORAGE_APP_THEME_KEY } from '~/CLI/hocs/constants';
import { setThemeVariables } from '~/utils/themeVariables';
import { isPDFReportView } from '~/CLI/hocs/utils';
import { PermissionsContext } from '~/permissions/PermissionsContext';
import { updateUserUnits } from '~/utils';
import '~/config/initGlobalDependencies';
import '~/styles/globalStyles';

import { useXProps } from './effects/useXProps';
import { ISOLATED_PAGE_APP_CONTAINER_ID } from './constants';
import { replaceUndefinedValuesWithNull } from './utils/replaceUndefinedValuesWithNull';
import './DevCenterAppZoidComponent';

const DevCenterAppContainerWithMUI = withMUIProvidersHOC(DevCenterAppContainer);

/**
 * It's important to keep these global styles in js, to apply only
 * when the component is actually used, if moved to CSS - they'll be
 * applied to whatever somehow imports the code
 */
const useStyles = makeStyles(() => ({
  '@global': {
    body: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
  },
}));

/**
 * Root component that is rendered inside of app's iframe.
 * Receives CLIAppComponent, CLIAppSettings when used
 * in local development
 */
export function DevCenterIsolatedAppPage({
  CLIAppComponent,
  CLIAppSettings,
  containerReportClassName,
}) {
  useStyles();

  const {
    appContextValue,
    permissionsContextValue,
    globalNotificationToastsAPI,
    userUnits,
    onSettingChange,
    onSettingsChange,
    timezone,
    ...xProps
  } = useXProps();
  const isReportsPage = xProps.location.pathname.startsWith('/reports/') || isPDFReportView;

  // Force dark theme for login page. Force light theme for PDF reports view
  const selectedTheme = localStorage.getItem(LOCAL_STORAGE_APP_THEME_KEY) ?? THEMES.DARK;
  const isDarkTheme = !isReportsPage && selectedTheme === THEMES.DARK;

  useEffect(() => {
    setThemeVariables(isDarkTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    window[Symbol.for('notificationToasts')] = globalNotificationToastsAPI;
  }, [globalNotificationToastsAPI]);

  useEffect(() => {
    updateUserUnits({ userUnits });
  }, []);

  useEffect(() => {
    if (timezone) moment.tz.setDefault(timezone);
    return () => moment.tz.setDefault(null);
  }, [timezone]);

  return (
    <PermissionsContext.Provider value={permissionsContextValue}>
      <AppContext.Provider value={appContextValue}>
        <div
          id={ISOLATED_PAGE_APP_CONTAINER_ID}
          className={classNames(isReportsPage && containerReportClassName)}
        >
          <DevCenterAppContainerWithMUI
            {...xProps}
            theme={isDarkTheme ? THEMES.DARK : THEMES.LIGHT}
            // zoid serializes passed arguments using JSON.stringify.
            // All undefined values are removed as they are not valid JSON values
            // so we replace undefined values with null to not drop them
            // Any future cb function that passes arbitrary objects as args
            // also should be wrapped in this mapper
            onSettingsChange={nextSettings =>
              onSettingsChange(replaceUndefinedValuesWithNull(nextSettings))
            }
            onSettingChange={(key, value) =>
              onSettingChange(key, replaceUndefinedValuesWithNull(value))
            }
            CLIAppComponent={CLIAppComponent}
            CLIAppSettings={CLIAppSettings}
          />
        </div>
      </AppContext.Provider>
    </PermissionsContext.Provider>
  );
}

DevCenterIsolatedAppPage.propTypes = {
  CLIAppComponent: PropTypes.node,
  CLIAppSettings: PropTypes.node,
  containerReportClassName: PropTypes.string,
};

DevCenterIsolatedAppPage.defaultProps = {
  CLIAppComponent: null,
  CLIAppSettings: null,
  containerReportClassName: null,
};
