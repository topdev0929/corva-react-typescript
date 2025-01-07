/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import classNames from 'classnames';
import { pick, pickBy, noop } from 'lodash';
import { useTheme } from '@material-ui/core';
import { BugReport as BugReportIcon } from '@material-ui/icons';

import AnnotationIcon from '~components/Icons/AnnotationIcon';
import { AnnotationsList, AnnotationsProvider } from '~/components/Annotations';
import { IconButton, ToastContainer } from '~/components';
import { isNativeDetected, isMobileDetected } from '~/utils/mobileDetect';
import { useDevCenterApp } from '~/effects';
import { DEV_CENTER_CLI_APP_ID } from '~/constants';
import { getAppName, getTimestampFromQuery, getAppSegment } from '~/utils/devcenter';
import { showSuccessNotification } from '~/utils';
import { HelpCenterIcon } from '~/components/HelpCenter';
import { useAppSettings, useAnnotationsList, useAnnotationsData, useAppMaximized } from './effects';
import {
  AppActions,
  AppSettingsDialogV2,
  NonPriorityMenus,
  FullscreenButton,
  DevCenterAppView,
  DcFullscreenElemsCoordinatorProvider,
  IsInsideDcAppProvider,
} from './components';
import AppContext from '../AppContext';

import styles from './DevCenterAppContainer.css';
import RestoreAppSizeButton from './components/RestoreAppSizeButton';
import { getAppAvailability, getAppVersion } from './utils';
import PriorityMenus from './components/PriorityMenus';
import { DevCenterRouterContext } from '../DevCenterRouterContext';
import { RollbarWrapper } from './components/RollbarWrapper/RollbarWrapper';

const isMobileView = isNativeDetected || isMobileDetected;
const PAGE_NAME = 'DevCenter_AppContainer';

