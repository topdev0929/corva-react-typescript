/* eslint-disable react/prop-types */
import { memo, useState } from 'react';
import { Menu, MenuItem, makeStyles } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReactPlayer from 'react-player';

import IconButton  from '~/components/IconButton';

import { getIsVideo } from '~/utils/fileExtension';

const PAGE_NAME = 'FeedPo';

const useStyles = makeStyles(theme => ({
  actionsIconButtonRoot: {
    marginLeft: 5,
    color: theme.palette.primary.text7,
  },
}));

const Actions = memo(
  ({
    feedItem,
    copyFeedItemLink,
    currentUser,
    isEditableItem,
    canDeleteFeedItem,
    handleEditMenuItem,
    handleDeleteMenuItem,
    isPost,
  }) => {
    const classes = useStyles();
    const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);

    const isCurrentUserCreator = feedItem.user?.id === currentUser.id;

    const postAttachmentUrl = feedItem.context?.post?.attachment?.url;

    const isVideo = getIsVideo(postAttachmentUrl);

    const isVideoAttachment = isVideo && ReactPlayer.canPlay(postAttachmentUrl);

    const handleToggleActionsMenu = event => {
      event.stopPropagation();
      const currentT = event.currentTarget;
      setActionsMenuAnchorEl(prevValue => (prevValue ? null : currentT));
    };
    const showEdit = isEditableItem && isCurrentUserCreator;

    const showDelete  = canDeleteFeedItem || showEdit;
    const showDownload = isPost && isVideoAttachment;

    if (!showEdit && !showDelete && !showDownload) return null;

    return (
      <>
        <IconButton
          data-testid={`${PAGE_NAME}_menuButton`}
          aria-label="Actions"
          aria-owns={actionsMenuAnchorEl ? 'c-feed-item__actions-menu' : undefined}
          aria-haspopup="true"
          className={classes.actionsIconButtonRoot}
          size="small"
          onClick={handleToggleActionsMenu}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="c-feed-item__actions-menu"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={actionsMenuAnchorEl}
          open={!!actionsMenuAnchorEl}
          onClick={handleToggleActionsMenu}
        >
          {showDownload && (
            <a href={postAttachmentUrl} className="c-feed-item__download-link">
              <MenuItem data-testid={`${PAGE_NAME}_downloadButton`}>Download</MenuItem>
            </a>
          )}

          {showEdit && (
            <MenuItem data-testid={`${PAGE_NAME}_editButton`} onClick={handleEditMenuItem}>
              Edit
            </MenuItem>
          )}

          {showDelete && (
            <MenuItem data-testid={`${PAGE_NAME}_deleteButton`} onClick={handleDeleteMenuItem}>
              Delete
            </MenuItem>
          )}

          <MenuItem data-testid={`${PAGE_NAME}_copyLinkButton`} onClick={copyFeedItemLink}>
            Copy Link
          </MenuItem>
        </Menu>
      </>
    );
  }
);

export default Actions;
