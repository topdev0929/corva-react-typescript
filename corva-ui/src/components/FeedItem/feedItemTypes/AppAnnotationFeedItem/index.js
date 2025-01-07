import { shape, number, string, oneOfType, func } from 'prop-types';
import { Map, List } from 'immutable';
import moment from 'moment';

import { Typography, makeStyles } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import { EmbeddedApp, DevCenterEmbeddedApp } from '~/components/EmbeddedApp';
import Attachment from '~/components/Attachment';
import { formatMentionText } from '~/components/UserMention/utils';

import { normalizeAssetForApp } from './helpers';

import styles from './styles.css';

const PAGE_NAME = 'FeedActivityPo_appAnnotation';

const useStyles = makeStyles(theme => ({
  attachmentLable: {
    fontSize: '12px',
    color: theme.palette.primary.text6,
  },
}));

const AppAnnotationFeedItem = props => {
  const {
    feedItem: {
      id,
      well,
      rig,
      app,
      package: appPackage,
      company_id: companyId,
      context: {
        app_annotation: {
          body,
          app_category: appCategory,
          app_key: appKey,
          created_at: createdAt,
          settings = {},
          attachment,
          data_timestamp: dataTimestamp,
        },
      },
      mentioned_users: mentionedUsers,
    },
    appContext,

    appRegistry,
    subscribeAppForAsset,
    unsubscribeAppFromAsset,
    currentUser,
    appData,
    isSubDataLoading,
    getSubErrors,
    isSubDataEmpty,
  } = props;
  const classes = useStyles();

  const isAppFound = !!app;
  const isDevCenterApp = isAppFound && app.platform === 'dev_center';
  const isDevCenterWithoutPackage = isDevCenterApp && !appPackage;

  if (!isAppFound || isDevCenterWithoutPackage)
    return <Typography variant="body2">App not found</Typography>;

  const asset = normalizeAssetForApp(well || rig, companyId);
  const timestamp = moment(dataTimestamp || createdAt).unix();

  const requiredFields = [asset, appCategory, appKey, createdAt];

  if (!requiredFields.every(Boolean) || !asset.id)
    return <Typography variant="body2">No Data</Typography>;

  return (
    <div className={styles.appAnnotationFeedItem}>
      <Typography variant="body2" data-testid={`${PAGE_NAME}_message`}>
        {formatMentionText(body, mentionedUsers, isNativeDetected)}
      </Typography>
      <br />
      {appPackage && appPackage.url ? (
        <DevCenterEmbeddedApp
          appContainerClassName={styles.appAnnotationFeedItemApp}
          appId={id}
          assetId={asset.id}
          asset={asset}
          app={{
            app: { ...app, settings },
            package: appPackage,
          }}
          coordinates={{}}
          timestamp={timestamp}
          time={dataTimestamp}
          currentUser={currentUser}
        />
      ) : (
        <EmbeddedApp
          appContainerClassName={styles.appAnnotationFeedItemApp}
          appId={id}
          assetId={asset.id}
          asset={Map(asset)}
          appComponentKey={appKey}
          appComponentCategory={appCategory}
          requiresSubscription
          appContext={Map(appContext)}
          assetDashboards={List()}
          timestamp={timestamp}
          time={dataTimestamp}
          onSettingChange={() => undefined}
          settings={settings}
          internalSelectors={{
            isSubDataLoading,
            getSubErrors,
            isSubDataEmpty,
          }}
          appRegistry={appRegistry}
          appData={appData}
          subscribeAppForAsset={subscribeAppForAsset}
          unsubscribeAppFromAsset={unsubscribeAppFromAsset}
        />
      )}
      {attachment && attachment.signed_url && (
        <div className={styles.appAnnotationFeedItemAttachment}>
          <Typography variant="subtitle1" className={classes.attachmentLable}>
            Attachments
          </Typography>
          <Attachment
            small
            attachmentUrl={attachment.signed_url}
            fileName={attachment.file_name}
            displayName={attachment.file_name}
          />
        </div>
      )}
    </div>
  );
};

AppAnnotationFeedItem.propTypes = {
  feedItem: shape({
    id: oneOfType([number, string]).isRequired,
    well: (props, propName, componentName) => {
      if (!props.well && !props.rig) {
        return new Error(`One of props 'well' or 'rig' was not specified in '${componentName}'.`);
      }
      if (props.well && typeof props.well !== 'object')
        return new Error(`Prop '${propName}' should be an object`);
      return null;
    },
    rig: (props, propName, componentName) => {
      if (!props.well && !props.rig) {
        return new Error(`One of props 'well' or 'rig' was not specified in '${componentName}'.`);
      }
      if (props.rig && typeof props.rig !== 'object')
        return new Error(`Prop '${propName}' should be an object`);
      return null;
    },
    context: shape({
      app_annotation: shape({
        body: string,
        app_category: string.isRequired,
        app_name: string.isRequired,
        created_at: string.isRequired,
        settings: shape(),
      }).isRequired,
    }).isRequired,
  }).isRequired,
  appContext: shape().isRequired,
  currentUser: shape().isRequired,
  appData: shape().isRequired,
  appRegistry: shape().isRequired,
  subscribeAppForAsset: func.isRequired,
  unsubscribeAppFromAsset: func.isRequired,
  isSubDataLoading: func.isRequired,
  getSubErrors: func.isRequired,
  isSubDataEmpty: func.isRequired,
};

export default AppAnnotationFeedItem;
