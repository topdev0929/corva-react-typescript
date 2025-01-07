import PropTypes from 'prop-types';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    borderRadius: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      border: '1px solid white',
    },
  },
  containerSelected: {
    border: '1px solid white',
    '& $squareCheck': {
      visibility: 'visible',
    },
  },
  squareCheck: {
    width: '16px',
    height: '16px',
    color: 'white',
    visibility: 'hidden',
  },
});

function ColorSquare({ color, isSelected, onClick }) {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.container, { [classes.containerSelected]: isSelected })}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <CheckRoundedIcon fontSize="small" className={classes.squareCheck} />
    </div>
  );
}

ColorSquare.propTypes = {
  color: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ColorSquare;
