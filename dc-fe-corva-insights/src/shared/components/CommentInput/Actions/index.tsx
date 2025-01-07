import { FC } from 'react';
import { IconButton } from '@corva/ui/components';
import { Collapse, Typography } from '@material-ui/core';

import styles from './index.module.css';

type Props = {
  isOpen: boolean;
  onSend: () => void;
  onCancel: () => void;
  testId?: string;
};

export const CommentInputActions: FC<Props> = ({ isOpen, onSend, onCancel, testId }) => {
  return (
    <Collapse in={isOpen} mountOnEnter unmountOnExit>
      <div className={styles.actions}>
        <Typography
          data-testid={`${testId}_cancel`}
          variant="caption"
          color="primary"
          onClick={onCancel}
        >
          Cancel
        </Typography>
        <div className={styles.sendAction}>
          <Typography variant="caption">
            Press&nbsp;
            <Typography variant="caption" color="primary">
              Enter
            </Typography>
            &nbsp;to send
          </Typography>
          <IconButton
            size="large"
            tooltipProps={{ title: 'Send' }}
            data-testid={`${testId}_sendButton`}
            onClick={onSend}
          >
            <svg
              width={21}
              height={21}
              viewBox="0 0 21 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.01 18L21 9L0.01 0L0 7L15 9L0 11L0.01 18Z" fill="#03BCD4" />
            </svg>
          </IconButton>
        </div>
      </div>
    </Collapse>
  );
};
