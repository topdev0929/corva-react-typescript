import { shape, number, string, oneOfType } from 'prop-types';

import { makeStyles, Typography } from '@material-ui/core';

import { isNativeDetected } from '@corva/ui/utils/mobileDetect';

import { formatMentionText } from '../../UserMention';

import { normalizeAssetForApp } from './helpers';
import Attachment from '../Attachment/Attachment';

const PAGE_NAME = 'FeedActivityPo_appAnnotation';

const useStyles = makeStyles({
  attachmentLabel: {
    fontSize: '12px',
    color: '#ccc',
  },
  appAnnotationFeedItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  appAnnotationFeedItemAttachment: {
    paddingTop: '10px',
    width: '200px',
  },
});

const AppAnnotationFeedItem = ({
  feedItem: {
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
        attachment,
      },
    },
    mentioned_users: mentionedUsers,
  },
}) => {
  const classes = useStyles();

  const isAppFound = !!app;
  const isDevCenterApp = isAppFound && app.platform === 'dev_center';
  const isDevCenterWithoutPackage = isDevCenterApp && !appPackage;
  if (!isAppFound || isDevCenterWithoutPackage)
    return <Typography variant="body2">App not found</Typography>;

  const asset = normalizeAssetForApp(well || rig, companyId);

  const requiredFields = [asset, appCategory, appKey, createdAt];

  if (!requiredFields.every(Boolean) || !asset.id)
    return <Typography variant="body2">No Data</Typography>;

  return (
    <div className={classes.appAnnotationFeedItem}>
      <Typography variant="body2" data-testid={`${PAGE_NAME}_message`}>
        {formatMentionText(body, mentionedUsers, isNativeDetected)}
      </Typography>

      {attachment && attachment.signed_url && (
        <div className={classes.appAnnotationFeedItemAttachment}>
          <Typography variant="subtitle1" className={classes.attachmentLabel}>
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
};

export default AppAnnotationFeedItem;
