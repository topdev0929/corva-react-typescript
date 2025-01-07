import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

export function MoreButton({ classes, handleOpenActionMenu }) {
  return (
    <Tooltip title="More">
      <IconButton
        className={classNames(classes.actionButton, classes.moreButton)}
        aria-haspopup="true"
        onClick={handleOpenActionMenu}
      >
        <MoreVertIcon className={classes.actionIcon} />
      </IconButton>
    </Tooltip>
  );
}

MoreButton.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  handleOpenActionMenu: PropTypes.func.isRequired,
};
