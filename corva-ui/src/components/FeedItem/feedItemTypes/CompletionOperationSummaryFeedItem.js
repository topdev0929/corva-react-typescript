import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const PAGE_NAME = 'operationSummaryActivity';

const OperationSummaryFeedItem = ({
  feedItem: {
    context: {
      completion_operation_summary: {
        data: { summary },
      },
    },
  },
}) => (
  <Typography data-testid={`${PAGE_NAME}_summary`} variant="body1">
    {summary}
  </Typography>
);

OperationSummaryFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      completion_operation_summary: PropTypes.shape({
        data: PropTypes.shape({
          summary: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default OperationSummaryFeedItem;
