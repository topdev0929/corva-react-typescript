import { Divider, makeStyles } from '@material-ui/core';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { LoadingIndicator } from '@corva/ui/components';

import { InsightAuthor } from '@/entities/insight';
import { useGlobalStore } from '@/contexts/global';
import { USER_ROLES } from '@/constants';
import { DeleteDialog } from '../DeleteDialog';
import { FeedActions } from './Actions';
import { CreatedAt } from './CreatedAt';
import styles from './index.module.css';

const useStyles = makeStyles({
  divider: {
    backgroundColor: '#595959',
    width: '100%',
  },
});

type Props = {
  title: string | ReactNode;
  author: InsightAuthor;
  type: string;
  createdAt: string;
  avatar?: ReactNode;
  isLoading?: boolean;
  onDelete?: () => Promise<void>;
  onEdit?: () => void;
  testId?: string;
};

export const Feed: FC<PropsWithChildren<Props>> = ({
  title,
  author,
  children,
  createdAt,
  avatar,
  isLoading,
  type,
  onEdit,
  onDelete,
  testId,
}) => {
  const classes = useStyles();
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userHasActions, setUserHasActions] = useState(false);
  const globalStore = useGlobalStore();
  const openDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    setUserHasActions(
      +author.id === globalStore.currentUser.id ||
        globalStore.currentUser.role === USER_ROLES.corvaadmin
    );
  }, [globalStore.currentUser, author]);

  return (
    <div className={styles.container} data-testid={testId}>
      {isLoading ? (
        <div className={styles.loader}>
          <LoadingIndicator />
        </div>
      ) : (
        <>
          {avatar}
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <div className={userHasActions ? styles.headerRight : ''}>
              <CreatedAt createdAt={createdAt} />
              {userHasActions && (
                <FeedActions
                  onEdit={onEdit}
                  onDeleteRequest={openDeleteDialog}
                  testId={`${testId}_actions`}
                />
              )}
            </div>
          </div>
          <Divider className={classes.divider} />
          <div className={styles.content}>{children}</div>
          {isOpenDeleteDialog && (
            <DeleteDialog
              open={isOpenDeleteDialog}
              type={type}
              onDelete={onDelete}
              onCancel={closeDeleteDialog}
            />
          )}
        </>
      )}
    </div>
  );
};
