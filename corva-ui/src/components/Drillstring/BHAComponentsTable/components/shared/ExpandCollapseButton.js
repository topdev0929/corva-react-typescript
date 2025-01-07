import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';

export function ExpandCollapseButton({ isExpanded, classes, handleExpandCollapse }) {
  return (
    <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
      <IconButton className={classes.actionButton} onClick={handleExpandCollapse}>
        {!isExpanded ? (
          <ExpandMoreIcon className={classes.actionIcon} />
        ) : (
          <ExpandLessIcon className={classes.actionIcon} />
        )}
      </IconButton>
    </Tooltip>
  );
}

ExpandCollapseButton.propTypes = {
  isExpanded: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  handleExpandCollapse: PropTypes.func.isRequired,
};

ExpandCollapseButton.defaultProps = {
  isExpanded: false,
};
