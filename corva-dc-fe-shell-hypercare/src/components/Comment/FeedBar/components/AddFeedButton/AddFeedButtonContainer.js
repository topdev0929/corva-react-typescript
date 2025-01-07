import { useEffect } from 'react';
import PropTypes from 'prop-types';

import utils from '@corva/ui/utils/main';

import { useFeedCreationProvider } from '../FeedCreationProvider';
import AddFeedButton from './AddFeedButton';

const AddFeedButtonContainer = ({ currentUser }) => {
  const { isFeedCreationMode, newFeedFields, setIsFeedCreationMode, exitFeedCreationMode } =
    useFeedCreationProvider();

  const isChoosingFeedPosition = isFeedCreationMode && !newFeedFields;
  useEffect(() => {
    if (isChoosingFeedPosition) {
      const exitFeedModeOnEscape = ({ key }) => {
        if (key === 'Escape') {
          exitFeedCreationMode();
        }
      };

      document.addEventListener('keydown', exitFeedModeOnEscape);

      return () => {
        document.removeEventListener('keydown', exitFeedModeOnEscape);
      };
    }

    return null;
  }, [isChoosingFeedPosition]);

  const userName = utils.getUserFullName(currentUser);

  return (
    <AddFeedButton
      isAddingInProgress={isFeedCreationMode}
      displayName={userName}
      avatarSrc={currentUser.profile_photo}
      onAddFeedClick={() => setIsFeedCreationMode(true)}
      onCancelClick={() => setIsFeedCreationMode(false)}
    />
  );
};

AddFeedButtonContainer.propTypes = {
  currentUser: PropTypes.shape({
    profile_photo: PropTypes.string,
  }).isRequired,
};

export default AddFeedButtonContainer;
