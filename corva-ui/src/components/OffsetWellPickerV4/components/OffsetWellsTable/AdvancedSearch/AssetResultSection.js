import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { get, isEmpty, startCase, sum } from 'lodash';
import {
  makeStyles,
  List,
  ListSubheader,
  Chip,
  ListItem,
  Checkbox,
  Typography,
} from '@material-ui/core';
import { SEARCH_CATEGORIES } from './constants';
import { StatusOptions, ROWS_PER_PAGE } from '../../../constants';

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
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  allMenuItem: {
    boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.25)',
  },
  statusWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '102px',
  },
  status: {
    width: '8px',
    height: '8px',
    marginRight: '8px',
    borderRadius: '50%',
    cursor: 'default',
  },
}));

const isLastPage = (data, page) => {
  return !data.find(([_, value]) => value.length === ROWS_PER_PAGE * page);
};

const AssetResultSection = ({
  subjectWellId,
  page,
  assetType,
  loading,
  groupedAssets,
  onClickAsset,
  onClickAllAsset,
  onScrollReached,
}) => {
  const classes = useStyles();
  const listRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState('top');
  const [assetsLen, setAssetsLen] = useState(0);
  const assetsNum = sum(groupedAssets?.map(([_, assets]) => assets?.length || 0));

  const [indeterminate, isAllWellsSelected] = useMemo(() => {
    if (groupedAssets.length === 1) {
      const assets = groupedAssets[0][1];
      const selectedCount = assets.filter(asset => asset.checked).length;
      const indeterminate = selectedCount > 0 && assets.length !== selectedCount;
      const isAllWellsSelected = selectedCount === assets.length;
      return [indeterminate, isAllWellsSelected];
    }
    return [false, false];
  }, [groupedAssets]);

  useEffect(() => {
    if (loading) {
      setAssetsLen(assetsNum);
      return;
    }
    if (scrollPosition === 'top') {
      listRef.current.scrollTo(0, 5);
    }
    if (scrollPosition === 'bottom') {
      listRef.current.scrollTo(0, listRef.current.scrollHeight - listRef.current.offsetHeight - 5);
    }
    if (scrollPosition === 'auto') {
      listRef.current.scrollTo(
        0,
        ((listRef.current.scrollHeight - listRef.current.offsetHeight) * assetsLen) / assetsNum
      );
    }
  }, [loading]);

  const handleScrollList = e => {
    if (e.target.scrollHeight === e.target.offsetHeight) return;
    const currentScrollBottom = e.target.scrollTop + e.target.offsetHeight;

    // NOTE: if scroll is near 1px from the bottom, then load new data.
    if (
      Math.abs(e.target.scrollHeight - currentScrollBottom) < 1 &&
      !isLastPage(groupedAssets, page)
    ) {
      setScrollPosition('auto');
      onScrollReached('bottom');
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
              {!assetType && (
                <ListSubheader classes={{ gutters: classes.listGutters }}>
                  <Chip
                    key={assetTypeKey}
                    className={classes.assetTypeSubheaderChip}
                    variant="outlined"
                    label={SEARCH_CATEGORIES[assetTypeKey].labelPlural}
                  />
                </ListSubheader>
              )}
              {assetType && (
                <ListItem
                  button
                  classes={{ gutters: classes.listGutters }}
                  onClick={() => onClickAllAsset(!isAllWellsSelected, assetTypeKey)}
                >
                  <div className={classNames(classes.menuItem, classes.allMenuItem)}>
                    <div>
                      <Checkbox
                        checked={isAllWellsSelected}
                        indeterminate={indeterminate}
                        style={{ marginRight: 8 }}
                      />
                      All
                    </div>
                  </div>
                </ListItem>
              )}
              {asstes.map(asset => (
                <ListItem
                  data-testid={`${PAGE_NAME}_item_${asset.name}MenuItem`}
                  button
                  classes={{ gutters: classes.listGutters }}
                  key={`item-${assetTypeKey}-${
                    get(asset, 'asset_id') ? get(asset, 'asset_id') : get(asset, 'id')
                  }`}
                  disabled={
                    (asset.type === SEARCH_CATEGORIES.well.name &&
                      !asset.visibility.includes('visible')) ||
                    !asset.redirectAssetId ||
                    asset.redirectAssetId === subjectWellId
                  }
                  onClick={() => onClickAsset(asset, assetTypeKey)}
                >
                  <div className={classes.menuItem}>
                    <div>
                      <Checkbox checked={asset.checked} style={{ marginRight: 8 }} />
                      {asset.name}
                    </div>
                    <div className={classes.statusWrapper}>
                      <div
                        className={classes.status}
                        style={{
                          background: StatusOptions.find(item => item.value === asset.status)
                            ?.color,
                        }}
                      />
                      {startCase(asset.status)}
                    </div>
                  </div>
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
  subjectWellId: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  assetType: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  groupedAssets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClickAsset: PropTypes.func.isRequired,
  onClickAllAsset: PropTypes.func.isRequired,
  onScrollReached: PropTypes.func.isRequired,
};

export default AssetResultSection;
