import { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withTheme, makeStyles } from '@material-ui/core';

import useFeedItems from './effects/useFeedItems';
import useSizer from './effects/useSizer';

import FeedsDataSection from './components/FeedsDataSection';
import AddFeedButton from './components/AddFeedButton';
import NewFeedModal from './components/NewFeedModal';
import { useFeedCreationProvider } from './components/FeedCreationProvider';

const useStyles = makeStyles(() => ({
  feedBar: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    '&.offsetRight': {
      paddingRight: 44,
    },
  },

  feedBarDataSection: {
    backgroundColor: '#272727',
    flex: 1,
    height: '100%',
    boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.08)',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '2px',
  },

  feedBarDataSectionLightTheme: {
    backgroundColor: '#cccccc',
  },

  feedBarControlSection: {
    padding: '4px 8px',
    width: 48,
    borderLeft: 'solid 1px #333333',
    backgroundColor: '#272727',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px',
  },

  feedBarControlSectionLightTheme: {
    backgroundColor: '#cccccc',
  },
}));

const FeedBar = props => {
  const containerRef = useRef();
  const width = useSizer(containerRef.current);
  const { feedLoadTimestamp } = useFeedCreationProvider();
  const { assetId, app, assets, timeRange, chartGrid, currentUser, theme } = props;
  const styles = useStyles();

  // const assetId = currentAsset?.asset_id;
  const { feedItems, isFeedItemsLoading } = useFeedItems({
    assetId,
    app,
    assets,
    timeRange,
    userId: currentUser.id,
    userCompanyId: currentUser.company_id,
    feedLoadTimestamp,
  });

  return (
    <>
      <div
        className={classNames(styles.feedBar, chartGrid.hideAxis && 'offsetRight')}
        data-testid="FeedBar"
      >
        <div
          ref={containerRef}
          className={classNames(styles.feedBarDataSection, {
            [styles.feedBarDataSectionLightTheme]: theme.isLightTheme,
          })}
          style={{ marginLeft: chartGrid.left }}
        >
          <FeedsDataSection
            isDataLoading={isFeedItemsLoading}
            feedItems={feedItems}
            timeRange={timeRange}
            currentUser={currentUser}
            width={width}
          />
        </div>
        <div
          className={classNames(styles.feedBarControlSection, {
            [styles.feedBarControlSectionLightTheme]: theme.isLightTheme,
          })}
          style={{ marginRight: chartGrid.right - 48 }}
        >
          <AddFeedButton currentUser={currentUser} />
        </div>
      </div>
      <NewFeedModal userCompanyId={currentUser.company_id} />
    </>
  );
};

FeedBar.propTypes = {
  theme: PropTypes.shape({
    isLightTheme: PropTypes.bool,
  }).isRequired,
  assetId: PropTypes.number.isRequired,
  app: PropTypes.shape({}).isRequired,
  assets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  timeRange: PropTypes.shape({
    startTimestamp: PropTypes.number,
    endTimestamp: PropTypes.number,
  }).isRequired,
  chartGrid: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
    hideAxis: PropTypes.bool,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    company_id: PropTypes.number,
  }).isRequired,
};

FeedBar.defaultProps = {};

export default withTheme(FeedBar);
