import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '150px',
    marginTop: '8px',
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
    fontSize: '14px',
  },
  clearIcon: {
    color: theme.palette.primary.text6,
    marginRight: '5px',
  },
}));

function ClearFiltersButton({ onClick }) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper} onClick={onClick}>
      <ClearIcon className={classes.clearIcon} />
      <Typography className={classes.clearText}>Clear</Typography>
    </div>
  );
}

ClearFiltersButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ClearFiltersButton;
