import { useRef, useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Tooltip } from '@material-ui/core';

import { LastAnnotation } from '~/components/Annotations';

import { SEGMENTS } from '~constants/segment';
import { DEV_CENTER_CLI_APP_ID } from '~/constants';
import { getAppName, getAppSegment } from '~/utils/devcenter';
import { VersionBadge } from './VersionBadge';
import PadMode from './PadMode';

import { getAppDimension, APP_LAYOUT_SIZES } from './utils';
import { SecondaryAssetNameLabel } from '../../AssetNameLabel/SecondaryAssetNameLabel';
import { AssetNameLabel } from '../../AssetNameLabel/AssetNameLabel';
import { PadIcon } from './PadIcon';

import styles from './AppHeader.css';
import { useStyles } from './AppHeaderStyles';

export const PAGE_NAME = 'DevCenter_AppHeader';

const getLinkFromWell = well => `/assets/${well?.asset_id}`;

const getAssetLabels = ({ appSettings = {}, well, rig, fracFleet, segment }) => {
  const isDrilling = segment === SEGMENTS.DRILLING;
  const isCompletion = segment === SEGMENTS.COMPLETION;

  const { wellId, rigId, fracFleetId, padId } = appSettings;
  const pad = fracFleet?.pad_frac_fleets.find(
    ({ pad }) => pad.id === (padId || fracFleet.current_pad_id)
  )?.pad;
  const secondaryAssetName = isDrilling ? wellId && well?.name : pad?.name;
  const currentPadLink = `/assets/types/pad/${padId || fracFleet?.current_pad_id}`;

  let primaryAssetName = isDrilling ? rig?.name : fracFleet?.name;
  let isPrimaryNameVisible = !!(wellId || rigId || fracFleetId);
  let isPrimaryAssetStatusVisible = false;

  let primaryAssetLink =
    // we need to use assetId till platform is using old API for assets.
    isDrilling ? primaryAssetName && getLinkFromWell(well) : currentPadLink;

  if (isCompletion && !isPrimaryNameVisible && well?.id && well?.name) {
    isPrimaryAssetStatusVisible = true;
    isPrimaryNameVisible = true;
    primaryAssetLink = getLinkFromWell(well);
    primaryAssetName = well.name;
  }

  const secondaryAssetLink = isDrilling
    ? getLinkFromWell(well)
    : `/assets/types/pad/${padId || fracFleet?.current_pad_id}`;

  return {
    isPrimaryAssetStatusVisible,
    isPrimaryNameVisible,
    primaryAssetLink,
    primaryAssetName,
    secondaryAssetLink,
    secondaryAssetName,
  };
};

