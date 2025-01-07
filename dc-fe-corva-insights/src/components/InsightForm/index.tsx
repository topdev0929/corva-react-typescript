import { Button, Modal } from '@corva/ui/components';
import { showErrorNotification, showSuccessNotification } from '@corva/ui/utils';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { useInsightFormStore } from '@/contexts/insight-form';

import { InsightFormSelectors } from './Selectors';
import { InsightFormComment } from './Comment';
import { FilesPreview } from './FilesPreview';
import styles from './index.module.css';
import { VIEWS } from '@/constants';

export * from './AddInsight';
export * from './EditInsight';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const InsightForm: FC<Props> = observer(({ open, onClose }) => {
  const store = useInsightFormStore();

  const onLocalClose = () => {
    store.onCancel();
    onClose();
  };

  const onLocalSave = async () => {
    try {
      await store.onSave();
      onClose();
      showSuccessNotification('Insight has been saved');
    } catch (e) {
      showErrorNotification('Could not save insight');
    }
  };

  return (
    <Modal
      data-testid={`${VIEWS.INSIGHT_FORM}_modal`}
      open={open}
      onClose={onLocalClose}
      title={`${store.isEditing ? 'Edit' : 'Add'} Insight`}
      contentContainerClassName={styles.container}
      actions={
        <div className={styles.actions}>
          <Button
            color="primary"
            onClick={onLocalClose}
            data-testid={`${VIEWS.INSIGHT_FORM}_modal_cancelBtn`}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onLocalSave}
            data-testid={`${VIEWS.INSIGHT_FORM}_modal_saveBtn`}
            disabled={store.isSavingDisabled}
          >
            {store.isEditing ? 'Save' : 'Add'}
          </Button>
        </div>
      }
    >
      <div className={styles.form}>
        <InsightFormSelectors />
        <InsightFormComment />
        <FilesPreview />
      </div>
    </Modal>
  );
});

InsightForm.displayName = 'InsightForm';
