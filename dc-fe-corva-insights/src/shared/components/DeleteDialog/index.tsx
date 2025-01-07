import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Modal } from '@corva/ui/components';
import { showSuccessNotification, showErrorNotification } from '@corva/ui/utils';
import { FC, PropsWithChildren } from 'react';
import _ from 'lodash';

import styles from './index.module.css';

type Props = {
  open: boolean;
  type: string;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
};

const testId = 'deleteDialog';

export const DeleteDialog: FC<PropsWithChildren<Props>> = ({ open, type, onDelete, onCancel }) => {
  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete();
      } catch (e) {
        showErrorNotification(`Failed to delete ${type}`);
      }
      showSuccessNotification(`${_.capitalize(type)} was deleted`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={`Delete ${type}`}
      actions={
        <div className={styles.actions}>
          <Button color="primary" onClick={onCancel} data-testid={`${testId}_deleteCancelBtn`}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleDelete}
            data-testid={`${testId}_deleteBtn`}
          >
            <DeleteIcon style={{ marginRight: 8 }} />
            Delete
          </Button>
        </div>
      }
    >
      <span className={styles.deleteText}>Are you sure you want to delete {type}?</span>
    </Modal>
  );
};
