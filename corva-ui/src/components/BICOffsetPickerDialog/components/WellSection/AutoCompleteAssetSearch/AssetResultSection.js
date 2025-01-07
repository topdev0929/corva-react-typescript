import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  makeStyles,
  List,
  ListSubheader,
  Chip,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { SEARCH_CATEGORIES } from './constants';

const PAGE_NAME = 'AssetResultSection';
const useStyles = makeStyles(theme => ({
  assetListWrapper: {
    margin: '8px 0',
    flex: 1,
  },
  assetListContainer: {
    maxHeight: '350px',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  listGutters: {
    padding: '2px 8px',
  },
  assetTypeSubheaderChip: {
    height: '24px',
    color: theme.palette.primary.text6,
  },
  assetItemTextRoot: {
    minWidth: '300px',
  },
  assetItemTextPrimary: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  loadingInfo: {
    textAlign: 'center',
    fontSize: '12px',
    lineHeight: '17px',
    color: theme.palette.primary.text8,
  },
  empty: {
    color: theme.palette.primary.text6,
    fontSize: '12px',
    fontStyle: 'italic',
    marginLeft: '8px',
  },
}));

const isLastPage = data => {
  return !data.find(([_, value]) => value.length === 40);
};

const AssetResultSection = ({ page, loading, groupedAssets, onClickAsset, onScrollReached }) => {
  const classes = useStyles();
  const listRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState('top');

  useEffect(() => {
    if (loading) return;
    if (scrollPosition === 'top') {
      listRef.current.scrollTo(0, 5);
    }
    if (scrollPosition === 'bottom') {
      listRef.current.scrollTo(0, listRef.current.scrollHeight - listRef.current.offsetHeight - 5);
    }
  }, [loading]);

  const handleScrollList = e => {
    if (e.target.scrollHeight === e.target.offsetHeight) return;
    const currentScrollBottom = e.target.scrollTop + e.target.offsetHeight;

    // NOTE: if scroll is near 1px from the bottom, then load new data.
    if (Math.abs(e.target.scrollHeight - currentScrollBottom) < 1 && !isLastPage(groupedAssets)) {
      setScrollPosition('top');
      onScrollReached('bottom');
    }
    if (Math.round(e.target.scrollTop) === 0 && page > 1) {
      setScrollPosition('bottom');
      onScrollReached('top');
    }
  };
  return (
    <div className={classes.assetListWrapper}>
      <List
        className={classes.assetListContainer}
        subheader={<li />}
        onScroll={handleScrollList}
        ref={listRef}
      >
        {groupedAssets.map(([assetTypeKey, asstes]) => (
          <li key={`section-${assetTypeKey}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader classes={{ gutters: classes.listGutters }}>
                <Chip
                  key={assetTypeKey}
                  className={classes.assetTypeSubheaderChip}
                  variant="outlined"
                  label={SEARCH_CATEGORIES[assetTypeKey].labelPlural}
                />
              </ListSubheader>
              {asstes.map(asset => (
                <ListItem
                  data-testid={`${PAGE_NAME}_item_${asset.name}MenuItem`}
                  button
                  classes={{ gutters: classes.listGutters }}
                  disabled={!asset.redirectAssetId}
                  key={`item-${assetTypeKey}-${
                    get(asset, 'asset_id') ? get(asset, 'asset_id') : get(asset, 'id')
                  }`}
                  onClick={() => onClickAsset(asset)}
                >
                  <ListItemText
                    primary={asset.name}
                    classes={{
                      root: classes.assetItemTextRoot,
                      primary: classes.assetItemTextPrimary,
                    }}
                  />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
        {isEmpty(groupedAssets) && (
          <div className={classes.empty}>Your search did not match any Asset Name</div>
        )}
      </List>
      {loading && (
        <Typography data-testid={`${PAGE_NAME}_loading`} className={classes.loadingInfo}>
          Loading...
        </Typography>
      )}
    </div>
  );
};

AssetResultSection.propTypes = {
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  groupedAssets: PropTypes.arrayOf(PropTypes.array).isRequired,
  onClickAsset: PropTypes.func.isRequired,
  onScrollReached: PropTypes.func.isRequired,
};

export default AssetResultSection;
