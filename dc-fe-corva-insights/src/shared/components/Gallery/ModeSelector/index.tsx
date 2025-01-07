import { FC } from 'react';
import { IconButton } from '@corva/ui/components';

import { GalleryMode } from '../types';
import styles from './index.module.css';

type Props = {
  value: GalleryMode;
  onChange: (mode: GalleryMode) => void;
  testId?: string;
};

export const ModeSelector: FC<Props> = ({ value, onChange, testId }) => {
  const renderIcon = (mode: GalleryMode) => {
    const d =
      mode === 'carousel'
        ? 'M3.33333 3.33203H12.6667C13.4 3.33203 14 3.93203 14 4.66536V11.332C14 12.0654 13.4 12.6654 12.6667 12.6654H3.33333C2.6 12.6654 2 12.0654 2 11.332V4.66536C2 3.93203 2.6 3.33203 3.33333 3.33203ZM3.33333 11.332H12.6667V4.66536H3.33333V11.332Z'
        : 'M7.33333 8.66667H2V2H7.33333V8.66667ZM7.33333 14H2V10H7.33333V14ZM8.66667 14H14V7.33333H8.66667V14ZM8.66667 6V2H14V6H8.66667Z';
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={d}
          fill={mode === value ? '#03BCD4' : '#BDBDBD'}
        />
      </svg>
    );
  };

  return (
    <div className={styles.actions}>
      <IconButton
        onClick={() => onChange('grid')}
        tooltipProps={{ title: 'All Photos' }}
        data-testid={`${testId}_allPhotosBtn`}
      >
        {renderIcon('grid')}
      </IconButton>
      <IconButton
        onClick={() => onChange('carousel')}
        tooltipProps={{ title: 'Single Photo' }}
        data-testid={`${testId}_singlePhotoBtn`}
      >
        {renderIcon('carousel')}
      </IconButton>
    </div>
  );
};
