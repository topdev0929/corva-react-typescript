import { FC } from 'react';
import { Avatar } from '@corva/ui/components';

import { getInsightTileSecondaryColor, InsightTile } from '@/entities/insight';
import { InsightAuthor } from '@/entities/insight/author';
import { InsightTypeTile } from '@/shared/components/InsightType/Tile';
import { getUserFullName } from '@/shared/utils';

import styles from './index.module.css';

type Props = {
  author: InsightAuthor;
  tile: InsightTile;
  testId?: string;
};

export const InsightAvatar: FC<Props> = ({ author, tile, testId }) => {
  return (
    <div className={styles.avatar} data-testid={`${testId}_avatar`}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Avatar displayName={getUserFullName(author)} imgSrc={author?.profilePhoto} size={32} />
      <InsightTypeTile
        color={getInsightTileSecondaryColor(tile)}
        tile={tile}
        className={styles.type}
      />
    </div>
  );
};
