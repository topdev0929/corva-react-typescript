import PropTypes from 'prop-types';

import { useFeedCreationProvider } from '../FeedCreationProvider';
import NewFeedModal from './NewFeedModal';

const NewFeedModalContainer = ({ userCompanyId }) => {
  const { isFeedCreationMode, newFeedFields, createNewFeed, exitFeedCreationMode } =
    useFeedCreationProvider();

  const { timestamp } = newFeedFields || {};

  return (
    <NewFeedModal
      isOpened={Boolean(isFeedCreationMode && newFeedFields)}
      onClose={exitFeedCreationMode}
      timestamp={timestamp}
      userCompanyId={userCompanyId}
      onSend={createNewFeed}
    />
  );
};

NewFeedModalContainer.propTypes = {
  userCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default NewFeedModalContainer;
