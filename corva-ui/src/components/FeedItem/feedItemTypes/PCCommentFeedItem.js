import { makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';

import { isNativeDetected } from '~/utils/mobileDetect';
import { formatMentionText } from '~/components/UserMention/utils';
import Attachment from '~/components/Attachment';
import { convertValue, getUnitDisplay } from '~/utils/convert';

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
  infoField: {
    color: theme.palette.primary.text6,
    '& span': {
      color: '#fff',
    },
  },
}));

const PAGE_NAME = 'PCCommentFeedItem';

const PCCommentFeedItem = ({ feedItem }) => {
  const feedItemType = feedItem.type;
  const {
    context: {
      [feedItemType]: {
        body,
        attachment = {},
        data: { timestamp, holeDepth },
      },
    },
    mentioned_users: mentionedUsers,
  } = feedItem;

  const classes = useStyles();
  const depthConverted = convertValue(+holeDepth, 'length', 'ft');
  return (
    <div className={classes.wrapper}>
      {body && (
        <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
          {formatMentionText(body, mentionedUsers, isNativeDetected)}
        </Typography>
      )}
      {timestamp && (
        <Typography className={classes.infoField}>
          Time: <span>{moment.unix(timestamp).format('MM.DD.YYYY, HH:mm')}</span>
        </Typography>
      )}

      {(holeDepth || holeDepth === 0) && (
        <Typography className={classes.infoField}>
          Hole Depth:{' '}
          <span>{`${Math.round(depthConverted).toLocaleString()} ${getUnitDisplay(
            'length'
          )}`}
          </span>
        </Typography>
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

export default PCCommentFeedItem;
