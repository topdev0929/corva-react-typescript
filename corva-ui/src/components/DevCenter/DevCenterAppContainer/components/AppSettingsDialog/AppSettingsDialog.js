import { useState } from 'react';
import { func, shape, string, bool } from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  withStyles,
} from '@material-ui/core';
import { cloneDeep, get, noop } from 'lodash';
import ErrorBoundary, { DevCenterAppErrorView } from '~/components/ErrorBoundary';
import {
  Button,
  AppSettingsAssetEditor,
  AppVersionsSelect,
  DisabledSettingsMessage,
} from '~/components';
import ConfirmationDialog from '~components/ConfirmationDialog';
import { DEV_CENTER_CLI_APP_ID } from '~/constants';
import { SEGMENT_TO_ASSET_TYPE, SEGMENTS } from '~/constants/segment';

import RemoveAppButton from './RemoveAppButton';
import AppDetails from './AppDetails';

import styles from './AppSettingsDialog.module.css';

export const PAGE_NAME = 'DC_appSettings';
const StyledDialog = withStyles({ paper: { minWidth: '50rem', height: '40rem' } })(Dialog);
const StyledTabs = withStyles({ root: { marginBottom: 10 } })(Tabs);

const TABS_CONFIG = {
  settings: 'SETTINGS',
  appDetails: 'APP DETAILS',
};

const getAppPageUrl = appId => `/app-store/app/${appId}`;

function AppSettingsDialog({
  AppSettingsComponent,
  app,
  appData,
  appName,
  currentUser,
  isMultiRig,
  isSettingsDialogHidden,
  layoutEnvironment,
  onAppRemove,
  onCloneDashboard,
  onSettingsChange,
  segment,
  toggleAppSettingsDialog,
  openIntercom,
}) {
  const [activeTab, setActiveTab] = useState(TABS_CONFIG.settings);
  const [appSettings, setAppSettings] = useState(() => ({
    ...cloneDeep(app.settings),
    package: app.settings.package || app?.package?.version,
  }));
  const [isAppSettingsValid, setIsAppSettingsValid] = useState(true);

  const isCLIApp = app.id === DEV_CENTER_CLI_APP_ID;

  const handleChangeTab = (event, tabKey) => setActiveTab(tabKey);

  const onSave = () => {
    if (appSettings.package || isCLIApp) {
      onSettingsChange(appSettings);
      toggleAppSettingsDialog();
    } else setIsAppSettingsValid(false);
  };

  const onAppSettingChange = (name, value) =>
    setAppSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));

  const onAppSettingsChange = newSettings =>
    setAppSettings(prevSettings => ({ ...prevSettings, ...newSettings }));

  const isAssetPage = layoutEnvironment && layoutEnvironment.type === 'asset';
  const isAssetSelectorRequired = !isMultiRig && !(isAssetPage && segment === SEGMENTS.COMPLETION);

  return (
    <StyledDialog open onBackdropClick={toggleAppSettingsDialog}>
      <DialogTitle>{appName} settings</DialogTitle>
      <Divider />
      <DialogContent>
        <StyledTabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            data-testid={`${PAGE_NAME}_settingsTab`}
            label={TABS_CONFIG.settings}
            value={TABS_CONFIG.settings}
          />
          <Tab
            data-testid={`${PAGE_NAME}_appDetailsTab`}
            label={TABS_CONFIG.appDetails}
            value={TABS_CONFIG.appDetails}
          />
          <Button
            data-testid={`${PAGE_NAME}_viewAppPageTab`}
            className={styles.viewAppButton}
            onClick={() => window.open(getAppPageUrl(app?.app?.id), '_blank')}
          >
            VIEW APP PAGE
          </Button>
        </StyledTabs>
        <ErrorBoundary ErrorView={DevCenterAppErrorView} openIntercom={openIntercom}>
          <ConfirmationDialog
            open={!isAppSettingsValid && !appSettings.package}
            isShowCancel={false}
            title="Validation failed"
            text="You should select the app version to proceed"
            handleOk={() => setIsAppSettingsValid(true)}
          />
          {activeTab === TABS_CONFIG.settings && (
            <>
              {isSettingsDialogHidden && <DisabledSettingsMessage />}

              {!isSettingsDialogHidden && (
                <>
                  {isAssetSelectorRequired && (
                    <AppSettingsAssetEditor
                      appKey={isCLIApp ? null : app.app.app_key}
                      settings={appSettings}
                      onSettingsChange={onAppSettingsChange}
                      appType={SEGMENT_TO_ASSET_TYPE[segment]}
                      isNullable={isAssetPage}
                      label="Active Asset"
                    />
                  )}

                  {AppSettingsComponent && (
                    <AppSettingsComponent
                      app={app}
                      appData={appData}
                      settings={appSettings}
                      onSettingChange={onAppSettingChange}
                      onSettingsChange={onAppSettingsChange}
                      layoutEnvironment={layoutEnvironment}
                      currentUser={currentUser}
                    />
                  )}
                  <AppVersionsSelect
                    appId={app.app.id}
                    value={appSettings.package}
                    onChange={val => onAppSettingChange('package', val)}
                  />
                </>
              )}
            </>
          )}
          {activeTab === TABS_CONFIG.appDetails && (
            <AppDetails
              appDescription={get(app, 'app.description')}
              appSummary={get(app, 'app.summary')}
            />
          )}
        </ErrorBoundary>
      </DialogContent>
      <DialogActions>
        {!isSettingsDialogHidden && onAppRemove && (
          <RemoveAppButton appName={appName} onAppRemove={onAppRemove} />
        )}
        <Button
          data-testid={`${PAGE_NAME}_cancel`}
          variation="secondary"
          onClick={toggleAppSettingsDialog}
        >
          Cancel
        </Button>
        {isSettingsDialogHidden && (
          <Button variation="primary" onClick={() => onCloneDashboard()}>
            Copy Dashboard
          </Button>
        )}
        {!isSettingsDialogHidden && (
          <Button data-testid={`${PAGE_NAME}_save`} variation="primary" onClick={onSave}>
            Save
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
}

AppSettingsDialog.propTypes = {
  AppSettingsComponent: func,
  app: shape({}).isRequired,
  appData: shape({}).isRequired,
  appName: string.isRequired,
  currentUser: shape({}).isRequired,
  isMultiRig: bool.isRequired,
  isSettingsDialogHidden: bool,
  layoutEnvironment: shape({}).isRequired,
  onAppRemove: func,
  onCloneDashboard: func,
  onSettingsChange: func.isRequired,
  segment: string.isRequired,
  toggleAppSettingsDialog: func.isRequired,
};

AppSettingsDialog.defaultProps = {
  AppSettingsComponent: null,
  isSettingsDialogHidden: false,
  onAppRemove: undefined,
  onCloneDashboard: noop,
};

export default AppSettingsDialog;
