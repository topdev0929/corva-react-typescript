import { makeStyles, Typography } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import { formatMentionText } from '~/components/UserMention/utils';
import Attachment from '~/components/Attachment';
import { convertValue, getUnitDisplay } from '~/utils/convert';
import { FEED_ITEM_TYPES } from '~/constants/feed';

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

const PAGE_NAME = 'NptLessonsCommentFeedItem';

const NptlessonsCommentFeedItem = ({ feedItem }) => {
  const {
    context: {
      [FEED_ITEM_TYPES.TRACES_MEMO]: { body, attachment = {}, bitDepth, holeDepth },
    },
    mentioned_users: mentionedUsers,
  } = feedItem;
  const classes = useStyles();
  const holeDepthConverted = convertValue(+holeDepth, 'length', 'ft');
  const bitDepthConverted = convertValue(+holeDepth, 'length', 'ft');
  return (
    <div className={classes.wrapper}>
      {(holeDepth || holeDepth === 0) && (
        <Typography className={classes.infoField}>
          Hole Depth:{' '}
          <span>
            {`${Math.round(holeDepthConverted).toLocaleString()} ${getUnitDisplay('length')}`}
          </span>
        </Typography>
      )}
      {(bitDepth || holeDepth === 0) && (
        <Typography className={classes.infoField}>
          Bit Depth:{' '}
          <span>
            {`${Math.round(bitDepthConverted).toLocaleString()} ${getUnitDisplay('length')}`}
          </span>
        </Typography>
      )}
      {body && (
        <>
          <Typography className={classes.infoField}>Description:</Typography>
          <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
            {formatMentionText(body, mentionedUsers, isNativeDetected)}
          </Typography>
        </>
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

export default NptlessonsCommentFeedItem;
