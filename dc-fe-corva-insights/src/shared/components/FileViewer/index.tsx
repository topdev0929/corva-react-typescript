import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import { Modal, IconButton } from '@corva/ui/components';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';

import { FileViewerSlider } from './Slider';
import { DocViewer } from './DocViewer';
import styles from './index.module.css';

type Props = {
  open: boolean;
  fileUrl: string;
  fileName: string;
  onClose: () => void;
  secondaryActions?: React.ReactNode;
  'data-testid'?: string;
};

export const FileViewer = ({
  open,
  fileUrl,
  fileName,
  onClose,
  'data-testid': dataTestId,
  secondaryActions,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onContextMenu={e => e.stopPropagation()}
      contentContainerClassName={styles.modalContainer}
      contentClassName={styles.modalContent}
    >
      <div data-testid={`${dataTestId}_file_${fileName}`} className={styles.container}>
        <div className={styles.toolbar}>
          <Typography data-testid={`${dataTestId}_fileName`}>{fileName}</Typography>
          <div className={styles.actions}>
            {secondaryActions}
            <IconButton
              size="small"
              tooltipProps={{ title: 'Download' }}
              className={styles.actionBtn}
              data-testid={`${dataTestId}_downloadBtn`}
            >
              <a download href={fileUrl} target="_blank" rel="noopener noreferrer">
                <GetAppIcon fontSize="small" />
              </a>
            </IconButton>
            <IconButton
              size="small"
              onClick={onClose}
              tooltipProps={{ title: 'Close' }}
              className={styles.actionBtn}
              data-testid={`${dataTestId}_closeBtn`}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Modal>
  );
};

FileViewer.Slider = FileViewerSlider;
FileViewer.DocViewer = DocViewer;
