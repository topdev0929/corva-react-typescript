import {
  ACTIVITY_TYPE,
  FIELD_SAMPLE_TYPE,
  getActivityTypeOptions,
  getCreateInsightTypeOptions,
  getFieldSampleTypeOptions,
  Insight,
  INSIGHT_TYPE,
  InsightPayload,
} from '@/entities/insight';
import { mockedInsightsApi } from '@/mocks/api/insights-api';
import { mockedRecordsApi } from '@/mocks/api/records-api';
import { mockedFiltersStore } from '@/mocks/stores/filters-store';
import { mockedGlobalStore } from '@/mocks/stores/global-store';
import { mockedInsight } from '@/mocks/insight';
import { mockedRecord } from '@/mocks/record';
import {
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';

import { InsightFormStoreImpl, INSIGHTS_FORM_MODE } from '../index';

jest.mock('@/shared/services/insights-events-listener', () => {
  const originalModule = jest.requireActual('@/shared/services/insights-events-listener');
  return {
    __esModule: true,
    ...originalModule,
    insightsEventListener: {
      notify: jest.fn(),
    },
  };
});

const changeIfStoreContainEmptyData = (store: InsightFormStoreImpl) => {
  expect(store.text).toEqual('');
  expect(store.files).toEqual([]);
  expect(store.activityType).toEqual(ACTIVITY_TYPE.MAINTENANCE);
  expect(store.fieldSampleType).toEqual(FIELD_SAMPLE_TYPE.LAB);
  expect(store.mode).toEqual(INSIGHTS_FORM_MODE.CREATE);
  expect(store.isFilesLoading).toEqual(false);
  expect(store.date).toEqual(new Date(mockedFiltersStore.selectedDay));
  expect(store.date).toEqual(new Date(mockedFiltersStore.selectedDay));
};

describe('InsightFormStore', () => {
  let store: InsightFormStoreImpl;
  let editedInsight: Insight;

  beforeEach(() => {
    editedInsight = { ...mockedInsight };
    store = new InsightFormStoreImpl(
      { insights: mockedInsightsApi, records: mockedRecordsApi },
      { filters: mockedFiltersStore, global: mockedGlobalStore },
      null
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(store.typeOptions).toEqual(getCreateInsightTypeOptions());
    expect(store.activityTypeOptions).toEqual(getActivityTypeOptions());
    expect(store.fieldSampleTypeOptions).toEqual(getFieldSampleTypeOptions());
  });

  it('should have empty data for creating mode', () => {
    changeIfStoreContainEmptyData(store);
  });

  it('should have correct data for editing mode', () => {
    store = new InsightFormStoreImpl(
      { insights: mockedInsightsApi, records: mockedRecordsApi },
      { filters: mockedFiltersStore, global: mockedGlobalStore },
      editedInsight
    );
    expect(store.text).toEqual(editedInsight.comment);
    expect(store.files).toEqual(editedInsight.files);
    expect(store.activityType).toEqual(ACTIVITY_TYPE.MAINTENANCE);
    expect(store.fieldSampleType).toEqual(FIELD_SAMPLE_TYPE.LAB);
    expect(store.mode).toEqual(INSIGHTS_FORM_MODE.EDIT);
    expect(store.date).toEqual(new Date(editedInsight.datetime));
  });

  it('should return saving disabled as false', () => {
    expect(store.isSavingDisabled).toEqual(false);
  });

  it('should return saving disabled as true', () => {
    store.date = null;
    expect(store.isSavingDisabled).toEqual(true);
  });

  it('should set text', () => {
    const text = 'test';
    store.setText(text);
    expect(store.text).toEqual(text);
  });

  it('should set date', () => {
    const date = new Date();
    store.setDate(date);
    expect(store.date).toEqual(date);
  });

  it('should set type', () => {
    const type = INSIGHT_TYPE.OBSERVATION;
    store.setType(type);
    expect(store.type).toEqual(type);
  });

  it('should set type to activity', () => {
    const type = INSIGHT_TYPE.ACTIVITY;
    store.setType(type);
    expect(store.type).toEqual(type);
  });

  it('should set activity type', () => {
    const type = ACTIVITY_TYPE.REPAIR;
    store.setActivityType(type);
    expect(store.activityType).toEqual(type);
  });

  it('should set field sample type', () => {
    const type = FIELD_SAMPLE_TYPE.VENDOR;
    store.setFieldSampleType(type);
    expect(store.fieldSampleType).toEqual(type);
  });

  describe('checkIfShowSpecificField', () => {
    it('should return true for activity', () => {
      store.type = INSIGHT_TYPE.ACTIVITY;
      expect(store.checkIfShowSpecificField('activityType')).toEqual(true);
      expect(store.checkIfShowSpecificField('fieldSampleType')).toEqual(false);
    });

    it('should return true for field sample', () => {
      store.type = INSIGHT_TYPE.FIELD_SAMPLE;
      expect(store.checkIfShowSpecificField('fieldSampleType')).toEqual(true);
      expect(store.checkIfShowSpecificField('activityType')).toEqual(false);
    });

    it('should return false for observation', () => {
      store.type = INSIGHT_TYPE.OBSERVATION;
      expect(store.checkIfShowSpecificField('activityType')).toEqual(false);
      expect(store.checkIfShowSpecificField('fieldSampleType')).toEqual(false);
    });

    it('should return true for observation', () => {
      store.type = INSIGHT_TYPE.OBSERVATION;
      expect(store.checkIfShowSpecificField('other')).toEqual(true);
    });
  });

  describe('removeFile', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should remove file from store and remote storage', () => {
      store.files = [mockedRecord];
      store.removeFile(mockedRecord.id);
      expect(store.files).toEqual([]);
      expect(mockedRecordsApi.delete).toHaveBeenCalledWith(mockedRecord.id);
    });

    it('should remove file only from store', () => {
      store = new InsightFormStoreImpl(
        { insights: mockedInsightsApi, records: mockedRecordsApi },
        { filters: mockedFiltersStore, global: mockedGlobalStore },
        editedInsight
      );
      store.files = [mockedRecord];
      store.removeFile(mockedRecord.id);
      expect(store.files).toEqual([]);
      expect(mockedRecordsApi.delete).not.toBeCalled();
    });
  });

  it('should upload files', async () => {
    const files = [new File([], 'test'), new File([], 'test2')];
    await store.uploadFiles(files);
    expect(store.files).toEqual([mockedRecord, mockedRecord]);
    expect(mockedRecordsApi.create).toHaveBeenCalledTimes(2);
    expect(mockedRecordsApi.uploadFile).toHaveBeenCalledTimes(2);
  });

  it('should not upload files for empty list', async () => {
    const files = [];
    await store.uploadFiles(files);
    expect(store.files).toEqual([]);
    expect(mockedRecordsApi.create).not.toBeCalled();
    expect(mockedRecordsApi.uploadFile).not.toBeCalled();
  });

  it('should return photo link', async () => {
    await store.getPhotoLink(mockedRecord);
    expect(mockedRecordsApi.getFileLink).toHaveBeenCalledWith(mockedRecord.ref);
  });

  describe('onSave', () => {
    let payload: InsightPayload;

    const createStoreToEdit = () => {
      store = new InsightFormStoreImpl(
        { insights: mockedInsightsApi, records: mockedRecordsApi },
        { filters: mockedFiltersStore, global: mockedGlobalStore },
        editedInsight
      );
      store.text = payload.comment;
      store.files = [mockedRecord];
      store.type = payload.type;
      store.date = new Date(payload.datetime);
    };

    beforeEach(() => {
      payload = {
        comment: 'test',
        datetime: '01/01/2022 00:00:00',
        filesIds: [mockedRecord.id],
        type: INSIGHT_TYPE.OBSERVATION,
        author: {
          id: mockedGlobalStore.user.id,
          profilePhoto: mockedGlobalStore.user.profilePhoto,
          firstName: mockedGlobalStore.user.firstName,
          lastName: mockedGlobalStore.user.lastName,
        },
        otherComments: [],
      };
      store.text = payload.comment;
      store.files = [mockedRecord];
      store.type = payload.type;
      store.date = new Date(payload.datetime);
      jest.clearAllMocks();
    });

    it('should create a new insight', async () => {
      await store.onSave();

      expect(mockedInsightsApi.create).toHaveBeenCalledWith(
        payload,
        mockedGlobalStore.currentCompanyId,
        mockedGlobalStore.currentAssetId
      );
      expect(insightsEventListener.notify).toHaveBeenCalledWith({
        type: InsightsEventTypes.INSIGHT_CREATED,
        payload: mockedInsight,
      });
      changeIfStoreContainEmptyData(store);
    });

    it('should create a new insight with activity type', async () => {
      store.type = INSIGHT_TYPE.ACTIVITY;
      store.activityType = ACTIVITY_TYPE.REPAIR;
      await store.onSave();

      expect(mockedInsightsApi.create).toHaveBeenCalledWith(
        {
          ...payload,
          type: INSIGHT_TYPE.ACTIVITY,
          activityType: ACTIVITY_TYPE.REPAIR,
        },
        mockedGlobalStore.currentCompanyId,
        mockedGlobalStore.currentAssetId
      );
      expect(insightsEventListener.notify).toHaveBeenCalledWith({
        type: InsightsEventTypes.INSIGHT_CREATED,
        payload: mockedInsight,
      });
      changeIfStoreContainEmptyData(store);
    });

    it('should update an insight', async () => {
      createStoreToEdit();
      await store.onSave();

      expect(mockedInsightsApi.update).toHaveBeenCalledWith(
        editedInsight.id,
        payload,
        mockedGlobalStore.currentCompanyId
      );
      expect(insightsEventListener.notify).toHaveBeenCalledWith({
        type: InsightsEventTypes.INSIGHT_UPDATED,
        payload: mockedInsight,
      });
      changeIfStoreContainEmptyData(store);
    });

    it('should update an insight with field sample type', async () => {
      createStoreToEdit();
      store.type = INSIGHT_TYPE.FIELD_SAMPLE;
      store.fieldSampleType = FIELD_SAMPLE_TYPE.VENDOR;
      await store.onSave();

      expect(mockedInsightsApi.update).toHaveBeenCalledWith(
        editedInsight.id,
        {
          ...payload,
          type: INSIGHT_TYPE.FIELD_SAMPLE,
          fieldSampleType: FIELD_SAMPLE_TYPE.VENDOR,
        },
        mockedGlobalStore.currentCompanyId
      );
      expect(insightsEventListener.notify).toHaveBeenCalledWith({
        type: InsightsEventTypes.INSIGHT_UPDATED,
        payload: mockedInsight,
      });
      changeIfStoreContainEmptyData(store);
    });
  });

  it('should cancel creating a new insight', () => {
    store.files = [mockedRecord, mockedRecord];
    store.onCancel();
    expect(mockedRecordsApi.delete).toHaveBeenCalledTimes(2);
    changeIfStoreContainEmptyData(store);
  });

  it('should cancel editing an insight', () => {
    store = new InsightFormStoreImpl(
      { insights: mockedInsightsApi, records: mockedRecordsApi },
      { filters: mockedFiltersStore, global: mockedGlobalStore },
      { ...editedInsight, files: [mockedRecord] }
    );

    store.files = [mockedRecord, { ...mockedRecord, id: '2' }];
    store.onCancel();
    expect(mockedRecordsApi.delete).toHaveBeenCalledTimes(1);
    changeIfStoreContainEmptyData(store);
  });
});
