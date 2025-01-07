import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Paper, Divider, Typography, makeStyles } from '@material-ui/core';
import { noop, includes } from 'lodash';

import grey from '@material-ui/core/colors/grey';

import { isNativeDetected } from '~/utils/mobileDetect';

import ConfirmationDialog from '~/components/ConfirmationDialog';
import LoadingIndicator from '~/components/LoadingIndicator';
import ErrorBoundary from '~/components/ErrorBoundary';
import { useIsInsideDcApp } from '~/components/DevCenter/DevCenterAppContainer/components';

import { FEED_ITEM_TYPES_BY_KEY, FEED_ITEM_TYPES } from '~/constants/feed';
import { deleteFeedItem, toggleFeedItemLike } from '~/clients/jsonApi';
import { showSuccessNotification } from '~/utils';
import utils from '~/utils/main';

import Actions from './components/Actions';
import FeedComments from './components/FeedComments';
import Content from './components/Content';
import CreatedAt from './components/CreatedAt';
import Icon from './components/Icon';
import Reactions from './components/Reactions';
import RigAndWell from './components/RigAndWell';
import TypeAndAssetTitle from './components/TypeAndAssetTitle';

import styles from './FeedItem.css';

const PAGE_NAME = 'FeedPo';

const useStyles = makeStyles(theme => ({
  paperRoot: {
    position: 'relative',
    marginBottom: 10,
    paddingBottom: 16,
    backgroundColor: ({ isInsideDcApp }) =>
      isInsideDcApp ? 'rgba(65, 65, 65, 0.9)' : theme.palette.background.b8,
    width: ({ isInsideDcApp }) => (isInsideDcApp ? 360 : '100%'),
    boxShadow: ({ isInsideDcApp }) =>
      isInsideDcApp &&
      '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)',
  },
  clickablePaperRoot: {
    '&:hover': {
      filter: 'brightness(90%)',
      transition: 'filter 0.3s',
    },
  },
  headerDividerRoot: {
    margin: '8px 0 8px 0',
    backgroundColor: '#595959',
  },
}));

