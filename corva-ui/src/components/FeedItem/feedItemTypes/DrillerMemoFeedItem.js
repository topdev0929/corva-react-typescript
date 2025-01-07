import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const DrillerMemoFeedItem = ({
  feedItem: {
    context: {
      driller_memo: {
        data: { message_text: message },
      },
    },
  },
}) => <Typography variant="body1">{message}</Typography>;

DrillerMemoFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      driller_memo: PropTypes.shape({
        data: PropTypes.shape({
          message_text: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default DrillerMemoFeedItem;
