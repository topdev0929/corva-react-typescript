import { IconButton } from '@corva/ui/components';
import { FC, useRef } from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { SUPPORTED_FILE_MIME_TYPES } from '@/constants';

import styles from './index.module.css';

const useStyles = makeStyles({
  addBtn: {
    marginLeft: 12,
  },
});

type Props = {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
  testId?: string;
};

export const AttachFile: FC<Props> = ({ onUpload, isLoading, testId }) => {
  const classes = useStyles();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const onClickUploadDocument = () => {
    fileRef.current?.click();
  };

  const onFilesChanged = event => {
    const { files } = event.target;
    onUpload(Array.from(files));
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <CircularProgress data-testid={`${testId}_loader`} size={16} />
      ) : (
        <>
          <IconButton
            data-testid={testId}
            size="small"
            onClick={onClickUploadDocument}
            className={classes.addBtn}
            tooltipProps={{ title: 'Attach file' }}
          >
            <AttachFileIcon />
          </IconButton>
          <input
            data-testid={`${testId}_input`}
            className={styles.fileInput}
            type="file"
            multiple
            ref={fileRef}
            onChange={onFilesChanged}
            accept={SUPPORTED_FILE_MIME_TYPES.join(', ')}
          />
        </>
      )}
    </div>
  );
};
