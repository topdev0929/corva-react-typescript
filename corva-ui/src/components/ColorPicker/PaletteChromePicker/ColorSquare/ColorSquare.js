import PropTypes from 'prop-types';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import chroma from 'chroma-js';

import Checkboard from '~/assets/checkboard.svg';

const PAGE_NAME = 'ColorSquare';

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
  transparentContainer: {
    position: 'relative',
    border: '1px solid #C4C4C4;',
    backgroundImage: `url(${Checkboard})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    '&::before': {
      content: '""',
      position: 'absolute',
      display: 'block',
      width: '100%',
      height: '2px',
      background: '#FF0000',
      transform: 'rotate(135deg)',
      borderRadius: '2px',
    },
  },
  squareCheck: {
    width: '16px',
    height: '16px',
    color: 'white',
    visibility: 'hidden',
    zIndex: 2,
  },
});

function ColorSquare({ color, isSelected, onClick }) {
  const classes = useStyles();

  return (
    <div
      data-testid={`${PAGE_NAME}_color_${color}_selected_${isSelected}`}
      className={classNames(classes.container, {
        [classes.transparentContainer]: chroma(color).alpha() === 0,
        [classes.containerSelected]: isSelected,
      })}
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
