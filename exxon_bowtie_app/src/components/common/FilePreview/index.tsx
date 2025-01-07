import { FC, PropsWithChildren } from 'react';
import { IconButton } from '@corva/ui/components';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from './index.module.css';

type Props = {
  onDelete: () => void;
  testId?: string;
};

export const FilePreview: FC<PropsWithChildren<Props>> = ({ children, onDelete, testId }) => {
  return (
    <div className={styles.container} data-testid={testId}>
      {children}
      <div className={styles.overlay} />
      <div className={styles.delete}>
        <IconButton
          onClick={onDelete}
          tooltipProps={{ title: 'Delete' }}
          data-testid={`${testId}_deleteBtn`}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};
