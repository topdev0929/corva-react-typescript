import { useState, useRef, useEffect } from 'react';
import { func, shape, string, bool, node } from 'prop-types';
import { cloneDeep, debounce, noop } from 'lodash';
import {
  Accordion as AccordionComponent,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { ArrowForward as ArrowIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import ErrorBoundary, { DevCenterAppErrorView } from '~/components/ErrorBoundary';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import AppSettingsAssetEditorV2 from '~/components/AssetEditorV2';
import AppVersionsSelect from '~/components/AppVersionsSelect';
import { DisabledSettingsMessage } from '~/components/DisabledSettingsMessage';
import ConfirmationDialog from '~/components/ConfirmationDialog';
import { DEV_CENTER_CLI_APP_ID } from '~/constants';
import { SEGMENT_TO_ASSET_TYPE, SEGMENTS } from '~/constants/segment';

import RemoveAppButton from './RemoveAppButton';
import useStyles from './styles';
import AppIcon from '~/components/AppIcon';

export const PAGE_NAME = 'DC_appSettings';

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
  openIntercom,
  segment,
  toggleAppSettingsDialog,
}) {
  // eslint-disable-next-line no-unused-vars
  const [_, setIsMounted] = useState(false);
  const [appSettings, setAppSettings] = useState(() => ({
    ...cloneDeep(app.settings),
    package: app.settings.package || app?.package?.version,
  }));

  const [isAppSettingsValid, setIsAppSettingsValid] = useState(true);
  const customAppSettingsRef = useRef(null);

  const hasCustomAppSettings = Boolean(customAppSettingsRef.current?.clientHeight);

  const styles = useStyles({
    isCompletionApp: segment === SEGMENTS.COMPLETION,
    hasCustomAppSettings,
  });

  const isCLIApp = app.id === DEV_CENTER_CLI_APP_ID;

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

  useEffect(() => {
    const debouncedSetIsMounted = debounce(setIsMounted, 200);
    debouncedSetIsMounted(true);
  }, []);

  const appSettingsComponent = (
    <div ref={customAppSettingsRef}>
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
    </div>
  );

  const modalTitle = (
    <div className={styles.modalTitleContainer}>
      <AppIcon
        className={styles.appIcon}
        segment={app?.segment}
        iconUrl={app?.icon?.url}
        height={48}
        width={48}
      />
      <div>
        <div>{`${appName} Settings`}</div>
        <div
          data-testid={`${PAGE_NAME}_appstoreLink`}
          className={styles.appStoreButton}
          onClick={() => window.open(getAppPageUrl(app?.app?.id), '_top')}
        >
          Open in Appstore <ArrowIcon className={styles.arrowIcon} />
        </div>
      </div>
    </div>
  );

  const modalActions = (
    <div className={styles.modalActions}>
      {!isSettingsDialogHidden && onAppRemove && (
        <RemoveAppButton appName={appName} onAppRemove={onAppRemove} />
      )}
      <div className={styles.mainActions}>
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
          <Button
            data-testid={`${PAGE_NAME}_save`}
            className={styles.saveButton}
            variation="primary"
            onClick={onSave}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );

  const mainSettingsContent = (
    <>
      {isAssetSelectorRequired && (
        <AppSettingsAssetEditorV2
          appKey={isCLIApp ? null : app.app.app_key}
          settings={appSettings}
          onSettingsChange={onAppSettingsChange}
          appType={SEGMENT_TO_ASSET_TYPE[segment]}
          isNullable={isAssetPage}
          label="Asset"
          isHiddenTitle
          isHiddenMultipleAssetsToggle
        />
      )}
      <AppVersionsSelect
        className={styles.appVersionSelect}
        appId={app.app.id}
        value={appSettings.package}
        onChange={val => onAppSettingChange('package', val)}
      />
    </>
  );

  return (
    <Modal
      open
      onClose={toggleAppSettingsDialog}
      title={modalTitle}
      contentContainerClassName={styles.modalContainer}
      modalTitleClassName={styles.modalTitle}
      closeIconClassName={styles.closeIcon}
      contentClassName={styles.modalContent}
      actions={modalActions}
    >
      <ErrorBoundary ErrorView={DevCenterAppErrorView} openIntercom={openIntercom}>
        <ConfirmationDialog
          open={!isAppSettingsValid && !appSettings.package}
          isShowCancel={false}
          title="Validation failed"
          text="You should select the app version to proceed"
          handleOk={() => setIsAppSettingsValid(true)}
        />
        {isSettingsDialogHidden && <DisabledSettingsMessage />}
        {!isSettingsDialogHidden && (
          <>
            <AccordionComponent defaultExpanded className={styles.assetAccordion}>
              <AccordionSummary
                classes={{ content: styles.summaryContent, expandIcon: styles.expandIcon }}
                expandIcon={<ExpandMoreIcon />}
              >
                Asset
              </AccordionSummary>
              <AccordionDetails
                classes={{
                  root: styles.accordionDetails,
                }}
              >
                {mainSettingsContent}
              </AccordionDetails>
            </AccordionComponent>
            <AccordionComponent className={styles.accordion} defaultExpanded>
              <AccordionSummary
                classes={{
                  content: styles.summaryContent,
                  expandIcon: styles.expandIcon,
                }}
                expandIcon={<ExpandMoreIcon />}
              >
                App Settings
              </AccordionSummary>
              <AccordionDetails
                classes={{
                  root: styles.accordionDetails,
                }}
              >
                {appSettingsComponent}
              </AccordionDetails>
            </AccordionComponent>
          </>
        )}
      </ErrorBoundary>
    </Modal>
  );
}

AppSettingsDialog.propTypes = {
  AppSettingsComponent: node,
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
