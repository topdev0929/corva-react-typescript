import { makeStyles } from '@material-ui/core';
import moment from 'moment';

import WarningIcon from '@material-ui/icons/Warning';
import { isNativeDetected } from '~/utils/mobileDetect';
import { formatMentionText } from '~/components/UserMention/utils';
import Attachment from '~/components/Attachment';
import { convertValue, getUnitDisplay } from '~/utils/convert';
import { Regular14, Regular12 } from '~/components/Typography';

const useStyles = makeStyles(theme => ({
  text: {
    color: theme.palette.primary.text6,
  },
  value: {
    color: '#fff',
  },
  attachment: {
    paddingTop: 10,
    width: 300,
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  warningIcon: {
    fill: theme.palette.warning.main,
  },
  infoField: {
    color: theme.palette.primary.text6,
    '& span': {
      color: '#fff',
    },
  },
}));

const PAGE_NAME = 'HookloadCommentFeedItem';

const HookloadCommentFeedItem = ({
  feedItem: {
    // The parameter is controlled from the HB component
    point: { showNoVisiblePointWarning } = {},
    context: {
      hookload_broomstick_comment: {
        body,
        attachment = {},
        data: { timestamp, measuredDepth, activityLabel, hookload },
      },
    },
    mentioned_users: mentionedUsers,
  },
}) => {
  const classes = useStyles();
  const depthConverted = convertValue(+measuredDepth, 'length', 'ft');
  const hookloadConverted = convertValue(+hookload, 'force', 'klbf');

  return (
    <div className={classes.wrapper}>
      {body && (
        <Regular14 data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
          {formatMentionText(body, mentionedUsers, isNativeDetected)}
        </Regular14>
      )}

      {Number.isFinite(measuredDepth) && (
        <Regular14 className={classes.infoField} gutterBottom>
          Measured Depth:{' '}
          <span>
            {`${Math.round(depthConverted).toLocaleString()} ${getUnitDisplay('length')}`}
          </span>
        </Regular14>
      )}

      {hookload && (
        <Regular14 className={classes.infoField} gutterBottom>
          Hookload:{' '}
          <span>
            {`${Math.round(hookloadConverted).toLocaleString()} ${getUnitDisplay('force')}`}
          </span>
        </Regular14>
      )}

      {activityLabel && (
        <Regular14 className={classes.infoField} gutterBottom>
          Activity: <span>{activityLabel}</span>
        </Regular14>
      )}

      {timestamp && (
        <Regular14 className={classes.infoField} gutterBottom>
          Time: <span>{moment.unix(timestamp).format('MM/DD/YY HH:mm')}</span>
        </Regular14>
      )}

      {showNoVisiblePointWarning && (
        <div className={classes.warningContainer}>
          <WarningIcon className={classes.warningIcon} />
          <Regular12>
            This activity is disabled in the application settings or not in range
          </Regular12>
        </div>
      )}

      {attachment && (attachment.signed_url || attachment.url || attachment.name) && (
        <div className={classes.attachment}>
          <Attachment
            small
            attachmentUrl={attachment.signed_url || attachment.url}
            fileName={attachment.name}
            displayName={attachment.name}
          />
        </div>
      )}
    </div>
  );
};

export default HookloadCommentFeedItem;
