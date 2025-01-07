import { useEffect, useMemo, useState } from 'react';

import { getImageSize } from '@/shared/utils';
import { useDelayedLoading } from '@/shared/hooks/useDelayedLoading';

import { GalleryFile, GalleryImageProps } from './types';

export const useGallerySideEffects = (
  images: GalleryFile[],
  onLoadUrl: (ref: string) => Promise<string>
) => {
  const { isLoading, cancelLoading, startLoading } = useDelayedLoading();

  const [imagesForGallery, setImagesForGallery] = useState<GalleryImageProps[]>([]);

  const key = useMemo(() => images.map(image => image.ref).join('-'), [images]);

  const prepareImage = async (image: GalleryFile) => {
    const url = await onLoadUrl(image.ref);
    const { width, height } = await getImageSize(url);
    return {
      name: image.name,
      src: url,
      width,
      height,
    };
  };

  const prepareImages = async () => {
    startLoading();
    const preparedImages = await Promise.all(images.map(prepareImage));
    setImagesForGallery(preparedImages);
    cancelLoading();
  };

  useEffect(() => {
    if (images.length) {
      prepareImages();
    }
    return () => {
      cancelLoading();
    };
  }, [key]);

  return {
    imagesForGallery,
    isLoading,
  };
};
