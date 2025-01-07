import { memo } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  cTpDetailLoader: {
    position: 'absolute',
    left: 0,
    top: 20,
    right: 0,
    bottom: 0,
  },

  cTpDetailLoaderContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
}));

const DetailDataLoader = props => {
  const { grid, isDetailLoading } = props;
  const classes = useStyles();

  const loaderStyle = {
    padding: `${grid.top - 7}px ${grid.right}px ${grid.bottom}px ${grid.left}px`,
  };

  return (
    isDetailLoading && (
      <div className={classes.cTpDetailLoader} style={loaderStyle}>
        <div className={classes.cTpDetailLoaderContent}>
          <LinearProgress />
        </div>
      </div>
    )
  );
};

DetailDataLoader.propTypes = {
  isDetailLoading: PropTypes.bool.isRequired,
  grid: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }).isRequired,
};
export default memo(DetailDataLoader);
