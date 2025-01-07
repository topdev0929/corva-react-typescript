import { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactCursorPosition from 'react-cursor-position';
import moment from 'moment';

import { Regular11, Regular12 } from '@corva/ui/components/Typography';
import { Avatar } from '@corva/ui/components';
import { isNativeDetected } from '@corva/ui/utils/mobileDetect';
import utils from '@corva/ui/utils/main';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import { CursorPositionContext } from '../../../CursorPosition';
import { useFeedCreationProvider } from '../FeedCreationProvider';
import { COMMENT_GROUP_ICON_SIZE } from '../../constants';
import { DEFAULT_DATE_FORMAT } from '@/constants';

import leftMouseIcon from '../icons/left-mouse.svg';
import './FeedsCreationHoverLine.css';

const FeedsCreationHoverLine = ({ chartGrid, timeRange, currentUser }) => {
  const tooltipWrapperElement = useRef(null);
  const providerInfo = useContext(CursorPositionContext);
  const { isFeedCreationMode, setNewFeedFields } = useFeedCreationProvider();
  const userName = utils.getUserFullName(currentUser);

  if (!providerInfo || !isFeedCreationMode) {
    return null;
  }

  const { xPos, containerWidth, isPositionOutside, onPositionChanged } = providerInfo;
  const containerWidthFormatted = containerWidth || tooltipWrapperElement.current?.clientWidth;

  const { startTimestamp, endTimestamp } = timeRange;
  const hoveredTimestamp = Math.round(
    startTimestamp + ((endTimestamp - startTimestamp) / containerWidthFormatted) * xPos
  );
  const hoveredDateTime = moment.unix(hoveredTimestamp).format(DEFAULT_DATE_FORMAT);
  const contentPosition =
    containerWidth > xPos + 250
      ? {
          left: xPos,
        }
      : {
          right: containerWidth - xPos,
        };

  return (
    <ReactCursorPosition
      className="feedCreationTooltip"
      onPositionChanged={onPositionChanged}
      style={{
        left: chartGrid.left,
        right: chartGrid.right,
        top: chartGrid.top,
        bottom: '12px',
        zIndex: 1,
      }}
    >
      {!isPositionOutside && (
        <div
          className="feedCreationTooltipWrapper"
          ref={tooltipWrapperElement}
          onClick={() => setNewFeedFields({ timestamp: hoveredTimestamp })}
        >
          <div className="feedCreationTooltipHoverline" style={{ left: xPos }} />
          <div className="feedCreationTooltipHoverDatetimeContent" style={{ left: xPos, top: -18 }}>
            <Regular11>{hoveredDateTime}</Regular11>
          </div>
          <div className="feedCreationTooltipHoverContent" style={{ ...contentPosition, top: 0 }}>
            <Regular12 className="feedsCreationHoverContentTipText">
              <img
                className="feedsCreationHoverContentIcon"
                alt="left click icon"
                src={leftMouseIcon}
              />
              {isNativeDetected ? 'Tap  to create a Comment' : 'Click to create a Comment'}
            </Regular12>
            <Regular12 className="feedsCreationHoverContentTipText">
              <CloseRoundedIcon className="feedsCreationHoverContentIcon" />
              {!isNativeDetected && 'or "Escape"'} to exit Memo mode
            </Regular12>
          </div>
          <div
            className="feedCreationTooltipHoverContent"
            style={{ ...contentPosition, bottom: 60 }}
          >
            <Regular12 className="feedsCreationHoverAddText">Add a Comment</Regular12>
          </div>
          <div className="feedCreationTooltipAvatarContainer" style={{ left: xPos, bottom: 8 }}>
            <Avatar
              className="feedCreationTooltipAvatar"
              displayName={userName}
              imgSrc={currentUser.profile_photo}
              size={COMMENT_GROUP_ICON_SIZE}
            />
          </div>
        </div>
      )}
    </ReactCursorPosition>
  );
};

FeedsCreationHoverLine.propTypes = {
  currentUser: PropTypes.shape({
    profile_photo: PropTypes.string,
  }).isRequired,
  chartGrid: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }).isRequired,
  timeRange: PropTypes.shape({
    startTimestamp: PropTypes.number,
    endTimestamp: PropTypes.number,
  }).isRequired,
};

export default FeedsCreationHoverLine;
