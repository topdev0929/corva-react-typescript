import PropTypes from 'prop-types';
import { Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const muiStyles = {
  rootParent: {
    overflow: 'hidden',
  },
  root: {
    fontSize: '10px',
    lineHeight: '12px',
  },
  select: {
    padding: '0 40px 0 0',
  },
};

function StyledSelect({ classes, ...props }) {
  return <Select classes={classes} className={classes.rootParent} {...props} />;
}

StyledSelect.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(muiStyles, { withTheme: true })(StyledSelect);
