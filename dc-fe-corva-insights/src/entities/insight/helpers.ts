import { getDateFromStr } from '@/shared/utils';

import {
  ActivityTypeOption,
  Insight,
  InsightsPerDay,
  InsightTypeOption,
  FieldSampleTypeOption,
  INSIGHT_TYPE,
  ACTIVITY_TYPE,
  INSIGHT_TILE_COLORS,
  INSIGHT_TILE_ICONS,
  INSIGHT_TILE_LABELS,
  INSIGHT_TILE_SECOND_COLORS,
  ACTIVITY_TYPE_LABELS,
  FIELD_SAMPLE_TYPE_LABELS,
  FIELD_SAMPLE_TYPE,
  InsightTile,
} from './index';

export function getInsightsByDay(insights: Insight[], day: Date): Insight[] {
  return insights.filter(insight => getDateFromStr(insight.datetime).isSame(day, 'day'));
}

type GroupInsightsByDayOptions = {
  skipEmpty?: boolean;
};
export function groupInsightsByDay(
  insights: Insight[],
  days: Date[],
  options?: GroupInsightsByDayOptions
): InsightsPerDay {
  const result: InsightsPerDay = new Map();
  days.forEach(day => {
    const dayInsights = getInsightsByDay(insights, day);
    if (options?.skipEmpty && dayInsights.length === 0) return;
    result.set(day, { list: dayInsights, commentsNumber: dayInsights.length });
  });
  return result;
}

export function getInsightTileColor(tile: InsightTile): string {
  return INSIGHT_TILE_COLORS[tile];
}

export function getInsightTileSecondaryColor(tile: InsightTile): string {
  return INSIGHT_TILE_SECOND_COLORS[tile];
}

export function getInsightTileIcon(tile: InsightTile): string {
  return INSIGHT_TILE_ICONS[tile];
}

export function getInsightTileLabel(tile: InsightTile): string {
  return INSIGHT_TILE_LABELS[tile];
}

export function getActivityTypeLabel(type: ACTIVITY_TYPE): string {
  return ACTIVITY_TYPE_LABELS[type];
}

export function getFieldSampleTypeLabel(type: FIELD_SAMPLE_TYPE): string {
  return FIELD_SAMPLE_TYPE_LABELS[type];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isInsightCanBeCreatedManually(type: INSIGHT_TYPE): boolean {
  // Uncomment if we want to disable manual creation of field samples and measurements
  // return type !== INSIGHT_TYPE.FIELD_SAMPLE && type !== INSIGHT_TYPE.MEASUREMENTS;
  return true;
}

export function getAllTypes(): INSIGHT_TYPE[] {
  return Object.values(INSIGHT_TYPE);
}

export function getCreateInsightTypes(): INSIGHT_TYPE[] {
  return getAllTypes().filter(isInsightCanBeCreatedManually);
}

function convertInsightTypesToOptions(types: INSIGHT_TYPE[], { withIcon }): InsightTypeOption[] {
  return types.map(type => ({
    value: type,
    label: getInsightTileLabel(type),
    icon: withIcon ? getInsightTileIcon(type) : undefined,
  }));
}

export function getInsightTypeOptions(): InsightTypeOption[] {
  return convertInsightTypesToOptions(getAllTypes(), { withIcon: false });
}

export function getCreateInsightTypeOptions(): InsightTypeOption[] {
  return convertInsightTypesToOptions(getCreateInsightTypes(), { withIcon: true });
}

export function getActivityTypeOptions(): ActivityTypeOption[] {
  return Object.values(ACTIVITY_TYPE).map(type => ({
    label: getActivityTypeLabel(type),
    value: type,
  }));
}

export function getFieldSampleTypeOptions(): FieldSampleTypeOption[] {
  return Object.values(FIELD_SAMPLE_TYPE).map(type => ({
    label: getFieldSampleTypeLabel(type),
    value: type,
  }));
}

export function isActivityInsight(type: INSIGHT_TYPE): boolean {
  return type === INSIGHT_TYPE.ACTIVITY;
}

export function isFieldSampleInsight(type: INSIGHT_TYPE): boolean {
  return type === INSIGHT_TYPE.FIELD_SAMPLE;
}

export function isAllowInsightContainFiles(type: INSIGHT_TYPE): boolean {
  return type !== INSIGHT_TYPE.MILESTONE;
}

export function getInsightTile(insight: Insight): InsightTile {
  return isFieldSampleInsight(insight.type) && insight.fieldSampleType
    ? insight.fieldSampleType
    : insight.type;
}

export function getUniqueInsightTiles(insights: Insight[]): Set<InsightTile> {
  const tiles = new Set<InsightTile>();
  insights.forEach(insight => tiles.add(getInsightTile(insight)));
  return tiles;
}
