import { Tooltip } from '@corva/ui/components';
import { FC } from 'react';

import { getInsightTileColor, getInsightTileLabel } from '@/entities/insight';
import { removeOpacityFromRGB } from '@/shared/utils';

import { InsightTypeProps } from '../types';
import styles from './index.module.css';

type Props = InsightTypeProps;

export const InsightTypeCircle: FC<Props> = ({ tile, testId }) => {
  return (
    <Tooltip title={getInsightTileLabel(tile)} placement="top">
      <span
        className={styles.container}
        style={{ backgroundColor: removeOpacityFromRGB(getInsightTileColor(tile)) }}
        data-testid={testId}
      />
    </Tooltip>
  );
};
