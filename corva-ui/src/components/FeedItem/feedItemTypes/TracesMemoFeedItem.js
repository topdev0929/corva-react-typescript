// NOTE: Need to add Collapsible content
import PropTypes from 'prop-types';
import moment from 'moment';
import {Typography, Box, makeStyles} from '@material-ui/core';

import {isNativeDetected} from '~/utils/mobileDetect';
import {Regular14} from '~/components/Typography';

import Attachment from '~/components/Attachment';
import {formatMentionText} from '~/components/UserMention/utils';
import CollapsibleContent from '~/components/CollapsibleContent';

import {FEED_ITEM_TYPES} from '~/constants/feed';

const PAGE_NAME = 'TracesMemoFeedItem';

const TIME_FORMAT = 'MM.DD.YYYY, HH:mm';

const useStyles = makeStyles({
  label: {color: '#bbbbbb'},
  container: {marginRight: 16},
});

const TracesMemoFeedItem = ({
                              feedItem: {
                                context: {
                                  [FEED_ITEM_TYPES.TRACES_MEMO]: {
                                    body,
                                    attachment = {},
                                    bitDepth,
                                    holeDepth,
                                    timestamp
                                  },
                                },
                                mentioned_users: mentionedUsers,
                              },
                            }) => {
  const classes = useStyles();
  return (
    <Box whiteSpace="pre-wrap">
      {body && (
        <CollapsibleContent>
          <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
            {formatMentionText(body, mentionedUsers, isNativeDetected)}
          </Typography>
        </CollapsibleContent>
      )}

      {attachment && (attachment.signed_url || attachment.url) && (
        <Attachment
          attachmentUrl={attachment.signed_url || attachment.url}
          attachmentSize={attachment.size}
          size="medium"
        />
      )}
      <Box display="flex" mt={2}>
        <Regular14 data-testid={`${PAGE_NAME}_Time`} className={classes.container}>
          <span className={classes.label}>Time: </span>
          {moment(timestamp * 1000).format(TIME_FORMAT)}
        </Regular14>
        <Regular14 data-testid={`${PAGE_NAME}_HoleDepth`} className={classes.container}>
          <span className={classes.label}>Hole Depth: </span>
          {holeDepth}’
        </Regular14>
        <Regular14 data-testid={`${PAGE_NAME}_Bit Depth`} className={classes.container}>
          <span className={classes.label}>Bit Depth: </span>
          {bitDepth}’
        </Regular14>
      </Box>
    </Box>
  );
};

TracesMemoFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      [FEED_ITEM_TYPES.TRACES_MEMO]: PropTypes.shape({
        body: PropTypes.string.isRequired,
        attachment: PropTypes.shape({
          url: PropTypes.string,
          size: PropTypes.number,
        }),
        bitDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        holeDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      }).isRequired,
    }).isRequired,
    mentioned_users: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default TracesMemoFeedItem;
