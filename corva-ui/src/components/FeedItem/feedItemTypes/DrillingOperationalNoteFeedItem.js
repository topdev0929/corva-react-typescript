import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const PAGE_NAME = 'operationalNoteActivity';

const OperationalNoteFeedItem = ({
  feedItem: {
    context: {
      operational_note: {
        data: { note },
      },
    },
  },
}) => (
  <Typography data-testid={`${PAGE_NAME}_note`} variant="body1">
    {note}
  </Typography>
);

OperationalNoteFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      operational_note: PropTypes.shape({
        data: PropTypes.shape({
          note: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default OperationalNoteFeedItem;
