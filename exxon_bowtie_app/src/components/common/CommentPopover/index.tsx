import { FC, useState } from 'react';
import { upperCase } from 'lodash';
import { Button, Modal } from '@corva/ui/components';
import { showErrorNotification, showSuccessNotification } from '@corva/ui/utils';

import { Comment } from '../Comment';
import { Selectors } from '../Selectors';
import { FilesPreview } from '../FilesPreview';

import styles from './index.module.css';

import { Record } from '@/entities/record';
import { Status, TComment, TSource } from '@/types/global.type';

type Props = {
  open: boolean;
  isEditing: boolean;
  isFilesLoading: boolean;
  setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  files: Record[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  commentIndex: number;
  setCommentIndex: React.Dispatch<React.SetStateAction<number>>;
  chipIndex: number;
  title: string;
  onClose: () => void;
  currentUser: { [key: string]: any };
  assetId: number;
  comment: TComment;
  source: TSource;
  setSource: (data: TSource) => void;
};

export const CommentPopover: FC<Props> = ({
  open,
  onClose,
  isEditing,
  isFilesLoading,
  setIsFilesLoading,
  files,
  setFiles,
  commentIndex,
  setCommentIndex,
  chipIndex,
  title,
  currentUser,
  assetId,
  comment,
  source,
  setSource,
}) => {
  const [text, setText] = useState(comment?.description);
  const [date, setDate] = useState(comment?.time);

  const onLocalClose = () => {
    setCommentIndex(-1);
    onClose();
  };

  const onLocalSave = async () => {
    try {
      const data = source;
      if (commentIndex !== -1) {
        data[title].chips[chipIndex].comments[commentIndex].description = text;
        data[title].chips[chipIndex].comments[commentIndex].time = date;
      } else {
        data[title].chips[chipIndex].comments.push({
          status: Status.Done,
          title: `${upperCase(currentUser.first_name.slice(0, 1))}.${currentUser.last_name}`,
          description: text,
          time: date,
        });
      }
      setSource({ ...data });
      setCommentIndex(-1);
      onClose();
      showSuccessNotification('Comment has been saved');
    } catch (e) {
      showErrorNotification('Could not save comment');
    }
  };

  return (
    <Modal
      data-testid="comment-modal"
      open={open}
      onClose={onLocalClose}
      title={`${isEditing ? 'Edit' : 'Add'} Comment`}
      contentContainerClassName={styles.container}
      actions={
        <div className={styles.actions}>
          <Button color="primary" onClick={onLocalClose} data-testid="comment_modal_cancelBtn">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onLocalSave}
            data-testid="comment_modal_saveBtn"
            // disabled={store.isSavingDisabled}
          >
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </div>
      }
    >
      <div className={styles.form}>
        <Selectors date={date} setDate={setDate} />
        <Comment
          isFilesLoading={isFilesLoading}
          setIsFilesLoading={setIsFilesLoading}
          currentUser={currentUser}
          assetId={assetId}
          files={files}
          setFiles={setFiles}
          comment={text}
          setText={setText}
        />
        <FilesPreview files={files} isEditing={isEditing} setFiles={setFiles} />
      </div>
    </Modal>
  );
};
