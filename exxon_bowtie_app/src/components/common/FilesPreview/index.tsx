/* eslint-disable react/no-array-index-key */
import { FC } from 'react';

import { AsyncPhoto } from '../AsyncPhoto';
import { FileItem } from '../FileItem';
import { FilePreview } from '../FilePreview';

import styles from './index.module.css';

import { isImage, isVideo, Record } from '@/entities/record';
import { getPhotoLink, deleteFile } from '@/entities/upload';

type Props = {
  files: Record[];
  isEditing: boolean;
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
};

export const FilesPreview: FC<Props> = ({ files, isEditing, setFiles }) => {
  const renderContent = file => {
    return isImage(file) && !isVideo(file) ? (
      <AsyncPhoto onUpload={() => getPhotoLink(file)} />
    ) : (
      <FileItem item={file} />
    );
  };

  const removeFile = (id: string) => {
    if (!isEditing) {
      deleteFile(id);
    }
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className={styles.container}>
      {files.map((file, index) => {
        const testId = 'filePreview';
        return (
          // eslint-disable-next-line react/jsx-key
          <FilePreview key={index} onDelete={() => removeFile(file.id)} testId={testId}>
            {renderContent(file)}
          </FilePreview>
        );
      })}
    </div>
  );
};
