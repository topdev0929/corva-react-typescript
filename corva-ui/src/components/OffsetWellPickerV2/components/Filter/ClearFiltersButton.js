import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '56px',
    marginBottom: '12px',
    cursor: 'pointer',
    '&:hover $clearText': {
      color: theme.palette.primary.text1,
  },
    '&:hover $clearIcon': {
      color: theme.palette.primary.text1,
    },
  },
  clearText: {
    color: theme.palette.primary.text6,
  },
  clearIcon: {
    color: theme.palette.primary.text6,
    marginLeft: '16px',
    marginRight: '5px',
  },
}));

function ClearFiltersButton({ onClick, 'data-testid': dataTestId }) {
  const classes = useStyles();
  return (
    <div data-testid={dataTestId} className={classes.wrapper} onClick={onClick}>
      <ClearIcon className={classes.clearIcon} />
      <Typography className={classes.clearText}>Clear</Typography>
    </div>
  );
}

ClearFiltersButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

ClearFiltersButton.defaultProps = {
  'data-testid': 'ClearFiltersButton',
};

export default ClearFiltersButton;
