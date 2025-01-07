import { FC, useState } from 'react';
import { Avatar } from '@corva/ui/components';
import { Typography } from '@material-ui/core';
import moment from 'moment';

import { getUserFullName, getUserShortName } from '@/shared/utils';

import { CommentInput } from '../CommentInput';
import { DeleteDialog } from '../DeleteDialog';
import { CommentMenu } from './Menu';
import { useCommentStyles } from './styles';
import styles from './index.module.css';
import { useGlobalStore } from '@/contexts/global';
import { USER_ROLES } from '@/constants';
import { InsightAuthor } from '@/entities/insight';
import { Linkify } from '@/shared/components/Linkify';

type CommentAuthor = {
  firstName: string;
  lastName: string;
  profilePhoto: string;
};
type Props = {
  text: string;
  timestamp: number;
  author: InsightAuthor;
  user: CommentAuthor;
  onDelete: () => Promise<void>;
  onEdit: (text: string) => void;
  testId?: string;
};

export const Comment: FC<Props> = ({ text, timestamp, author, user, onDelete, onEdit, testId }) => {
  const classes = useCommentStyles();
  const globalStore = useGlobalStore();
  const [isEdit, setEditMode] = useState<boolean>(false);
  const [isDelete, setDeleteMode] = useState<boolean>(false);

  const userFullName = getUserFullName(author);
  const shortFullName = getUserShortName(author);

  const onEditRequest = () => setEditMode(true);

  const onEditCancel = () => setEditMode(false);

  const onDeleteRequest = () => setDeleteMode(true);

  const onDeleteCancel = () => setDeleteMode(false);

  if (isEdit) {
    return (
      <CommentInput
        onSend={onEdit}
        user={user}
        testId={testId}
        autoFocus
        defaultValue={text}
        onCancel={onEditCancel}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Avatar displayName={userFullName} imgSrc={author?.profilePhoto} size={24} />
      <div className={styles.content}>
        <div className={styles.metaData}>
          <Typography
            data-testid={`${testId}_userName`}
            variant="subtitle2"
            noWrap
            className={classes.userName}
          >
            {shortFullName}
          </Typography>
          <Typography data-testid={`${testId}_time`} classes={{ root: classes.timeRoot }}>
            {moment(timestamp * 1000).format('MM/DD/YYYY HH:mm')}
          </Typography>
        </div>
        <Typography
          data-testid={`${testId}_text`}
          variant="body1"
          classes={{ root: classes.textRoot }}
        >
          <Linkify>{text}</Linkify>
        </Typography>
      </div>
      {(+author.id === globalStore.currentUser.id ||
        globalStore.currentUser.role === USER_ROLES.corvaadmin) && (
        <div className={styles.menu}>
          <CommentMenu onDelete={onDeleteRequest} onEdit={onEditRequest} testId={testId} />
        </div>
      )}
      {isDelete && (
        <DeleteDialog
          open={isDelete}
          type="comment"
          onCancel={onDeleteCancel}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
