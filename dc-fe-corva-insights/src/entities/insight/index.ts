import { Record as FileRecord } from '../record';
import { InsightComment } from './comment';
import { InsightAuthor } from './author';
import { AppType } from './app';
import fieldSampleIcon from '../../assets/field_sample.svg';
import fieldSampleVendorIcon from '../../assets/field_sample_vendor.svg';
import observationIcon from '../../assets/observations.svg';
import activityIcon from '../../assets/activity.svg';
import milestonesIcon from '../../assets/key_milestones.svg';
import measurementsIcon from '../../assets/measurements.svg';
import siteVisitIcon from '../../assets/site_visit.svg';

export * from './helpers';
export * from './author';
export * from './comment';

export enum INSIGHT_TYPE {
  OBSERVATION = 'insight',
  ACTIVITY = 'activity',
  FIELD_SAMPLE = 'field_sample',
  SITE_VISIT = 'site_visit',
  MEASUREMENTS = 'measurements',
  MILESTONE = 'milestone',
}

export enum ACTIVITY_TYPE {
  REPAIR = 'repair',
  MAINTENANCE = 'maintenance',
}

export enum FIELD_SAMPLE_TYPE {
  LAB = 'lab',
  VENDOR = 'vendor',
}

export type InsightTile = INSIGHT_TYPE | FIELD_SAMPLE_TYPE;

export type Insight = {
  id: string;
  timestamp: number;
  datetime: string;
  type: INSIGHT_TYPE;
  author: InsightAuthor;
  comment: string;
  filesIds: string[];
  files: FileRecord[];
  otherComments: InsightComment[];
  activityType?: ACTIVITY_TYPE;
  fieldSampleType?: FIELD_SAMPLE_TYPE;
  app?: AppType;
  settings?: any;
};
export type InsightPayload = Omit<Insight, 'id' | 'files' | 'timestamp'>;

export type InsightsPerDayValue = { list: Insight[]; commentsNumber: number };
export type InsightsPerDay = Map<Date, InsightsPerDayValue>;

export type InsightTypeOption = { value: INSIGHT_TYPE; label: string; icon?: string };
export type ActivityTypeOption = { value: ACTIVITY_TYPE; label: string };
export type FieldSampleTypeOption = { value: FIELD_SAMPLE_TYPE; label: string };

export const INSIGHT_TILE_COLORS: Record<InsightTile, string> = {
  [INSIGHT_TYPE.OBSERVATION]: 'rgba(23, 215, 100, 0.12)',
  [INSIGHT_TYPE.ACTIVITY]: 'rgba(252, 151, 0, 0.12)',
  [INSIGHT_TYPE.FIELD_SAMPLE]: 'rgba(58, 168, 255, 0.12)',
  [INSIGHT_TYPE.SITE_VISIT]: 'rgba(255, 89, 130, 0.12)',
  [INSIGHT_TYPE.MEASUREMENTS]: 'rgba(181, 147, 254, 0.12)',
  [INSIGHT_TYPE.MILESTONE]: 'rgba(255, 238, 0, 0.12)',
  [FIELD_SAMPLE_TYPE.LAB]: 'rgba(58, 168, 255, 0.12)',
  [FIELD_SAMPLE_TYPE.VENDOR]: 'rgba(207, 84, 243, 0.12)',
};

export const INSIGHT_TILE_SECOND_COLORS: Record<InsightTile, string> = {
  [INSIGHT_TYPE.OBSERVATION]: 'rgba(26, 70, 43, 0.6)',
  [INSIGHT_TYPE.ACTIVITY]: 'rgba(85, 60, 22, 0.6)',
  [INSIGHT_TYPE.FIELD_SAMPLE]: 'rgba(31, 62, 88, 0.6)',
  [INSIGHT_TYPE.SITE_VISIT]: 'rgba(78, 32, 43, 0.6)',
  [INSIGHT_TYPE.MEASUREMENTS]: 'rgba(48, 35, 78, 0.6)',
  [INSIGHT_TYPE.MILESTONE]: 'rgba(74, 71, 25, 0.6)',
  [FIELD_SAMPLE_TYPE.LAB]: 'rgba(31, 62, 88, 0.6)',
  [FIELD_SAMPLE_TYPE.VENDOR]: 'rgba(207, 84, 243, 0.3)',
};

export const INSIGHT_TILE_ICONS: Record<InsightTile, string> = {
  [INSIGHT_TYPE.OBSERVATION]: observationIcon,
  [INSIGHT_TYPE.ACTIVITY]: activityIcon,
  [INSIGHT_TYPE.FIELD_SAMPLE]: fieldSampleIcon,
  [INSIGHT_TYPE.SITE_VISIT]: siteVisitIcon,
  [INSIGHT_TYPE.MEASUREMENTS]: measurementsIcon,
  [INSIGHT_TYPE.MILESTONE]: milestonesIcon,
  [FIELD_SAMPLE_TYPE.LAB]: fieldSampleIcon,
  [FIELD_SAMPLE_TYPE.VENDOR]: fieldSampleVendorIcon,
};

export const INSIGHT_TILE_LABELS: Record<InsightTile, string> = {
  [INSIGHT_TYPE.OBSERVATION]: 'Observation',
  [INSIGHT_TYPE.ACTIVITY]: 'Activity',
  [INSIGHT_TYPE.FIELD_SAMPLE]: 'Field Sample',
  [INSIGHT_TYPE.SITE_VISIT]: 'Site Visit',
  [INSIGHT_TYPE.MEASUREMENTS]: 'Real Time Measurements',
  [INSIGHT_TYPE.MILESTONE]: 'Key Milestone',
  [FIELD_SAMPLE_TYPE.LAB]: 'Field Sample (Lab)',
  [FIELD_SAMPLE_TYPE.VENDOR]: 'Field Sample (Vendor)',
};

export const ACTIVITY_TYPE_LABELS: Record<ACTIVITY_TYPE, string> = {
  [ACTIVITY_TYPE.REPAIR]: 'Repair',
  [ACTIVITY_TYPE.MAINTENANCE]: 'Maintenance',
};

export const FIELD_SAMPLE_TYPE_LABELS: Record<FIELD_SAMPLE_TYPE, string> = {
  [FIELD_SAMPLE_TYPE.LAB]: 'Lab',
  [FIELD_SAMPLE_TYPE.VENDOR]: 'Vendor',
};
