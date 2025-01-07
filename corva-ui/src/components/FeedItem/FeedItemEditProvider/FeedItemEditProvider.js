import PropTypes from 'prop-types';
import { createContext, useState, useContext } from 'react';

import { showSuccessNotification } from '~/utils';
import { patchFeedItem } from '~/clients/jsonApi';

import FeedItemEditModal from './FeedItemEditModal';

const FeedItemEditContext = createContext();

const FeedItemEditProvider = ({ children, tracesMinDateSec, tracesMaxDateSec, tracesAssetId, exitFunc }) => {
  const [editedFeedItem, setEditedFeedItem] = useState(null);

  const exitEdit = () => {
    exitFunc();
    setEditedFeedItem(null);
  }

  const handlePatchFeedItem = async newContext => {
    try {
      await patchFeedItem(editedFeedItem.id, { context: newContext });
    } catch (error) {
      console.error(error);
      return;
    }

    exitEdit();
    showSuccessNotification('Successfully updated');
  };

  const onSave = ({ context }) => {
    handlePatchFeedItem(context);
  };

  return (
    <FeedItemEditContext.Provider value={{ editedFeedItem, setEditedFeedItem }}>
      {editedFeedItem && (
        <FeedItemEditModal
          feedItem={editedFeedItem}
          onClose={exitEdit}
          onSave={onSave}
          tracesMinDateSec={tracesMinDateSec}
          tracesMaxDateSec={tracesMaxDateSec}
          tracesAssetId={tracesAssetId}
        />
      )}
      {children}
    </FeedItemEditContext.Provider>
  );
};

FeedItemEditProvider.propTypes = {
  children: PropTypes.node.isRequired,
  tracesMinDateSec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tracesMaxDateSec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tracesAssetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  exitFunc: PropTypes.func,
};

FeedItemEditProvider.defaultProps = {
  tracesMinDateSec: null,
  tracesMaxDateSec: null,
  tracesAssetId: null,
  exitFunc: () => null,
};

function useFeedItemEditProvider() {
  return useContext(FeedItemEditContext);
}

export { FeedItemEditProvider, useFeedItemEditProvider };
