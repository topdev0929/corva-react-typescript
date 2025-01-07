/* eslint-disable react/prop-types */

/* This component exists for puprose to display embedded view
   for internal Corva Apps. This component uses immutable js because
   our old apps are not perfect, they use it for appData, settings, etc. 

   DELETE THIS FILE after movement all the internal apps to DC.
*/

import { memo, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { Map, fromJS } from 'immutable'; // For backward compatibility;

import { Typography, makeStyles, useTheme } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import { Size } from '~/constants/sizes';

import LoadingIndicator from '~/components/LoadingIndicator';
import Tooltip from '~/components/Tooltip';

import { DEFAULT_SUBSCRIPTION_META } from '~/constants/subscriptions';
import { COLLECTIONS } from '~/constants/bha';
import * as convert from '~/utils/convert';

import { AppInfo, AppInfoMaximized } from './components/AppInfo';

import styles from './styles.css';

const useStyles = makeStyles({
  h6: {
    fontSize: '1.15rem',
    margin: '0 0 0 3px',
  },
  subtitle: {
    fontSize: '0.755rem',
    lineHeight: '1',
    margin: '0 0 0 3px',
    color: '#888!important',
  },
});

const EmbeddedApp = props => {
  const {
    assetId,
    appId,
    asset,
    appSize,
    widthCols,
    appHeight,
    appWidth,
    orientation,
    appComponentKey,
    appComponentCategory,
    subscriptions,
    requiresSubscription,
    timestamp,
    appContext,
    appContainerClassName,
    settings,
    time,

    appData,
    appRegistry,
    subscribeAppForAsset,
    unsubscribeAppFromAsset,
    internalSelectors: { isSubDataLoading, getSubErrors, isSubDataEmpty },
    ...otherAppProps
  } = props;

  const theme = useTheme();
  const classes = useStyles();

  const [maximized, setMaximized] = useState(false);

  const appType = appRegistry.uiApps.getIn([appComponentCategory, 'appTypes', appComponentKey]);

  const appSubscriptions = (props.subscriptions.length
    ? props.subscriptions
    : appType.constants.SUBSCRIPTIONS
  ).map(sub => ({
    ...sub,
    meta: {
      ...DEFAULT_SUBSCRIPTION_META,
      ...sub.meta,
      subscribeOnlyForInitialData: true,
      // NOTE: Forces use only last data from actual survey collection according to ticket PLAT-676
      subscribeToLatestOnly: sub.collection === COLLECTIONS.survey.collection,
    },
  }));

  const appTitle = appType.constants.METADATA.title || appType.constants.METADATA.settingsTitle;
  const { customEmptyDataHandling } = appType.constants.METADATA;

  useEffect(() => {
    if (requiresSubscription)
      subscribeAppForAsset(
        appId,
        appSubscriptions,
        assetId,
        Map({ query: `{timestamp#lte#${timestamp}}` })
      );

    return () => {
      unsubscribeAppFromAsset(appId, appSubscriptions);
    };
  }, []);

  let isDataLoading = false;
  let isEmptyData = false;
  let errorData = null;

  const appDataPrepared = appData.get(appId, Map());

  if (appData) {
    isDataLoading = isSubDataLoading(appDataPrepared, appSubscriptions);
    errorData = getSubErrors(appDataPrepared, appSubscriptions);
    isEmptyData = isSubDataEmpty(appDataPrepared, appSubscriptions);
  }

  // Backward compatibility with apps immutable settings
  const appSettings = useMemo(() => {
    return Object.keys(settings).reduce((acc, key) => {
      return { ...acc, [key]: fromJS(settings[key]) };
    }, {});
  }, []);

  const emptyDataCondition = isEmptyData && !customEmptyDataHandling;

  if (!appType) return null;
  if (isDataLoading) return <LoadingIndicator fullscreen={false} />;
  if (errorData)
    return (
      <Typography variant="body2">
        Data error: {errorData.length ? errorData.message : 'No error message'}
      </Typography>
    );
  if (emptyDataCondition) return <Typography variant="body2">Data is empty</Typography>;

  return (
    <div
      className={classNames(styles.embeddedApp, appContainerClassName, {
        [styles.embeddedAppMaximized]: maximized,
        [styles.embeddedAppNative]: isNativeDetected,
      })}
    >
      {!maximized && <AppInfo setMaximized={maximized} />}

      {!appType.constants.METADATA.disableAppTitle && (
        <>
          <div className={styles.embeddedAppTitle}>
            <Typography classes={{ h6: classes.h6 }} variant="h6" noWrap>
              {appTitle}
            </Typography>
          </div>

          <Tooltip title={appType.constants.METADATA.title}>
            <Typography classes={{ subtitle1: classes.subtitle }} variant="subtitle1" noWrap>
              {appType.constants.METADATA.subtitle}
            </Typography>
          </Tooltip>
        </>
      )}
      <div
        className={classNames(styles.embeddedAppContent, {
          [styles.embeddedAppContentWithTitle]: !appType.constants.METADATA.disableAppTitle,
        })}
        key={maximized ? Size.XLARGE : appSize}
      >
        <appType.AppComponent
          asset={asset}
          appId={appId}
          data={appDataPrepared}
          size={maximized ? Size.XLARGE : appSize}
          coordinates={Map({
            h: 0,
            w: 0,
            x: 0,
            y: 0,
            pixelHeight: appHeight,
            pixelWidth: appWidth,
          })}
          widthCols={widthCols}
          maximized={maximized}
          theme={theme}
          orientation={orientation}
          registerMenuItems={noop}
          convert={convert}
          onAppSubscribeForAsset={subscribeAppForAsset}
          onAppUnsubscribeFromAsset={unsubscribeAppFromAsset}
          onSettingsChange={() => undefined}
          isNative={isNativeDetected}
          appContext={appContext}
          layoutType="singleApp"
          appTitle={appTitle}
          time={time}
          {...appSettings}
          {...otherAppProps}
        />
      </div>

      {maximized && <AppInfoMaximized setMaximized={setMaximized} />}
    </div>
  );
};

EmbeddedApp.defaultProps = {
  appContainerClassName: undefined,
  assetId: undefined,
  appId: 0,
  asset: Map(),
  requiresSubscription: true,
  appSize: Size.MEDIUM,
  subscriptions: [],
  widthCols: 1,
  appWidth: 600,
  appHeight: 500,
  orientation: 'vertical',
  settings: {},
  timestamp: null,
  time: null,
};

export default memo(EmbeddedApp);
