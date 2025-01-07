import PropTypes from 'prop-types';

import { Typography, makeStyles } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import Attachment from '~/components/Attachment';
import { formatMentionText } from '~/components/UserMention/utils';
import CollapsibleContent from '~/components/CollapsibleContent';

const PAGE_NAME = 'PostFeedItem';

const useStyles = makeStyles({
  wrapper: { whiteSpace: 'pre-wrap' },
});

const PostFeedItem = ({
  feedItem: {
    context: {
      post: { body, attachment = {} },
    },
    mentioned_users: mentionedUsers,
  },
}) => {
  const classes = useStyles();
  const hasAttachment = attachment.signed_url || attachment.url || attachment.file_name;

  return (
    <div className={classes.wrapper}>
      {body && (
        <CollapsibleContent>
          <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
            {formatMentionText(body, mentionedUsers, isNativeDetected)}
          </Typography>
        </CollapsibleContent>
      )}

      {hasAttachment && (
        <Attachment
          attachmentUrl={attachment.signed_url || attachment.url}
          fileName={attachment.file_name}
          attachmentSize={attachment.size}
          size="medium"
        />
      )}
    </div>
  );
};

PostFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      post: PropTypes.shape({
        body: PropTypes.string.isRequired,
        attachment: PropTypes.shape({
          url: PropTypes.string,
          size: PropTypes.number,
        }),
      }).isRequired,
    }).isRequired,
    mentioned_users: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default PostFeedItem;
