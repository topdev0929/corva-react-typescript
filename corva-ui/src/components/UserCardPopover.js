import { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Popover } from '@material-ui/core';

import UserCard from '~components/UserCard';

const muiStyles = {
  popoverPaper: { background: 'transparent' },
  childrenWrapper: { cursor: 'pointer' },
};

function UserCardPopover(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        aria-owns={open ? 'user-popover' : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
        className={props.classes.childrenWrapper}
        style={props.wrapperStyle}
      >
        {props.children}
      </div>
      <Popover
        id="user-popover"
        open={open}
        classes={{ paper: props.classes.popoverPaper }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
      >
        <UserCard user={props.user} currentUser={props.currentUser} />
      </Popover>
    </>
  );
}

UserCardPopover.propTypes = {
  wrapperStyle: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,

  currentUser: PropTypes.shape({}),

  classes: PropTypes.shape({
    popoverPaper: PropTypes.string.isRequired,
    childrenWrapper: PropTypes.string.isRequired,
  }).isRequired,
};

UserCardPopover.defaultProps = {
  wrapperStyle: {},
  currentUser: {},
};

export default withStyles(muiStyles)(UserCardPopover);