function DevCenterAppContainer({
  CLIAppComponent,
  CLIAppSettings,
  app,
  appId,
  className,
  coordinates,
  currentDashboardAppsLastAnnotations,
  currentUser,
  devCenterRouter,
  isActionsDisabled,
  isSettingsDialogHidden,
  layoutEnvironment,
  onAppContainerClick = noop,
  onAppRemove,
  onReportBugClick,
  onCloneDashboard,
  onHelpCenterClick,
  onIsMaximizedChange,
  onSettingChange,
  onSettingsChange,
  openIntercom = noop,
  setIsFullscreenModalMode = noop,
  timestamp,
  updateCurrentDashboardAppLastAnnotation,
}) {
  const appsData = useContext(AppContext);
  const theme = useTheme();
  const [mainMenuItems, setMainMenuItems] = useState([]);
  const [secondaryMenuItems, setSecondaryMenuItems] = useState([]);
  const appData = appsData?.[appId || app.id] ?? {
    isLoading: true,
  };
  const application = app.package?.manifest?.application;
  const segment = getAppSegment(app);
  const isMultiRig = !!application?.ui?.multi_rig;
  const appName = getAppName(app);

  const { isMaximized, setIsMaximized } = useAppMaximized({
    onIsMaximizedChange,
    devCenterRouter,
    appId,
  });

  // Note: we need to pass timestamp directly for apps that are embedded in isolated apps
  const appTimestamp = timestamp || getTimestampFromQuery(devCenterRouter.location.query?.query);
  const isCLIApp = app.id === DEV_CENTER_CLI_APP_ID;
  const updatedCoordinates = isCLIApp && isMobileView ? { ...coordinates, w: 12 } : coordinates;

  const {
    isLoading: isAppLoading,
    AppSettings,
    AppComponent,
  } = useDevCenterApp({
    CLIAppComponent,
    CLIAppSettings,
    app,
    version: getAppVersion(app),
  });

  const { isAppSettingsDialogOpened, toggleAppSettingsDialog } = useAppSettings({
    setIsFullscreenModalMode,
  });
  const { isAnnotationsListOpened, toggleAnnotationsList } = useAnnotationsList();

  const isLoading = isAppLoading || !currentUser || (!isMultiRig && appData.isLoading);

  const { appLastAnnotation, assetCompanyId, assetIdForAnnotation, isAppSupportsAnnotations } =
    useAnnotationsData({
      app,
      appData,
      currentDashboardAppsLastAnnotations,
    });

  const filteredAppData = pickBy(pick(appData, ['well', 'rig', 'fracFleet', 'wells']), Boolean);

  return (
    <RollbarWrapper
      companyId={app?.app?.company_id}
      appKey={application?.key}
      isCLIApp={isCLIApp}
      rollbarManifestConfig={app?.package?.manifest?.settings?.rollbar}
    >
      <DevCenterRouterContext.Provider value={devCenterRouter}>
        <DcFullscreenElemsCoordinatorProvider setIsFullscreenModalMode={setIsFullscreenModalMode}>
          <IsInsideDcAppProvider value>
            <div
              className={classNames(
                'dc-app-container',
                className,
                // This class is applied so that DC apps developers can style their content
                // when an app is in fullscreen
                isMaximized && 'dc-app-container__maximized',
                theme.isLightTheme && 'dc-app-container__light-theme',
                styles.container
              )}
              data-testid={`${PAGE_NAME}_${app.app.name}`}
              // It's important to call it without native event because it's passed through iframe
              onClick={() => onAppContainerClick()}
            >
              <ToastContainer />
              <div className={styles.containerContent}>
                <DevCenterAppView
                  AppComponent={AppComponent}
                  app={app}
                  appData={filteredAppData}
                  isAppLoading={isAppLoading}
                  availability={getAppAvailability(
                    app.availability,
                    currentUser.company.with_subscription
                  )}
                  isCLIApp={isCLIApp}
                  isLoading={isLoading}
                  isMultiRig={isMultiRig}
                  layoutEnvironment={layoutEnvironment}
                  openIntercom={openIntercom}
                  segment={segment}
                  toggleAppSettingsDialog={toggleAppSettingsDialog}
                  appProps={{
                    coordinates: updatedCoordinates,
                    currentUser,
                    devCenterRouter,
                    onSettingChange,
                    onSettingsChange,
                    setIsFullscreenModalMode,
                    setIsMaximized,
                    setMainMenuItems,
                    setSecondaryMenuItems,
                    appHeaderProps: {
                      app,
                      appLastAnnotation,
                      appSettings: app.settings,
                      coordinates: updatedCoordinates,
                      currentUser,
                      isMaximized,
                      layoutEnvironment,
                      onSettingChange,
                      toggleAnnotationsList,
                      updateCurrentDashboardAppLastAnnotation,
                      ...filteredAppData,
                    },
                    isNative: isNativeDetected,
                    layoutEnvironment,
                    timestamp: appTimestamp,
                  }}
                />
              </div>
              {isAppSettingsDialogOpened && (
                <AppSettingsDialogV2
                  AppSettingsComponent={AppSettings}
                  app={app}
                  appData={appData}
                  appName={appName}
                  currentUser={currentUser}
                  isMultiRig={isMultiRig}
                  isSettingsDialogHidden={isSettingsDialogHidden}
                  layoutEnvironment={layoutEnvironment}
                  onAppRemove={onAppRemove}
                  onCloneDashboard={onCloneDashboard}
                  onSettingChange={onSettingChange}
                  onSettingsChange={onSettingsChange}
                  openIntercom={openIntercom}
                  segment={segment}
                  timestamp={appTimestamp}
                  toggleAppSettingsDialog={toggleAppSettingsDialog}
                />
              )}
              {isAnnotationsListOpened && (
                <AnnotationsProvider>
                  <AnnotationsList
                    appId={app.app.id}
                    appSettings={app.settings}
                    appTitle={app.name}
                    assetCompanyId={assetCompanyId}
                    assetId={assetIdForAnnotation}
                    currentUser={currentUser}
                    onClose={toggleAnnotationsList}
                    showSuccessNotification={showSuccessNotification}
                  />
                </AnnotationsProvider>
              )}
              {!isActionsDisabled && isMaximized && (
                <RestoreAppSizeButton setIsMaximized={setIsMaximized} />
              )}

              {!isActionsDisabled && (
                <AppActions>
                  {isAppSupportsAnnotations && (
                    <IconButton
                      data-testid={`${PAGE_NAME}_addAnnotation`}
                      className={styles.footerIconButton}
                      tooltipProps={{ title: !isMobileView && 'Add Annotation' }}
                      onClick={toggleAnnotationsList}
                    >
                      <AnnotationIcon />
                    </IconButton>
                  )}
                  {onReportBugClick && !isCLIApp && (
                    <IconButton
                      onClick={() => onReportBugClick()}
                      className={styles.footerIconButton}
                      tooltipProps={{ title: !isMobileView && 'Report Bug' }}
                    >
                      <BugReportIcon />
                    </IconButton>
                  )}
                  <IconButton
                    data-testid={`${PAGE_NAME}_helpContent`}
                    onClick={() => onHelpCenterClick()}
                    className={styles.footerIconButton}
                    disabled={isCLIApp}
                    tooltipProps={{ title: !isMobileView && 'Help Center' }}
                  >
                    <HelpCenterIcon
                      appId={app.app.id}
                      helpContentUpdatedAt={app.help_content_updated_at}
                    />
                  </IconButton>
                  {isMobileView && !isMaximized ? (
                    <FullscreenButton setIsMaximized={setIsMaximized} />
                  ) : (
                    <>
                      <PriorityMenus
                        menuItems={mainMenuItems}
                        devCenterRouter={devCenterRouter}
                        isMobileView={isMobileView}
                      />
                      <NonPriorityMenus
                        devCenterRouter={devCenterRouter}
                        isMaximized={isMaximized}
                        isMobileView={isMobileView}
                        menuItems={secondaryMenuItems}
                        setIsFullscreenModalMode={setIsFullscreenModalMode}
                        setIsMaximized={setIsMaximized}
                        toggleAppSettingsDialog={toggleAppSettingsDialog}
                      />
                    </>
                  )}
                </AppActions>
              )}
            </div>
          </IsInsideDcAppProvider>
        </DcFullscreenElemsCoordinatorProvider>
      </DevCenterRouterContext.Provider>
    </RollbarWrapper>
  );
}

export default DevCenterAppContainer;