function AppHeader({
  app,
  appLastAnnotation,
  appSettings,
  badge,
  children,
  classes,
  coordinates,
  currentUser,
  fracFleet,
  isMaximized,
  logoSrc,
  onSettingChange,
  openAnnotationsList,
  primaryAssetStatusBadge,
  rig,
  showLastAnnotation,
  updateCurrentDashboardAppLastAnnotation,
  well,
  wells,
}) {
  const [isAppNameTooltipShown, setIsAppNameTooltipShown] = useState(false);
  const titleRef = useRef(null);

  const appCoordinatesWidth = coordinates?.pixelWidth;

  useEffect(() => {
    setIsAppNameTooltipShown(titleRef.current?.scrollWidth > titleRef.current?.offsetWidth);
  }, [titleRef.current?.offsetWidth, appCoordinatesWidth]);

  const appDimension = getAppDimension(appCoordinatesWidth);
  const appName = getAppName(app);
  const subtitle = app?.package?.manifest?.application?.subtitle;
  const segment = getAppSegment(app);
  const isCompletion = segment === SEGMENTS.COMPLETION;

  const {
    isPrimaryAssetStatusVisible,
    isPrimaryNameVisible,
    primaryAssetLink,
    primaryAssetName,
    secondaryAssetLink,
    secondaryAssetName,
  } = getAssetLabels({ appSettings: app?.settings, well, rig, fracFleet, segment });
  const isMobileSize = [APP_LAYOUT_SIZES.MEDIUM, APP_LAYOUT_SIZES.SMALL].includes(appDimension);
  const isCLIApp = app && app.id === DEV_CENTER_CLI_APP_ID;
  const padModeProps = {
    fracFleet,
    wells,
    well,
    onSettingChange,
    appSettings,
    disableActiveWellsInPadSelect:
      app?.package?.manifest?.application?.ui?.disableActiveWellsInPadSelect,
  };

  const jsStyles = useStyles({ isMobileSize });

  return (
    <>
      <div className={jsStyles.appHeaderWrapper}>
        <div className={classNames(jsStyles.appHeaderContainer, classes.appHeader)}>
          <div className={jsStyles.titleBlock}>
            <div className={classes.appHeaderTitleWrapper} ref={titleRef}>
              <div className={jsStyles.titleWrapper}>
                {logoSrc && (
                  <>
                    <img className={jsStyles.logo} src={logoSrc} alt="company logo" />
                    <div className={jsStyles.separateLine} />
                  </>
                )}
                <Tooltip title={isAppNameTooltipShown ? appName : ''} placement="bottom">
                  <h6 data-testid={`${PAGE_NAME}_name`} className={jsStyles.title}>
                    {appName}
                  </h6>
                </Tooltip>
                <VersionBadge appPackage={app?.package} />
              </div>
              {badge}
            </div>
            {(!isMobileSize || logoSrc) && subtitle && (
              <h6 data-testid={`${PAGE_NAME}_subtitle`} className={jsStyles.subtitle}>
                {subtitle}
              </h6>
            )}
          </div>

          {app && coordinates && (
            <div
              className={classNames(styles.controlsContainer, isMaximized && styles.appMaximized)}
            >
              {isCompletion && !isMobileSize && <PadMode {...padModeProps} />}
              {children}
              <div className={styles.assetLabels}>
                {secondaryAssetName && (
                  <SecondaryAssetNameLabel
                    assetName={secondaryAssetName}
                    coordinatesPixelWidth={appCoordinatesWidth}
                    dataTestId={`${PAGE_NAME}_secondaryAsset`}
                    href={!isCLIApp && secondaryAssetLink}
                    icon={isCompletion && <PadIcon />}
                    isColored={
                      !isCompletion ||
                      (app.settings.padId && app.settings.padId !== fracFleet.current_pad_id)
                    }
                  />
                )}
                {isPrimaryNameVisible && (
                  <AssetNameLabel
                    assetName={primaryAssetName}
                    coordinatesPixelWidth={appCoordinatesWidth}
                    dataTestId={`${PAGE_NAME}_primaryAsset`}
                    href={!isCLIApp && (primaryAssetLink || '/feed')}
                    statusBadge={isPrimaryAssetStatusVisible && primaryAssetStatusBadge}
                  />
                )}
              </div>
            </div>
          )}

          {showLastAnnotation && appLastAnnotation && (
            <LastAnnotation
              annotation={appLastAnnotation}
              appId={get(app, ['app', 'id'])}
              currentUser={currentUser}
              dashboardAppId={app.id}
              openAnnotationsList={openAnnotationsList}
              updateCurrentDashboardAppLastAnnotation={updateCurrentDashboardAppLastAnnotation}
            />
          )}
        </div>

        {isMobileSize && subtitle && !logoSrc && (
          <h6 data-testid={`${PAGE_NAME}_subtitle`} className={jsStyles.subtitle}>
            {subtitle}
          </h6>
        )}
      </div>

      {isCompletion && isMobileSize && (
        <div className={styles.padModeSelect}>
          <PadMode {...padModeProps} />
        </div>
      )}
    </>
  );
}

AppHeader.propTypes = {
  app: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  badge: PropTypes.node,
  classes: PropTypes.shape({
    appHeader: PropTypes.string,
    appHeaderTitleWrapper: PropTypes.string,
  }),
  showLastAnnotation: PropTypes.bool,
  currentUser: PropTypes.shape({}),
  appLastAnnotation: PropTypes.shape({}),
  updateCurrentDashboardAppLastAnnotation: PropTypes.func,
  openAnnotationsList: PropTypes.func,
  rig: PropTypes.shape({
    name: PropTypes.string,
    asset_id: PropTypes.number,
  }),
  well: PropTypes.shape({
    name: PropTypes.string,
    asset_id: PropTypes.number,
  }),
  fracFleet: PropTypes.shape({
    name: PropTypes.string,
    current_pad_id: PropTypes.number,
    pad_frac_fleets: PropTypes.arrayOf(
      PropTypes.shape({
        pad: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }),
  wells: PropTypes.arrayOf(PropTypes.shape({})),
  coordinates: PropTypes.shape({ pixelWidth: PropTypes.number.isRequired }),
  isMaximized: PropTypes.bool,
  appSettings: PropTypes.shape({}),
  onSettingChange: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.node),
  logoSrc: PropTypes.string,
  primaryAssetStatusBadge: PropTypes.node,
};

AppHeader.defaultProps = {
  appLastAnnotation: null,
  appSettings: null,
  badge: null,
  children: null,
  classes: {},
  coordinates: undefined,
  currentUser: undefined,
  fracFleet: null,
  isMaximized: false,
  logoSrc: null,
  onSettingChange: undefined,
  openAnnotationsList: undefined,
  rig: null,
  showLastAnnotation: true,
  updateCurrentDashboardAppLastAnnotation: () => {},
  well: null,
  wells: null,
  primaryAssetStatusBadge: null,
};

export default AppHeader;
