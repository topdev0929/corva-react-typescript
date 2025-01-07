import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';

import { IconButton, Tooltip, withStyles } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import { Avatar } from '@corva/ui/components';

import addCommentIcon from '../icons/add-comment.svg';
import addCommentHoveredIcon from '../icons/add-comment-hover.svg';
import { COMMENT_CREATE_ICON_SIZE } from '../../constants';

import './AddFeedButton.css';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
  },
}))(Tooltip);

const AddFeedButton = ({
  isAddingInProgress,
  displayName,
  avatarSrc,
  onAddFeedClick,
  onCancelClick,
}) => {
  if (isAddingInProgress) {
    return (
      <StyledTooltip className="feedbarAddFeedButton" title="Cancel">
        <IconButton
          color="primary"
          aria-label="exit add feed mode"
          className="feedbarAddFeedButtonCloseButton"
          onClick={onCancelClick}
          size="small"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </StyledTooltip>
    );
  }

  return (
    <StyledTooltip className="feedbarAddFeedButton" title="Add a Comment">
      <div className="feedbarAddFeedButtonAvatarContainer" onClick={onAddFeedClick}>
        <Avatar
          className="feedbarAddFeedButtonAvatar"
          displayName={displayName}
          imgSrc={avatarSrc}
          size={COMMENT_CREATE_ICON_SIZE}
        />
        <div className="feedbarAddFeedButtonAddIconContainer">
          <img alt="add comment icon" src={addCommentIcon} />
        </div>
        <div
          className={classnames(
            'feedbarAddFeedButtonAddIconContainer',
            'feedbarAddFeedButtonAddIconContainerHovered'
          )}
        >
          <img alt="add comment icon" src={addCommentHoveredIcon} />
        </div>
      </div>
    </StyledTooltip>
  );
};

AddFeedButton.propTypes = {
  isAddingInProgress: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  avatarSrc: PropTypes.string,
  onAddFeedClick: PropTypes.func,
  onCancelClick: PropTypes.func,
};

AddFeedButton.defaultProps = {
  displayName: null,
  avatarSrc: null,
  onAddFeedClick: noop,
  onCancelClick: noop,
};

export default AddFeedButton;
