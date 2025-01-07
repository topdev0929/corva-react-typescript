import { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core';

import FeedGroup from '../FeedGroup';

const useStyles = makeStyles(() => ({
  dataSectionFeedsContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '8px 0',
    overflow: 'hidden',
  },
  dataSectionFeedsLoading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    lineHeight: '17px',
    color: '#808080',
  },
}));

function FeedsDataSection({ currentUser, commentGroups, isDataLoading }) {
  const [tooltipOpened, setTooltipOpened] = useState(null);
  const classes = useStyles();

  return (
    <div className={classes.dataSectionFeedsContainer}>
      {!isDataLoading &&
        commentGroups.map(group => {
          const id = get(group, [0, 'id']);
          const position = get(group, [0, 'position']);
          const isTooltipOpened = id === tooltipOpened;

          return (
            <FeedGroup
              key={id}
              comments={group}
              position={position}
              isTooltipOpened={isTooltipOpened}
              onTooltipOpened={setTooltipOpened}
              currentUser={currentUser}
            />
          );
        })}
      {isDataLoading && <div className={classes.dataSectionFeedsLoading}>Loading...</div>}
    </div>
  );
}

FeedsDataSection.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  isDataLoading: PropTypes.bool.isRequired,
  commentGroups: PropTypes.arrayOf(PropTypes.arrayOf()).isRequired,
};

export default FeedsDataSection;
