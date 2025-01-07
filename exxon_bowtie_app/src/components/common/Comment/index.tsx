import { FC } from 'react';
import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { showErrorNotification, showSuccessNotification } from '@corva/ui/utils';

import { EmojiISelector } from '../EmojiSelector';
import { AttachFile } from '../AttachFile';

import styles from './index.module.css';

import { uploadingFile, create } from '@/entities/upload';
import { getNewRecordDatetime } from '@/entities/record';

type Props = {
  isFilesLoading: boolean;
  setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  files: any;
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser: { [key: string]: any };
  assetId: number;
  comment: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const useStyles = makeStyles({
  input: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'flex-end',
    '&::after': {
      display: 'none',
    },
    '&::before': {
      display: 'none',
    },
  },
  endAdornment: {
    height: '100%',
  },
});

export const Comment: FC<Props> = ({
  isFilesLoading,
  setIsFilesLoading,
  files,
  setFiles,
  currentUser,
  assetId,
  comment,
  setText,
}) => {
  const classes = useStyles();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSelectEmoji = emoji => setText(`${comment}${emoji.native}`);

  const uploadFile = async (file: File): Promise<void> => {
    try {
      const uploadingResult = await uploadingFile(file);
      const recordPayload = {
        ...uploadingResult,
        datetime: getNewRecordDatetime(file.lastModified),
      };
      const newRecord = await create(recordPayload, currentUser?.companyId, assetId);
      setFiles([...files, newRecord]);
      showSuccessNotification('File uploaded successfully');
    } catch (error) {
      showErrorNotification('File upload failed');
    }
  };

  const uploadFiles = async (files: File[]): Promise<void> => {
    setIsFilesLoading(true);
    await Promise.all(files.map(async file => uploadFile(file)));
    setIsFilesLoading(false);
  };

  return (
    <div className={styles.container}>
      <TextField
        data-testid="commentTextField"
        InputProps={{
          inputProps: {
            'data-testid': `_commentTextField_textarea`,
          },
          classes: { root: classes.input },
          endAdornment: (
            <InputAdornment position="end" className={classes.endAdornment}>
              <div className={styles.actions}>
                <AttachFile
                  testId="attachFileBtn"
                  onUpload={files => uploadFiles(files)}
                  isLoading={isFilesLoading}
                />
                <EmojiISelector
                  handleSelectEmoji={e => handleSelectEmoji(e)}
                  disableRipple
                  closeOnSelect
                />
              </div>
            </InputAdornment>
          ),
        }}
        variant="filled"
        fullWidth
        value={comment}
        onChange={onChange}
        multiline
        rows={4}
        placeholder="Type here..."
      />
    </div>
  );
};
