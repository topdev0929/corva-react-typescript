import { IconButton, Popover } from '@corva/ui/components';
import { FC, PropsWithChildren } from 'react';
import CloseIcon from '@material-ui/icons/Close';

import styles from './index.module.css';

type Props = {
  anchorEl: any;
  onClose: () => void;
  'data-testid'?: string;
};

export const FiltersPopover: FC<PropsWithChildren<Props>> = ({
  anchorEl,
  onClose,
  children,
  'data-testid': testId,
}) => {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(anchorEl)}
      PaperProps={{
        style: {
          width: 286,
          padding: '24px 16px 16px 16px',
          marginTop: 8,
        },
      }}
      data-testid={testId}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          <IconButton
            onClick={onClose}
            tooltipProps={{ title: 'Close' }}
            data-testid={`${testId}_closeBtn`}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {children}
      </div>
    </Popover>
  );
};
