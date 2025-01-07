import { makeObservable, observable, computed, action } from 'mobx';
import { showErrorNotification, showSuccessNotification } from '@corva/ui/utils';
import moment from 'moment';

import {
  ACTIVITY_TYPE,
  INSIGHT_TYPE,
  Insight,
  ActivityTypeOption,
  InsightTypeOption,
  getActivityTypeOptions,
  getCreateInsightTypeOptions,
  InsightPayload,
  isActivityInsight,
  getAuthorDataFromUser,
  FIELD_SAMPLE_TYPE,
  isFieldSampleInsight,
  getFieldSampleTypeOptions,
  FieldSampleTypeOption,
} from '@/entities/insight';
import { getNewRecordDatetime, Record } from '@/entities/record';

import { StoreWithDependencies } from '../store';
import { INSIGHTS_FORM_MODE, InsightFormStore, StoresDependencies, APIDependencies } from './types';
import { getTwoListsDifference } from '@/shared/utils';
import {
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';

export * from './types';

export class InsightFormStoreImpl
  extends StoreWithDependencies<APIDependencies, StoresDependencies>
  implements InsightFormStore
{
  #editedInsight: Insight | null = null;
  #eventListener = insightsEventListener;
  @observable mode: INSIGHTS_FORM_MODE = INSIGHTS_FORM_MODE.CREATE;
  @observable text = '';
  @observable date: Date | null = new Date();
  @observable type: INSIGHT_TYPE = INSIGHT_TYPE.OBSERVATION;
  @observable files: Record[] = [];
  @observable activityType: ACTIVITY_TYPE = ACTIVITY_TYPE.MAINTENANCE;
  @observable fieldSampleType: FIELD_SAMPLE_TYPE = FIELD_SAMPLE_TYPE.LAB;
  @observable isFilesLoading = false;
  typeOptions: InsightTypeOption[] = [];
  activityTypeOptions: ActivityTypeOption[] = [];
  fieldSampleTypeOptions: FieldSampleTypeOption[] = [];

  constructor(api: APIDependencies, stores: StoresDependencies, editedInsight: Insight | null) {
    super(api, stores);
    this.typeOptions = getCreateInsightTypeOptions();
    this.activityTypeOptions = getActivityTypeOptions();
    this.fieldSampleTypeOptions = getFieldSampleTypeOptions();
    this.date = new Date(stores.filters.selectedDay);
    if (editedInsight) {
      this.#initFormFromInsight(editedInsight);
    }
    makeObservable(this);
  }

  @computed
  get isEditing() {
    return this.mode === INSIGHTS_FORM_MODE.EDIT;
  }

  @computed
  get isSavingDisabled() {
    return !this.date || this.isFilesLoading;
  }

  @action
  setText(text: string) {
    this.text = text;
  }

  @action
  setDate(date: Date | null) {
    this.date = date;
  }

  @action
  setType(type: INSIGHT_TYPE) {
    this.type = type;
  }

  @action
  setActivityType(type: ACTIVITY_TYPE) {
    this.activityType = type;
  }

  @action
  setFieldSampleType(type: FIELD_SAMPLE_TYPE) {
    this.fieldSampleType = type;
  }

  @action
  startFilesLoading() {
    this.isFilesLoading = true;
  }

  @action
  stopFilesLoading() {
    this.isFilesLoading = false;
  }

  @action
  setFiles(files: Record[]) {
    this.files = files;
  }

  checkIfShowSpecificField(field: string): boolean {
    if (field === 'activityType') {
      return isActivityInsight(this.type);
    }
    if (field === 'fieldSampleType') {
      return isFieldSampleInsight(this.type);
    }
    return true;
  }

  onCancel() {
    this.#deleteFilesFromStorage(this.#getNewFiles());
    this.#resetForm();
  }

  removeFile(id: string): void {
    if (!this.isEditing) {
      this.api.records.delete(id);
    }
    this.setFiles(this.files.filter(file => file.id !== id));
  }

  async uploadFile(file: File): Promise<void> {
    try {
      const uploadingResult = await this.api.records.uploadFile(file);
      const recordPayload = {
        ...uploadingResult,
        datetime: getNewRecordDatetime(file.lastModified),
      };
      const newRecord = await this.api.records.create(
        recordPayload,
        this.stores.global.currentCompanyId,
        this.stores.global.currentAssetId
      );
      this.setFiles([...this.files, newRecord]);
      showSuccessNotification('File uploaded successfully');
    } catch (error) {
      showErrorNotification('File upload failed');
    }
  }

  async uploadFiles(files: File[]): Promise<void> {
    this.startFilesLoading();
    await Promise.all(files.map(async file => this.uploadFile(file)));
    this.stopFilesLoading();
  }

  async getPhotoLink(record: Record): Promise<string> {
    return this.api.records.getFileLink(record.ref).catch(() => '');
  }

  async onSave() {
    const payload: InsightPayload = this.#createPayload();
    if (this.mode === INSIGHTS_FORM_MODE.CREATE) {
      await this.#createInsight(payload);
    } else if (this.#editedInsight) {
      await this.#updateInsight(this.#editedInsight.id, payload);
      const filesToDelete = this.#getDeletedFilesDuringEditing(this.#editedInsight);
      this.#deleteFilesFromStorage(filesToDelete);
    }
    this.#resetForm();
  }

  async #createInsight(payload: InsightPayload) {
    const insight = await this.api.insights.create(
      payload,
      this.stores.global.currentCompanyId,
      this.stores.global.currentAssetId
    );
    this.#eventListener.notify({ type: InsightsEventTypes.INSIGHT_CREATED, payload: insight });
  }

  async #updateInsight(insightId: string, payload: InsightPayload) {
    const updatedInsight = await this.api.insights.update(
      insightId,
      payload,
      this.stores.global.currentCompanyId
    );
    this.#eventListener.notify({
      type: InsightsEventTypes.INSIGHT_UPDATED,
      payload: updatedInsight,
    });
  }

  #createPayload(): InsightPayload {
    const payload: InsightPayload = {
      otherComments: this.#editedInsight?.otherComments || [],
      author: getAuthorDataFromUser(this.stores.global.user),
      comment: this.text,
      datetime: moment(this.date || undefined).format('MM/DD/YYYY HH:mm:ss'),
      type: this.type,
      activityType: isActivityInsight(this.type) ? this.activityType : undefined,
      fieldSampleType: isFieldSampleInsight(this.type) ? this.fieldSampleType : undefined,
      filesIds: this.files.map(file => file.id),
    };
    if (this.#editedInsight?.app) {
      payload.app = this.#editedInsight?.app;
    }
    if (this.#editedInsight?.settings) {
      payload.settings = this.#editedInsight?.settings;
    }
    return payload;
  }

  #initFormFromInsight(insight: Insight) {
    this.mode = INSIGHTS_FORM_MODE.EDIT;
    this.#editedInsight = insight;
    this.text = insight.comment;
    this.date = new Date(insight.datetime);
    this.type = insight.type;
    this.activityType = insight.activityType || ACTIVITY_TYPE.MAINTENANCE;
    this.fieldSampleType = insight.fieldSampleType || FIELD_SAMPLE_TYPE.LAB;
    this.files = insight.files;
  }

  #resetForm() {
    this.mode = INSIGHTS_FORM_MODE.CREATE;
    this.#editedInsight = null;
    this.text = '';
    this.date = new Date(this.stores.filters.selectedDay);
    this.type = INSIGHT_TYPE.OBSERVATION;
    this.activityType = ACTIVITY_TYPE.MAINTENANCE;
    this.fieldSampleType = FIELD_SAMPLE_TYPE.LAB;
    this.files = [];
  }

  #getNewFiles(): Record[] {
    if (this.isEditing) {
      return getTwoListsDifference(this.files, this.#editedInsight?.files || []);
    } else {
      return this.files;
    }
  }

  #getDeletedFilesDuringEditing(editedInsight: Insight): Record[] {
    return getTwoListsDifference(editedInsight.files, this.files);
  }

  #deleteFilesFromStorage(files: Record[]): void {
    files.forEach(file => this.api.records.delete(file.id));
  }
}
