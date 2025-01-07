import { FC } from 'react';

import { Tile } from '@/shared/components/Tile';
import { getInsightTileColor, getInsightTileIcon, getInsightTileLabel } from '@/entities/insight';

import { InsightTypeProps } from '../types';
import styles from './index.module.css';

type Props = InsightTypeProps & {
  color?: string;
};

export const InsightTypeTile: FC<Props> = ({ tile, className, color, testId }) => {
  return (
    <Tile
      color={color || getInsightTileColor(tile)}
      tooltip={{ content: getInsightTileLabel(tile), placement: 'top' }}
      className={className}
      testId={testId}
    >
      <img className={styles.icon} src={getInsightTileIcon(tile)} alt={getInsightTileLabel(tile)} />
    </Tile>
  );
};
