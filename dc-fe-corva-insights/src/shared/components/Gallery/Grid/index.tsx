import { FC } from 'react';
import { Gallery } from 'react-grid-gallery';
import { IconButton } from '@corva/ui/components';
import { FullScreen as FullScreenIcon } from '@icon-park/react';

import { GalleryImageProps } from '../types';
import styles from './index.module.css';

type Props = {
  photos: GalleryImageProps[];
  fullscreenProps?: {
    onOpenViewer: (index: number) => void;
    isAllowed: boolean;
  };
  isExpanded?: boolean;
  testId?: string;
};

export const GalleryGrid: FC<Props> = ({ photos, fullscreenProps, isExpanded, testId }) => {
  if (fullscreenProps?.isAllowed) {
    const getCustomOverlay = (index: number) => {
      return (
        <div className={styles.fullscreen}>
          <IconButton
            data-testid={`${testId}_fullscreenBtn`}
            onClick={() => fullscreenProps.onOpenViewer(index)}
            tooltipProps={{ title: 'Full Screen' }}
          >
            <FullScreenIcon size={20} />
          </IconButton>
        </div>
      );
    };

    // eslint-disable-next-line no-param-reassign
    photos = photos.map((photo, index) => ({
      ...photo,
      customOverlay: getCustomOverlay(index),
    }));
  }

  return (
    <Gallery
      images={photos}
      enableImageSelection={false}
      rowHeight={isExpanded ? 540 : 180}
      id={testId}
    />
  );
};
