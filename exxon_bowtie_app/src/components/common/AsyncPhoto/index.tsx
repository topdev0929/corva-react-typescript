import { FC, useEffect, useState } from 'react';
import { LoadingIndicator } from '@corva/ui/components';

import styles from './index.module.css';

type Props = {
  onUpload: () => Promise<string>;
  testId?: string;
};

export const AsyncPhoto: FC<Props> = ({ onUpload, testId }) => {
  const [url, setUrl] = useState<string>('');
  const [isUploading, setUploadingStatus] = useState<boolean>(false);

  const uploadPhoto = async () => {
    setUploadingStatus(true);
    const result = await onUpload();
    setUrl(result);
    setUploadingStatus(false);
  };

  useEffect(() => {
    uploadPhoto();
  }, []);

  if (isUploading) {
    return (
      <div className={styles.loading} data-testid={`${testId}_loader`}>
        <LoadingIndicator size={32} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      className={styles.photo}
      src={url}
      alt="Attached photo"
      height={132}
      data-testid={testId}
    />
  );
};
