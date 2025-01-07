import { FC, useEffect, useState } from 'react';

import { LoadingIndicator } from '@corva/ui/components';
import { Record } from '@/entities/record';
import { getDateFromStr } from '@/shared/utils';
import styles from './index.module.css';

type Props = {
  onUpload: (ref: string) => Promise<string>;
  item: Record;
  onClick?: () => void;
  testId?: string;
};

export const VideoItem: FC<Props> = ({ item, onUpload, testId, onClick }) => {
  const [url, setUrl] = useState<string>('');
  const [isUploading, setUploadingStatus] = useState<boolean>(false);

  const getVideoURL = async () => {
    setUploadingStatus(true);
    const result = await onUpload(item.ref);
    setUrl(result);
    setUploadingStatus(false);
  };

  useEffect(() => {
    getVideoURL();
  }, []);

  if (isUploading) {
    return (
      <div className={styles.loading} data-testid={`${testId}_loader`}>
        <LoadingIndicator size={32} />
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid={testId} onClick={onClick}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video src={url} preload="metadata" width="100%" controls disablePictureInPicture />
      <div className={styles.data}>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.date}>{getDateFromStr(item.datetime).format('DD/MM/YY, HH:mm')}</p>
      </div>
    </div>
  );
};
