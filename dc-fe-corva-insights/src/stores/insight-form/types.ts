import {
  ACTIVITY_TYPE,
  ActivityTypeOption,
  FIELD_SAMPLE_TYPE,
  FieldSampleTypeOption,
  INSIGHT_TYPE,
  InsightTypeOption,
} from '@/entities/insight';
import { Record } from '@/entities/record';
import { FiltersStore } from '@/stores/filters';
import { RecordsApi } from '@/api/records';
import { InsightsApi } from '@/api/insights';

import { GlobalStore } from '../global';

export type APIDependencies = {
  records: RecordsApi;
  insights: InsightsApi;
};
export type StoresDependencies = {
  global: GlobalStore;
  filters: FiltersStore;
};

export enum INSIGHTS_FORM_MODE {
  CREATE,
  EDIT,
}

export interface InsightFormStore {
  isEditing: boolean;
  isSavingDisabled: boolean;
  isFilesLoading: boolean;
  text: string;
  date: Date | null;
  type: INSIGHT_TYPE;
  files: Record[];
  activityType: ACTIVITY_TYPE;
  fieldSampleType: FIELD_SAMPLE_TYPE;
  typeOptions: InsightTypeOption[];
  activityTypeOptions: ActivityTypeOption[];
  fieldSampleTypeOptions: FieldSampleTypeOption[];
  checkIfShowSpecificField: (field: string) => boolean;
  setText(text: string): void;
  setDate(date: Date | null): void;
  setType(type: INSIGHT_TYPE): void;
  setActivityType(type: ACTIVITY_TYPE): void;
  setFieldSampleType(type: FIELD_SAMPLE_TYPE): void;
  uploadFiles(files: File[]): void;
  removeFile(id: string): void;
  onCancel(): void;
  onSave(): Promise<void>;
  getPhotoLink: (file: Record) => Promise<string>;
}
