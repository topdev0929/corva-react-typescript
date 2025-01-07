import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography, Box, makeStyles } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import { Regular14 } from '~/components/Typography';

import Attachment from '~/components/Attachment';
import { formatMentionText } from '~/components/UserMention/utils';
import CollapsibleContent from '~/components/CollapsibleContent';

import { FEED_ITEM_TYPES } from '~/constants/feed';

const TIME_FORMAT = 'MM.DD.YYYY, HH:mm';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 8,
  },
  label: {
    color: theme.palette.text.secondary,
  },
}));

const DepthCommentFeedItem = ({ feedItem }) => {
  const classes = useStyles();
  const {
    context: {
      [FEED_ITEM_TYPES.DEPTH_COMMENTS]: { body, commentDepth, timestamp },
      attachment,
    },
    mentioned_users: mentionedUsers,
  } = feedItem;

  return (
    <Box whiteSpace="pre-wrap">
      {body && (
        <CollapsibleContent>
          <Typography variant="body1" gutterBottom>
            {formatMentionText(body, mentionedUsers, isNativeDetected)}
          </Typography>
        </CollapsibleContent>
      )}

      {attachment && attachment.url && (
        <Attachment fileName={attachment.name} attachmentSize={attachment.size} size="medium" />
      )}

      <Box mt={2} mb={2}>
        <Regular14 className={classes.container}>
          <span className={classes.label}>Depth: </span>
          {Math.floor(commentDepth)} ft
        </Regular14>

        <Regular14 className={classes.container}>
          <span className={classes.label}>Time: </span>
          {moment(timestamp).format(TIME_FORMAT)}
        </Regular14>
      </Box>
    </Box>
  );
};

DepthCommentFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      [FEED_ITEM_TYPES.DEPTH_COMMENTS]: PropTypes.shape({
        body: PropTypes.string.isRequired,
        attachment: PropTypes.shape({
          url: PropTypes.string,
          size: PropTypes.number,
        }),
        commentDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      }).isRequired,
    }).isRequired,
    mentioned_users: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default DepthCommentFeedItem;
