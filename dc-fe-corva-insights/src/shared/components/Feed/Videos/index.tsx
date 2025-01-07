import { FC } from 'react';

import { Record } from '@/entities/record';
import { VideoItem } from './VideoItem';

import styles from './index.module.css';

type Props = {
  videos: Record[];
  onLoadUrl: (ref: string) => Promise<string>;
  testId?: string;
};

export const VideosList: FC<Props> = ({ videos, onLoadUrl, testId }) => {
  return (
    <div className={styles.container} data-testid={testId}>
      {videos?.map(video => {
        return (
          <div key={video.id} className={styles.item}>
            <VideoItem onUpload={onLoadUrl} item={video} />
          </div>
        );
      })}
    </div>
  );
};
