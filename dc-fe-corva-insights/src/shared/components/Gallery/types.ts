export type GalleryImageProps = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type GalleryFile = {
  ref: string;
  name: string;
};

export type GalleryMode = 'grid' | 'carousel';
