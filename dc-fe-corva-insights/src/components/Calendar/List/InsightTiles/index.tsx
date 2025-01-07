import { FC } from 'react';
import classnames from 'classnames';

import { getInsightTileIcon, getInsightTileLabel, InsightTile } from '@/entities/insight';
import { InsightTypeTile } from '@/shared/components/InsightType/Tile';
import { InsightTypeCircle } from '@/shared/components/InsightType/Circle';
import { Tile } from '@/shared/components/Tile';

import styles from './index.module.css';

type Props = {
  tiles: Set<InsightTile>;
  minimized?: boolean;
  testId?: string;
};

const MAX_INSIGHT_TYPES = 6;

export const InsightTiles: FC<Props> = ({ tiles, minimized, testId }) => {
  const tilesArray = [...tiles];

  const renderInsightTypeTiles = (tiles: InsightTile[]) => {
    const InsightTypeComponent = minimized ? InsightTypeCircle : InsightTypeTile;
    return tiles.map(tile => (
      <InsightTypeComponent key={tile} tile={tile} testId={`${testId}_tile_${tile}`} />
    ));
  };

  const renderMoreTile = (tiles: InsightTile[]) => {
    const tooltipContent = (
      <div className={styles.moreTooltip}>
        {tiles.map(tile => (
          <div key={tile} className={styles.moreTooltipRow}>
            <img
              className={styles.moreTooltipRowIcon}
              src={getInsightTileIcon(tile)}
              alt="Insight Type"
            />
            <p className={styles.moreTooltipRowText}>{getInsightTileLabel(tile)}</p>
          </div>
        ))}
      </div>
    );
    return (
      <Tile
        tooltip={{ content: tooltipContent, placement: 'bottom' }}
        testId={`${testId}_tileMore`}
      >
        +{tiles.length}
      </Tile>
    );
  };

  return (
    <div className={classnames(styles.container, { [styles.isMinimized]: minimized })}>
      {tiles.size <= MAX_INSIGHT_TYPES || minimized
        ? renderInsightTypeTiles(tilesArray)
        : [
            ...renderInsightTypeTiles(tilesArray.slice(0, MAX_INSIGHT_TYPES - 1)),
            renderMoreTile(tilesArray.slice(MAX_INSIGHT_TYPES - 1)),
          ]}
    </div>
  );
};
