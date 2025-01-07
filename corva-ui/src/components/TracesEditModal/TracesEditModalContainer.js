import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { minBy, isEqual } from 'lodash';
import { FEED_ITEM_TYPES } from '~/constants/feed';
import { getAppStorage } from '~/clients/jsonApi';

import TracesEditModal from './TracesEditModal';

const validateTimestamp = (timestamp, minTime, maxTime) => {
  if (Number.isNaN(timestamp)) {
    return "Can't parse date or time format";
  }
  if (timestamp < minTime || timestamp > maxTime) {
    return 'Should be in range of available traces data';
  }
  return '';
};
const RECORDS_AROUND_DELTA_SEC = 5;

const TracesEditModalContainer = ({
  feedItem,
  onSave,
  onClose,
  minDateSec,
  maxDateSec,
  assetId,
}) => {
  const feedItemContext = feedItem.context[FEED_ITEM_TYPES.TRACES_MEMO];
  const { attachment } = feedItemContext;
  const initialTimestamp = feedItemContext.timestamp;
  const initialBody = feedItemContext.body;
  const initialPostInputValue = {
    body: initialBody,
    attachment,
  };

  const [editedPostInputValue, setEditedPostInputValue] = useState(initialPostInputValue);
  const [editedTimestamp, setEditedTimestamp] = useState(initialTimestamp);
  const [editedHoleDepth, setEditedHoleDepth] = useState(feedItemContext.holeDepth);
  const [editedBitDepth, setEditedBitDepth] = useState(feedItemContext.bitDepth);
  const [isDepthDataLoading, setIsDepthDataLoading] = useState(false);

  const timestampError = validateTimestamp(editedTimestamp, minDateSec, maxDateSec);

  const isApplyDisabled =
    Number.isNaN(editedTimestamp) ||
    (!editedPostInputValue.body && !editedPostInputValue.attachment) ||
    (initialTimestamp === editedTimestamp && isEqual(initialPostInputValue, editedPostInputValue));

  const loadDepthDetailsForTimestamp = async timestampSec => {
    const startTimestamp = timestampSec - RECORDS_AROUND_DELTA_SEC;
    const endTimestamp = timestampSec + RECORDS_AROUND_DELTA_SEC;

    const query = `{timestamp#gte#${startTimestamp}}AND{timestamp#lte#${endTimestamp}}`;

    setIsDepthDataLoading(true);

    try {
      const records = await getAppStorage('corva', 'wits', assetId, {
        limit: 10,
        query,
      });
      const closestRecord =
        records && minBy(records, record => Math.abs(record.timestamp - timestampSec));

      setEditedHoleDepth(closestRecord.data.hole_depth);
      setEditedBitDepth(closestRecord.data.bit_depth);
    } catch (error) {
      console.error(error);
    }
    setIsDepthDataLoading(false);
  };

  const onTimestampChange = newDate => {
    setEditedTimestamp(newDate.unix());
  };

  const onApplyChanges = () =>
    onSave({
      context: {
        [FEED_ITEM_TYPES.TRACES_MEMO]: {
          body: editedPostInputValue.body,
          attachment: editedPostInputValue.attachment,
          timestamp: editedTimestamp,
          holeDepth: editedHoleDepth,
          bitDepth: editedBitDepth,
        },
      },
    });

  useEffect(() => {
    if (!editedTimestamp || timestampError || initialTimestamp === editedTimestamp) return;

    loadDepthDetailsForTimestamp(editedTimestamp);
  }, [timestampError, editedTimestamp, initialTimestamp]);

  return (
    <TracesEditModal
      postValue={editedPostInputValue}
      onPostChange={setEditedPostInputValue}
      timestampMs={editedTimestamp * 1000}
      timestampError={timestampError}
      minDateMs={minDateSec * 1000}
      maxDateMs={maxDateSec * 1000}
      isDepthDataLoading={isDepthDataLoading}
      isApplyDisabled={isApplyDisabled}
      holeDepth={editedHoleDepth}
      bitDepth={editedBitDepth}
      userCompanyId={feedItem.company_id}
      onTimestampChange={onTimestampChange}
      onApply={onApplyChanges}
      onClose={onClose}
    />
  );
};

TracesEditModalContainer.propTypes = {
  feedItem: PropTypes.shape().isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  minDateSec: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  maxDateSec: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  assetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default TracesEditModalContainer;
