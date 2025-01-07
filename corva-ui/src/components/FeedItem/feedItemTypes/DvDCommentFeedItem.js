import { makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';

import { convertValue, getUnitDisplay } from '~/utils';
import { isNativeDetected } from '~/utils/mobileDetect';
import { formatMentionText } from '~/components/UserMention/utils';
import Attachment from '~/components/Attachment';

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

const PAGE_NAME = 'DvDCommentFeedItem';

function formatNumberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const DvDCommentFeedItem = ({
  feedItem: {
    context: {
      dvd_comment: {
        body,
        attachment = {},
        data: { timestamp, bitDepth, holeDepth, cost },
      },
    },
    mentioned_users: mentionedUsers,
  },
}) => {
  const classes = useStyles();

  const convertedBitDepth = convertValue(+bitDepth, 'length', 'ft');
  const convertedHoleDepth = convertValue(+holeDepth, 'length', 'ft');

  const depthUnit = getUnitDisplay('length');

  return (
    <div className={classes.wrapper}>
      {body && (
        <Typography data-testid={`${PAGE_NAME}_message`} variant="body1" gutterBottom>
          {formatMentionText(body, mentionedUsers, isNativeDetected)}
        </Typography>
      )}
      {timestamp && (
        <Typography className={classes.infoField}>
          Time:{' '}
          <span data-testid={`${PAGE_NAME}_time`}>
            {moment.unix(timestamp).format('MM.DD.YYYY, HH:mm')}
          </span>
        </Typography>
      )}

      {Number.isFinite(convertedHoleDepth) && (
        <Typography className={classes.infoField}>
          Hole Depth:
          <span data-testid={`${PAGE_NAME}_holeDepth`}>
            {`${convertedHoleDepth} ${depthUnit}`}
          </span>
        </Typography>
      )}

      {Number.isFinite(convertedBitDepth) && (
        <Typography className={classes.infoField}>
          Bit Depth:
          <span data-testid={`${PAGE_NAME}_bitDepth`}>
            {`${convertedBitDepth} ${depthUnit}`}
          </span>
        </Typography>
      )}

      {cost && Number.isFinite(cost) && (
        <Typography className={classes.infoField}>
          Cost: <span data-testid={`${PAGE_NAME}_cost`}>{formatNumberWithSpaces(cost)} $</span>
        </Typography>
      )}
      {attachment && attachment.url && (
        <div className={classes.attachment}>
          <Attachment
            small
            attachmentUrl={attachment.url}
            fileName={attachment.name}
            displayName={attachment.name}
          />
        </div>
      )}
    </div>
  );
};

export default DvDCommentFeedItem;
