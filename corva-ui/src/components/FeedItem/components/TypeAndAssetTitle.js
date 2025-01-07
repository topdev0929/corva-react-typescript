/* eslint-disable react/prop-types */
import { Typography, makeStyles } from '@material-ui/core';

import { FEED_ITEM_TYPES, FEED_ITEM_TYPES_BY_KEY } from '~/constants/feed';

const PAGE_NAME = 'FeedPo';

const USER_NAME_TITLE_ITEMS = [
  FEED_ITEM_TYPES_BY_KEY.post.type,
  FEED_ITEM_TYPES_BY_KEY.app_annotation.type,
  FEED_ITEM_TYPES_BY_KEY.geosteering_comments.type,
  FEED_ITEM_TYPES.TRACES_MEMO,
  FEED_ITEM_TYPES.DEPTH_COMMENTS,
];

const useStyles = makeStyles(theme => ({
  assetRoot: {
    color: theme.palette.grey[400],
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginRight: 4,
    fontWeight: 700,
    letterSpacing: 0.25,
  },
  postTitle: {
    color: '#fff',
  },
}));

const TypeAndAssetTitle = ({ feedItem, userFullName, typeLabel }) => {
  const classes = useStyles();

  const typeOrName = USER_NAME_TITLE_ITEMS.includes(feedItem.type) ? userFullName : typeLabel;

  return (
    <Typography variant="body2" className={classes.assetRoot}>
      <span data-testid={`${PAGE_NAME}_postTitle`} className={classes.postTitle}>
        {typeOrName}
      </span>
    </Typography>
  );
};

export default TypeAndAssetTitle;
