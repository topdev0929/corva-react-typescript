import { memo } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  detailLoader: {
    position: 'absolute',
    left: 0,
    top: 5,
    right: 0,
    bottom: 0,
  },

  detailLoaderContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
}));

const DetailDataLoader = props => {
  const { isDetailLoading, chart } = props;
  const classes = useStyles();

  return (
    isDetailLoading && (
      <div
        className={classes.detailLoader}
        style={{
          left: chart?.plotLeft ?? 120,
          right: chart?.chartWidth - chart?.plotLeft - chart?.plotWidth ?? 0,
        }}
      >
        <div className={classes.detailLoaderContent}>
          <LinearProgress />
        </div>
      </div>
    )
  );
};

DetailDataLoader.propTypes = {
  isDetailLoading: PropTypes.bool.isRequired,
  chart: PropTypes.shape({
    chartWidth: PropTypes.number,
    plotLeft: PropTypes.number,
    plotWidth: PropTypes.number,
  }).isRequired,
};
export default memo(DetailDataLoader);