function FeedItem({
  feedItem,
  editableFeedItemTypes,
  removeFeedItem,
  enterEditMode,
  router,
  currentUser,
  appData,
  customFeedItemTypeTemplates,
  paperClassName,
  getFeedItemMessage,
  ...props
}) {
  const canDeleteFeedItem = includes(feedItem.allowed_actions, 'destroy');

  const isInsideDcApp = useIsInsideDcApp();
  const classes = useStyles({ isInsideDcApp });
  const [isLoading, setIsLoading] = useState(false);
  const [openCommentInput, setOpenCommentInput] = useState(true);
  const [openCommentList, setOpenCommentList] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isPost = feedItem.type === FEED_ITEM_TYPES_BY_KEY.post.type;
  const isEditableItem = editableFeedItemTypes.includes(feedItem.type);

  const isGeosteering = feedItem.type === FEED_ITEM_TYPES_BY_KEY.geosteering_comments.type;
  const isRecommended =
    isGeosteering && feedItem.context?.geosteering_comments?.data?.isRecommendation;

  const typeCategory = FEED_ITEM_TYPES_BY_KEY[feedItem.type].category || 'post';

  const userFullName = utils.getUserFullName(feedItem.user);
  const typeLabel = FEED_ITEM_TYPES_BY_KEY[feedItem.type].showCreatorToLabel
    ? userFullName
    : FEED_ITEM_TYPES_BY_KEY[feedItem.type].label;

  const feedItemSourceLink =
    feedItem.type === FEED_ITEM_TYPES_BY_KEY.alert.type && `/alerts/${feedItem.context?.alert?.id}`;

  const isFeedItemClickable =
    feedItem.type === FEED_ITEM_TYPES_BY_KEY.alert.type && feedItemSourceLink;

  const handleDeleteFeedItem = async () => {
    setIsLoading(true);

    try {
      await deleteFeedItem(feedItem.id);
    } catch (e) {
      return;
    } finally {
      setIsLoading(false);
    }

    showSuccessNotification('Item was deleted');

    removeFeedItem(feedItem.id);
  };

  const handleToggleLike = async () => {
    const feedItemId = feedItem.id;

    try {
      await toggleFeedItemLike(feedItemId); // NOTE: Received through subscription
    } catch (e) {
      // NOTE: Do nothing
    }
  };

  const handleEditMenuItem = () => {
    enterEditMode(feedItem);
  };

  const handleDeleteMenuItem = () => {
    setOpenDeleteDialog(true);
  };

  const copyFeedItemLink = () => {
    const feedId = feedItem.id;
    const text = `${window.location.host}/feed/${feedId}`;

    utils.copyToClipboard(text);
  };

  const handleDelete = () => {
    handleDeleteFeedItem();
  };

  const handleMainContainerClick = () => {
    if (isFeedItemClickable) {
      router.push(feedItemSourceLink);
    }
  };

  const getRigName = feedItem => {
    const isRigBasedItem = !!feedItem.rig;
    return isRigBasedItem ? feedItem.rig?.name : feedItem.well?.parent_asset?.name;
  };

  return (
    <Paper
      data-testid={`${PAGE_NAME}_post_${getFeedItemMessage(feedItem)}_rigName_${getRigName(
        feedItem
      )}`}
      className={classNames(classes.paperRoot, paperClassName, {
        [classes.clickablePaperRoot]: isFeedItemClickable,
        [styles.hideOverflow]: isLoading,
      })}
      elevation={0}
    >
      <div
        onClick={handleMainContainerClick}
        className={classNames(styles.mainContainer, {
          [styles.mainContainerClickable]: isFeedItemClickable,
          [styles.mainContainerNative]: isNativeDetected,
        })}
      >
        <Icon
          feedItem={feedItem}
          classes={classes}
          displayName={userFullName}
          isRecommended={isRecommended}
          currentUser={currentUser}
        />

        <div
          className={classNames(styles.mainContainerTop, {
            [styles.mainContainerTopNative]: isNativeDetected,
          })}
        >
          <div className={styles.mainContainerTopLine}>
            <TypeAndAssetTitle
              feedItem={feedItem}
              userFullName={userFullName}
              typeLabel={typeLabel}
              classes={classes}
              isPost={isPost}
            />
            <div className={styles.mainContainerTopMenu}>
              <CreatedAt feedItem={feedItem} classes={classes} />

              <Actions
                data-testid={`${PAGE_NAME}_actionsDropdown`}
                isPost={isPost}
                isEditableItem={isEditableItem}
                canDeleteFeedItem={canDeleteFeedItem}
                handleEditMenuItem={handleEditMenuItem}
                handleDeleteMenuItem={handleDeleteMenuItem}
                copyFeedItemLink={copyFeedItemLink}
                feedItem={feedItem}
                currentUser={currentUser}
              />
            </div>
          </div>

          <RigAndWell feedItem={feedItem} isPost={isPost} />
        </div>

        <Divider className={classes.headerDividerRoot} />

        <ErrorBoundary ErrorView={() => <Typography>Feed Item loading failed</Typography>}>
          <Content
            feedItem={feedItem}
            appData={appData}
            customFeedItemTypeTemplates={customFeedItemTypeTemplates}
            currentUser={currentUser}
            {...props}
          />
        </ErrorBoundary>
      </div>
      <Reactions
        feedItem={feedItem}
        handleToggleLike={handleToggleLike}
        setOpenCommentInput={setOpenCommentInput}
        setOpenCommentList={setOpenCommentList}
        openCommentInput={openCommentInput}
        openCommentList={openCommentList}
        currentUser={currentUser}
      />

      <FeedComments
        openCommentInput={openCommentInput}
        openCommentList={openCommentList}
        feedItem={feedItem}
        currentUser={currentUser}
      />

      {isLoading && ( // NOTE: Avoids feed item height change
        <div className={styles.loadingContainer} style={{ backgroundColor: grey[800] }}>
          <LoadingIndicator />
        </div>
      )}

      {openDeleteDialog && (
        <ConfirmationDialog
          open={openDeleteDialog}
          title={`Delete ${typeCategory}`}
          text={`Are you sure you want to delete ${typeCategory} and all attachments?`}
          handleClose={() => setOpenDeleteDialog(false)}
          handleOk={handleDelete}
          okText="Delete"
        />
      )}
    </Paper>
  );
}

FeedItem.propTypes = {
  feedItem: PropTypes.shape().isRequired,
  enterEditMode: PropTypes.func,
  removeFeedItem: PropTypes.func,
  editableFeedItemTypes: PropTypes.oneOf([FEED_ITEM_TYPES.TRACES_MEMO, FEED_ITEM_TYPES.POST]),

  currentUser: PropTypes.shape().isRequired,

  appData: PropTypes.shape().isRequired,
  paperClassName: PropTypes.string,
  customFeedItemTypeTemplates: PropTypes.shape(),
  getFeedItemMessage: PropTypes.func,
};

FeedItem.defaultProps = {
  enterEditMode: noop, // for FEED mode only
  removeFeedItem: noop,
  paperClassName: undefined,
  editableFeedItemTypes: [FEED_ITEM_TYPES.POST],
  customFeedItemTypeTemplates: {},
  getFeedItemMessage: feedItem =>
    feedItem.context?.post?.body || feedItem.context?.dvd_comment?.body,
};

export default FeedItem;
