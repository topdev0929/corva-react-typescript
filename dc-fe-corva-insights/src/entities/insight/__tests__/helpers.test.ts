import { mockedInsight } from '@/mocks/insight';

import {
  getActivityTypeLabel,
  getActivityTypeOptions,
  getCreateInsightTypeOptions,
  getFieldSampleTypeOptions,
  getInsightsByDay,
  getInsightTileColor,
  getInsightTileIcon,
  getInsightTileLabel,
  getInsightTypeOptions,
  getInsightTileSecondaryColor,
  getUniqueInsightTiles,
  groupInsightsByDay,
  isActivityInsight,
  isAllowInsightContainFiles,
  isFieldSampleInsight,
  getInsightTile,
} from '../helpers';
import {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_LABELS,
  FIELD_SAMPLE_TYPE,
  Insight,
  INSIGHT_TYPE,
  INSIGHT_TILE_COLORS,
  INSIGHT_TILE_ICONS,
  INSIGHT_TILE_LABELS,
  INSIGHT_TILE_SECOND_COLORS,
  InsightsPerDay,
} from '../index';

describe('Insight helpers', () => {
  describe('groupInsightsByDay', () => {
    let days: Date[] = [];
    let insights: Insight[] = [];
    let expected: InsightsPerDay;

    beforeEach(() => {
      jest.clearAllMocks();
      days = [new Date('2020-01-01'), new Date('2020-01-02')];
      insights = [
        { ...mockedInsight, datetime: days[1].toISOString() },
        { ...mockedInsight, datetime: days[0].toISOString() },
        mockedInsight,
      ];
      expected = new Map([
        [days[0], { list: [insights[1]], commentsNumber: 1 }],
        [days[1], { list: [insights[0]], commentsNumber: 1 }],
      ]);
    });

    it('should group insights by day', () => {
      const result = groupInsightsByDay(insights, days);
      expect(result).toEqual(expected);
    });

    it('should return map with empty lists if no insights', () => {
      const result = groupInsightsByDay([], days);
      expect(result).toEqual(
        new Map([
          [days[0], { list: [], commentsNumber: 0 }],
          [days[1], { list: [], commentsNumber: 0 }],
        ])
      );
    });

    it('should return empty map if no days', () => {
      const result = groupInsightsByDay([mockedInsight], []);
      expect(result).toEqual(new Map());
    });

    it('should skip empty days if skipEmpty option is true', () => {
      const result = groupInsightsByDay(insights, [...days, new Date('2020-01-03')], {
        skipEmpty: true,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('getInsightsByDay', () => {
    const createInsights = (day: Date) => {
      return [
        { ...mockedInsight, datetime: day.toISOString() },
        { ...mockedInsight, datetime: day.toISOString() },
        mockedInsight,
      ];
    };

    it('should return insights for given day', () => {
      const day = new Date('2020-01-01');
      const insights = createInsights(day);
      const result = getInsightsByDay(insights, day);
      expect(result).toEqual([insights[0], insights[1]]);
    });

    it('should return empty array if no insights for given day', () => {
      const day = new Date('2020-01-01');
      const insights = createInsights(day);
      const result = getInsightsByDay(insights, new Date('2020-01-02'));
      expect(result).toEqual([]);
    });

    it('should return empty array if no insights', () => {
      const day = new Date('2020-01-01');
      const result = getInsightsByDay([], day);
      expect(result).toEqual([]);
    });
  });

  describe('getInsightTileLabel', () => {
    it('should return insight type label', () => {
      const result = getInsightTileLabel(INSIGHT_TYPE.OBSERVATION);
      expect(result).toEqual(INSIGHT_TILE_LABELS.insight);
    });
  });

  describe('getInsightTileIcon', () => {
    it('should return insight type icon', () => {
      const result = getInsightTileIcon(INSIGHT_TYPE.MILESTONE);
      expect(result).toEqual(INSIGHT_TILE_ICONS.milestone);
    });
  });

  describe('getInsightTileColor', () => {
    it('should return insight type color', () => {
      const result = getInsightTileColor(INSIGHT_TYPE.FIELD_SAMPLE);
      expect(result).toEqual(INSIGHT_TILE_COLORS.field_sample);
    });
  });

  describe('getInsightTileSecondaryColor', () => {
    it('should return insight type secondary color', () => {
      const result = getInsightTileSecondaryColor(INSIGHT_TYPE.ACTIVITY);
      expect(result).toEqual(INSIGHT_TILE_SECOND_COLORS.activity);
    });
  });

  describe('getActivityTypeLabel', () => {
    it('should return activity type label', () => {
      const result = getActivityTypeLabel(ACTIVITY_TYPE.REPAIR);
      expect(result).toEqual(ACTIVITY_TYPE_LABELS.repair);
    });
  });

  describe('getInsightTypeOptions', () => {
    it('should return options for insights', () => {
      const result = getInsightTypeOptions();
      expect(result).toEqual([
        { label: 'Observation', value: 'insight' },
        { label: 'Activity', value: 'activity' },
        { label: 'Field Sample', value: 'field_sample' },
        { label: 'Site Visit', value: 'site_visit' },
        { label: 'Real Time Measurements', value: 'measurements' },
        { label: 'Key Milestone', value: 'milestone' },
      ]);
    });
  });

  describe('getCreateInsightTypeOptions', () => {
    it('should return insight types for create insight', () => {
      const result = getCreateInsightTypeOptions();
      expect(result).toEqual([
        { label: 'Observation', value: 'insight', icon: 'observations.svg' },
        { label: 'Activity', value: 'activity', icon: 'activity.svg' },
        { label: 'Field Sample', value: 'field_sample', icon: 'field_sample.svg' },
        { label: 'Site Visit', value: 'site_visit', icon: 'site_visit.svg' },
        { label: 'Real Time Measurements', value: 'measurements', icon: 'measurements.svg' },
        { label: 'Key Milestone', value: 'milestone', icon: 'key_milestones.svg' },
      ]);
      // Uncomment this line in case when manual creation of "real-time" and "field/lab sample" insight is not allowed
      /* expect(result).toEqual([
        { label: 'Insight', value: 'insight', icon: 'observation.svg' },
        { label: 'Activity', value: 'activity', icon: 'activity.svg' },
        { label: 'Site visit', value: 'site_visit', icon: 'site_visit.svg' },
        { label: 'Milestone', value: 'milestone', icon: 'key_milestones.svg' },
      ]); */
    });
  });

  describe('getActivityTypeOptions', () => {
    it('should return options for activities', () => {
      const result = getActivityTypeOptions();
      expect(result).toEqual([
        { label: 'Repair', value: 'repair' },
        { label: 'Maintenance', value: 'maintenance' },
      ]);
    });
  });

  describe('getFieldSampleTypeOptions', () => {
    it('should return options for field samples', () => {
      const result = getFieldSampleTypeOptions();
      expect(result).toEqual([
        { label: 'Lab', value: 'lab' },
        { label: 'Vendor', value: 'vendor' },
      ]);
    });
  });

  describe('isActivityInsight', () => {
    it('should return true if insight is activity', () => {
      const result = isActivityInsight(INSIGHT_TYPE.ACTIVITY);
      expect(result).toEqual(true);
    });

    it('should return false if insight is not activity', () => {
      const result = isActivityInsight(INSIGHT_TYPE.OBSERVATION);
      expect(result).toEqual(false);
    });
  });

  describe('isFieldSampleInsight', () => {
    it('should return true if insight is field sample', () => {
      const result = isFieldSampleInsight(INSIGHT_TYPE.FIELD_SAMPLE);
      expect(result).toEqual(true);
    });

    it('should return false if insight is not field sample', () => {
      const result = isFieldSampleInsight(INSIGHT_TYPE.OBSERVATION);
      expect(result).toEqual(false);
    });
  });

  describe('isAllowInsightContainFiles', () => {
    it('should return true for activity type', () => {
      const result = isAllowInsightContainFiles(INSIGHT_TYPE.ACTIVITY);
      expect(result).toEqual(true);
    });

    it('should return false for milestone type', () => {
      const result = isAllowInsightContainFiles(INSIGHT_TYPE.MILESTONE);
      expect(result).toEqual(false);
    });
  });

  describe('getUniqueInsightTiles', () => {
    it('should return unique insight types', () => {
      const result = getUniqueInsightTiles([
        { ...mockedInsight, type: INSIGHT_TYPE.OBSERVATION },
        { ...mockedInsight, type: INSIGHT_TYPE.OBSERVATION },
        {
          ...mockedInsight,
          type: INSIGHT_TYPE.FIELD_SAMPLE,
          fieldSampleType: FIELD_SAMPLE_TYPE.LAB,
        },
      ]);
      expect(result).toEqual(new Set([INSIGHT_TYPE.OBSERVATION, FIELD_SAMPLE_TYPE.LAB]));
    });

    it('should return empty set if no insights', () => {
      const result = getUniqueInsightTiles([]);
      expect(result).toEqual(new Set());
    });
  });

  describe('getInsightTile', () => {
    it('should return insight tile', () => {
      const result = getInsightTile(mockedInsight);
      expect(result).toEqual(INSIGHT_TYPE.OBSERVATION);
    });

    it('should return insight tile for field sample', () => {
      const result = getInsightTile({
        ...mockedInsight,
        type: INSIGHT_TYPE.FIELD_SAMPLE,
        fieldSampleType: FIELD_SAMPLE_TYPE.LAB,
      });
      expect(result).toEqual(FIELD_SAMPLE_TYPE.LAB);
    });
  });
});
