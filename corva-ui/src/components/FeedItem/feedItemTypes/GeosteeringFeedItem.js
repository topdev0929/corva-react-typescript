import PropTypes from 'prop-types';

import { Typography, makeStyles, Box } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import Attachment from '~/components/Attachment';
import { formatMentionText } from '~/components/UserMention/utils';
import CollapsibleContent from '~/components/CollapsibleContent';

const PAGE_NAME = 'GeosteeringFeedItem';

const useStyles = makeStyles({
  wrapper: {
    whiteSpace: 'pre-wrap',
  },
});

const GeosteeringFeedItem = ({
  feedItem: {
    context: {
      geosteering_comments: {
        body,
        attachment = {},
        data: {
          targetStructure,
          recommendedWindow,
          isRecommendation,
          axis,
        },
      }
    },
    mentioned_users: mentionedUsers,
  },
}) => {
  const classes = useStyles();
  const attachmentProps = { attachmentSize: attachment?.size, size: 'medium' };

  // TODO: Update to signed_url when GeosteeringFeedItem is migrate on API
  if (attachment?.file_name) attachmentProps.fileName = attachment?.file_name;
  else attachmentProps.attachmentUrl = attachment?.url;

  return (
    <div className={classes.wrapper}>
      {isRecommendation && (
        <>
          <Box marginBottom={1}>
            <Typography color='textSecondary'>Target Structure</Typography>
            <Typography>
              {targetStructure || 'N/A'}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography color='textSecondary'>Recommended Window</Typography>
            <Typography>
              {recommendedWindow || 'N/A'}
            </Typography>
          </Box>
        </>
      )}

      <Box marginBottom={2}>
        <Typography color='textSecondary'>Comment</Typography>
        {body && (
          <CollapsibleContent>
            <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
              {formatMentionText(body, mentionedUsers, isNativeDetected)}
            </Typography>
          </CollapsibleContent>
        )}
        {(attachment?.file_name || attachment?.url) && <Attachment {...attachmentProps} />}
      </Box>
      
      <Box display='flex'>
        <Typography color='textSecondary'>Hole Depth:&nbsp;</Typography>
        <Typography>
          {axis?.holeDepth ? `${Math.floor(axis?.holeDepth)}"` : 'N/A'}
        </Typography>
      </Box>
      <Box display='flex'>
        <Typography color='textSecondary'>Comment MD:&nbsp;</Typography>
        <Typography>{axis?.MD ? `${Math.floor(axis?.MD)}"` : 'N/A'}</Typography>
      </Box>
    </div>
  );
};

GeosteeringFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      geosteering_comments: PropTypes.shape({
        body: PropTypes.string.isRequired,
        attachment: PropTypes.shape({
          url: PropTypes.string,
          size: PropTypes.number,
        }),
        data: PropTypes.shape({
          targetStructure: PropTypes.string,
          recommendedWindow: PropTypes.string,
          isRecommendation: PropTypes.bool,
          axis: PropTypes.shape({
            holeDepth: PropTypes.number,
            MD: PropTypes.number,
          }),
        }),
      }).isRequired,
    }).isRequired,
    mentioned_users: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default GeosteeringFeedItem;
