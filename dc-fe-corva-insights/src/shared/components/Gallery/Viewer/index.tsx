import { FC, useState } from 'react';

import { FileViewer } from '../../FileViewer';
import { GalleryGrid } from '../Grid';
import { ModeSelector } from '../ModeSelector';
import { GalleryImageProps, GalleryMode } from '../types';
import styles from './index.module.css';

type Props = {
  images: GalleryImageProps[];
  defaultIndex: number;
  onClose: () => void;
  testId?: string;
};

export const GalleryViewer: FC<Props> = ({ images, defaultIndex, onClose, testId }) => {
  const [mode, setMode] = useState<GalleryMode>('carousel');
  const [currentPhoto, setCurrentPhoto] = useState<GalleryImageProps>(images[defaultIndex]);

  const isDifferentModesAllowed = images.length > 1;

  return (
    <FileViewer
      open
      fileUrl={currentPhoto.src}
      fileName={currentPhoto.name}
      onClose={onClose}
      secondaryActions={
        isDifferentModesAllowed ? <ModeSelector value={mode} onChange={setMode} /> : undefined
      }
      data-testid={testId}
    >
      {mode === 'carousel' ? (
        <FileViewer.Slider<GalleryImageProps>
          items={images}
          defaultIndex={defaultIndex}
          onChange={setCurrentPhoto}
          data-testid={`${testId}_slider`}
        >
          {photo => (
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={photo.src}
                alt={photo.name}
                data-testid={`${testId}_photo`}
              />
            </div>
          )}
        </FileViewer.Slider>
      ) : (
        <GalleryGrid photos={images} testId={testId} isExpanded />
      )}
    </FileViewer>
  );
};
