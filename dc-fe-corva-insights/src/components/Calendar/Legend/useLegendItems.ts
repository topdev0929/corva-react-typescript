import { useMemo } from 'react';

import {
  getInsightTileIcon,
  getInsightTileLabel,
  INSIGHT_TYPE,
  INSIGHT_TILE_ICONS,
  InsightTile,
} from '@/entities/insight';
import todayIcon from '@/assets/today.svg';
import rangeIcon from '@/assets/range.svg';
import selectedDayIcon from '@/assets/selected_day.svg';

type CommonLegendItem = {
  id: string;
  label: string;
  icon: string;
};

type LegendTileItem = CommonLegendItem & {
  isTile: true;
  id: InsightTile;
  tile: InsightTile;
};

type LegendItem = LegendTileItem | CommonLegendItem;

export function isLegendTileItem(item: LegendItem): item is LegendTileItem {
  return (item as LegendTileItem).isTile;
}

export const useLegendItems = () => {
  return useMemo<LegendItem[]>(() => {
    const tiles: InsightTile[] = Object.keys(INSIGHT_TILE_ICONS) as InsightTile[];
    const legendTileItems: LegendTileItem[] = tiles
      .filter(tile => tile !== INSIGHT_TYPE.FIELD_SAMPLE)
      .map<LegendTileItem>(tile => {
        return {
          isTile: true,
          tile,
          id: tile,
          label: getInsightTileLabel(tile),
          icon: getInsightTileIcon(tile),
        };
      });
    const otherItems: CommonLegendItem[] = [
      { id: 'current_day', label: 'Current Day', icon: todayIcon },
      { id: 'range', label: 'Selected Range', icon: rangeIcon },
      { id: 'selected_day', label: 'Selected Day', icon: selectedDayIcon },
    ];
    return [...legendTileItems, ...otherItems];
  }, []);
};
