import { FC } from 'react';
import { LoadingIndicator } from '@corva/ui/components';

import { useViewer } from '@/shared/hooks/useViewer';

import { GalleryGrid } from './Grid';
import { GalleryViewer } from './Viewer';
import { GalleryFile } from './types';
import { useGallerySideEffects } from './useGallerySideEffects';
import styles from './index.module.css';

type Props = {
  images: GalleryFile[];
  onLoadUrl: (ref: string) => Promise<string>;
  testId?: string;
};

export const Gallery: FC<Props> = ({ images, onLoadUrl, testId }) => {
  const { viewerData, closeViewer, openViewer } = useViewer();
  const { imagesForGallery, isLoading } = useGallerySideEffects(images, onLoadUrl);

  if (!images.length) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <GalleryGrid
        photos={imagesForGallery}
        fullscreenProps={{ onOpenViewer: openViewer, isAllowed: true }}
        testId={testId}
      />
      {viewerData.isOpen && (
        <GalleryViewer
          images={imagesForGallery}
          onClose={closeViewer}
          defaultIndex={viewerData.defaultIndex}
          testId={`${testId}_viewer`}
        />
      )}
    </div>
  );
};
