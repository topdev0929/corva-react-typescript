import { useState } from 'react';
import classNames from 'classnames';
import { shape, string, arrayOf, func, node, oneOf, number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { flowRight } from 'lodash';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import moment from 'moment';

import { Paper, Typography, Divider, MenuItem, IconButton, Menu } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Avatar from '~components/Avatar';
import UserCardPopover from '~components/UserCardPopover';
import ConfirmationDialog from '~components/ConfirmationDialog';
import CommentsInfo from '~components/CommentsInfo';
import { formatMentionText } from '~components/UserMention/utils';
import Attachment from '~components/Attachment';
import { isNativeDetected as isNative } from '~/utils/mobileDetect';

import { deleteAnnotation, patchAnnotation } from '~/clients/jsonApi';

import AnnotationComments from '../AnnotationComments';

import { useAnnotationsDispatch } from '../../../../AnnotationsContext';
import { DELETE_ANNOTATION, EDIT_ANNOTATION } from '../../../../constants';
import AnnotationInput from '../AnnotationInput';

import styles from './style.css';

const PAGE_NAME = 'AppAnnotationItemPo';

const CREATED_AT_FORMAT = 'MM/DD/YY H:mm';

const muiStyles = theme => ({
  container: { backgroundColor: '#3b3b3be6', marginBottom: 16, marginLeft: 26 },
  headerDividerRoot: { margin: '10px 0' },
  createdAt: { color: theme.palette.grey[700], marginLeft: 5 },
  link: { cursor: 'pointer' },
  iconButtonRoot: {
    height: 24,
    width: 24,
    padding: 0,
    margin: '0 -10px 0 5px',
  },
});

const UserAvatar = ({ user, currentUser, classes }) => (
  <div className={styles.cAnnotationUserAvatar}>
    {isNative ? (
      <Avatar
        // eslint-disable-next-line camelcase
        displayName={`${user.first_name} ${user.last_name}`}
        imgSrc={user.profile_photo}
        size={38}
        className={classes.avatar}
      />
    ) : (
      <UserCardPopover user={user} currentUser={currentUser}>
        <Avatar
          displayName={`${user.first_name} ${user.last_name}`}
          imgSrc={user.profile_photo}
          size={38}
          className={classes.avatar}
        />
      </UserCardPopover>
    )}
  </div>
);

const MenuButton = ({
  actionsMenuAnchorEl,
  handleToggleActionsMenu,
  classes,
  handleEdit,
  handleDelete,
}) => (
  <>
    <IconButton
      data-testid={`${PAGE_NAME}_menuButton`}
      aria-label="Actions"
      aria-owns={actionsMenuAnchorEl ? styles.cAnnotationContainerActionsMenu : undefined}
      aria-haspopup="true"
      className={classes.iconButtonRoot}
      onClick={handleToggleActionsMenu}
    >
      <MoreVertIcon htmlColor={grey[400]} />
    </IconButton>

    <Menu
      id="cAnnotationContainerActionsMenu"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={actionsMenuAnchorEl}
      open={!!actionsMenuAnchorEl}
      onClick={handleToggleActionsMenu}
    >
      <MenuItem data-testid={`${PAGE_NAME}_editMenuItem`} onClick={handleEdit}>
        Edit
      </MenuItem>
      <MenuItem data-testid={`${PAGE_NAME}_deleteMenuItem`} onClick={handleDelete}>
        Delete
      </MenuItem>
    </Menu>
  </>
);

const Annotation = ({
  included,
  annotation,
  assetCompanyId,
  classes,
  showSuccessNotification,
  width,
}) => {
  const [commentInputIsOpen, setCommentInputIsOpen] = useState(false);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isSmallScreen = !isWidthUp('sm', width);

  const initialCommentsCount = annotation.attributes.comments_count || 0;
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  const dispatch = useAnnotationsDispatch();

  const activeUsersList = annotation.relationships.comment_users.data.reduce((users, { id }) => {
    const userData = included.find(user => user.id === id);
    if (userData) {
      users.push(userData.attributes);
    }
    return users;
  }, []);

  const userWhoCommented = activeUsersList.map(
    // eslint-disable-next-line camelcase
    ({ last_name, first_name }) => `${first_name} ${last_name}`
  );

  const handleToggleActionsMenu = event => {
    const currentT = event.currentTarget;
    setActionsMenuAnchorEl(actionsMenuAnchorEl ? null : currentT);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteAnnotation(annotation.id);
      if (response) dispatch({ type: DELETE_ANNOTATION, id: annotation.id });
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (body, period, attachment) => {
    try {
      const changedAnnotation = {
        body,
        active_until: period,
        attachment: {
          file_name: attachment && attachment.attachmentName,
          signed_url: attachment && attachment.attachmentUrl,
        },
      };
      const updatedAnnotation = await patchAnnotation(annotation.id, changedAnnotation);
      dispatch({ type: EDIT_ANNOTATION, annotation: updatedAnnotation, id: annotation.id });
    } catch (e) {
      console.error(e);
      return;
    }

    showSuccessNotification('Annotation has been changed');
    setIsEdit(false);
  };

  const userId = annotation.relationships.user.data.id;
  const currentUser = included.find(({ type, id }) => type === 'user' && id === userId);
  const userData = currentUser.attributes;
  const { attachment } = annotation.attributes;

  return (
    <Paper className={classes.container} elevation={0}>
      <div
        data-testid={`${PAGE_NAME}_annotation_${annotation.attributes.body}`}
        className={styles.cAnnotationContainer}
      >
        <UserAvatar
          user={userData}
          classes={classes}
          isNative={isNative}
          currentUser={currentUser}
        />

        <div className={styles.cAnnotationContainerTop}>
          <div className={styles.cAnnotationContainerTopMainInfo}>
            <Typography variant="body2" data-testid={`${PAGE_NAME}_userName`}>
              {`${userData.first_name} ${userData.last_name}`}
            </Typography>
            <Typography
              data-testid={`${PAGE_NAME}_addDate`}
              variant="caption"
              className={classes.createdAt}
            >
              {moment(annotation.attributes.created_at).format(CREATED_AT_FORMAT)}
            </Typography>
          </div>
          <div
            className={classNames(styles.cAnnotationContainerTopMenu, {
              [styles.cAnnotationContainerTopMenuSmall]: isSmallScreen,
            })}
          >
            <MenuButton
              actionsMenuAnchorEl={actionsMenuAnchorEl}
              handleToggleActionsMenu={handleToggleActionsMenu}
              handleEdit={() => setIsEdit(true)}
              handleDelete={() => setDeleteDialogOpen(true)}
              classes={classes}
            />
          </div>
        </div>

        <Divider className={classes.headerDividerRoot} />

        <div data-testid={`${PAGE_NAME}_message`} className={styles.cAnnotationContainerContent}>
          {isEdit ? (
            <AnnotationInput
              initialText={annotation.attributes.body}
              assetCompanyId={assetCompanyId}
              initialPeriod={annotation.attributes.created_at}
              initialAttachment={attachment}
              onSend={handleEdit}
              onClose={() => setIsEdit(false)}
              closeOnEsc
            />
          ) : (
            <>
              {formatMentionText(
                annotation.attributes.body,
                annotation.relationships.mentioned_users.data,
                isNative,
                null,
                currentUser
              )}
              {attachment && attachment.signed_url && (
                <Attachment
                  attachmentUrl={attachment.signed_url}
                  fileName={attachment.file_name}
                  size="small"
                />
              )}
            </>
          )}
        </div>
      </div>
      <div
        data-testid={`${PAGE_NAME}_comments_${annotation.attributes.body}`}
        className={styles.cAnnotationComments}
      >
        <div className={styles.cAnnotationCommentsInfo}>
          <Typography
            data-testid={`${PAGE_NAME}_commentButton`}
            variant="caption"
            color="primary"
            className={classes.link}
            onClick={() => setCommentInputIsOpen(true)}
          >
            Comment
          </Typography>
          <CommentsInfo
            commentsCount={commentsCount}
            usersWhoCommented={userWhoCommented}
            activeUsersList={activeUsersList}
            currentUser={currentUser}
            small
          />
        </div>
        <AnnotationComments
          annotationId={annotation.id}
          commentInputIsOpen={commentInputIsOpen}
          setCommentInputIsOpen={setCommentInputIsOpen}
          commentsCount={commentsCount}
          initialCommentsCount={initialCommentsCount}
          assetCompanyId={assetCompanyId}
          setCommentsCount={setCommentsCount}
          currentUser={currentUser}
        />
      </div>
      {deleteDialogOpen && (
        <ConfirmationDialog
          open={deleteDialogOpen}
          text="Do you really want to delete annotation?"
          handleClose={() => setDeleteDialogOpen(false)}
          handleOk={handleDelete}
          okText="Delete"
        />
      )}
    </Paper>
  );
};

UserAvatar.propTypes = {
  user: shape({
    id: number.isRequired,
    first_name: string.isRequired,
    last_name: string.isRequired,
    profile_photo: string.isRequired,
  }).isRequired,
  currentUser: shape({}).isRequired,
  classes: shape({}).isRequired,
};

MenuButton.propTypes = {
  actionsMenuAnchorEl: oneOf([node, null]).isRequired,
  handleToggleActionsMenu: func.isRequired,
  classes: shape({}).isRequired,
  handleDelete: func.isRequired,
  handleEdit: func.isRequired,
};

Annotation.propTypes = {
  included: arrayOf(shape({})).isRequired,
  annotation: shape({
    relationships: shape({
      user: shape({ data: shape({ id: string.isRequired }).isRequired }).isRequired,
      mentioned_users: shape({ data: arrayOf(shape({})).isRequired }).isRequired,
    }).isRequired,
    attributes: shape({ body: string.isRequired, created_at: string.isRequired }),
  }).isRequired,
  classes: shape({}).isRequired,
  showSuccessNotification: func,
  width: string.isRequired,
  assetCompanyId: number.isRequired,
};

Annotation.defaultProps = {
  showSuccessNotification: () => undefined,
};

export default flowRight([withStyles(muiStyles), withWidth()])(Annotation);
