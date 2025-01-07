import { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import FeedCreationProvider from './FeedBar/components/FeedCreationProvider';
import { CursorPositionProvider } from './CursorPosition';
import FeedBarContext from './FeedContext';
import FeedBar from './FeedBar';
import FeedsCreationHoverLine from './FeedBar/components/FeedsCreationHoverLine';

const useStyles = makeStyles({
  feedContainer: {
    width: '100%',
    height: '40px',
    position: 'relative',
    marginTop: '16px',
  },
});

function Comment({ assetId, app, currentUser, offsetWells, timeRange, chart }) {
  const classes = useStyles();

  if (!timeRange) {
    return null;
  }

  return (
    <FeedCreationProvider assetId={assetId} app={app}>
      <CursorPositionProvider>
        <div className={classes.feedContainer}>
          <FeedBarContext.Provider
            value={{
              appKey: app?.app?.app_key,
              package: app?.package,
              appId: app?.id,
            }}
          >
            <FeedBar
              assetId={assetId}
              app={app}
              currentUser={currentUser}
              assets={offsetWells}
              timeRange={{ startTimestamp: timeRange.start, endTimestamp: timeRange.end }}
              chartGrid={{
                left: chart?.plotLeft,
                right: chart?.chartWidth - chart?.plotLeft - chart?.plotWidth,
                hideAxis:
                  chart?.chartWidth - chart?.plotLeft - chart?.plotWidth === chart?.spacing?.[1],
              }}
            />
          </FeedBarContext.Provider>
        </div>

        <FeedsCreationHoverLine
          chartGrid={{
            left: chart?.plotLeft,
            right: chart?.chartWidth - chart?.plotLeft - chart?.plotWidth,
            top: 8,
            bottom: 22,
          }}
          timeRange={{ startTimestamp: timeRange.start, endTimestamp: timeRange.end }}
          currentUser={currentUser}
        />
      </CursorPositionProvider>
    </FeedCreationProvider>
  );
}

Comment.propTypes = {
  assetId: PropTypes.number.isRequired,
  app: PropTypes.shape({
    app: PropTypes.shape({ app_key: PropTypes.string }),
    package: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  timeRange: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }).isRequired,
  chart: PropTypes.shape({
    plotLeft: PropTypes.number,
    plotWidth: PropTypes.number,
    chartWidth: PropTypes.number,
    spacing: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default memo(Comment);
