import { useEffect, useState, useCallback, useMemo } from 'react';
import { isEmpty, get, cloneDeep, set, max, includes } from 'lodash';

import {
  fetchData,
  isRecordInStage,
  getFirstTimestampBySetting,
  getAdjustedPredictionRecord,
  getAdjustedActivities,
  loadDataInTimeRange,
  saveEvents,
  getValidation,
  isLastNActiveSetting,
  isCustomTimeRangeSetting,
} from '../utils/dataUtils';
import {
  convertWitItem,
  convertPredictionItem,
  convertActivityItem,
  convertPredictionItemBack,
} from '../utils/conversionUtils';
import { getPredictionKeyByEventName } from '../utils/eChartUtils';
import { PERCENT_PROPPANT } from '../constants';

const defaultData = {
  mainData: [],
  dataRange: [],
  mappedChemicals: [],
  offsetPressures: [],
  customChannels: [],
};

export function useFetchedAllData(
  selectedWells,
  appOffsetSetting,
  appFilterSetting,
  appPadModeSetting,
  isAssetViewer,
  queryLastTimestamp,
  appScaleSetting,
  appDataSetting,
  witsSubData,
  customTimeSetting,
  predictionsSubData,
  createActivitySubData,
  updateActivitySubData,
  onAppSettingChange,
  setLoading,
  appRtValuessetSetting,
  abraWells
) {
  const [data, setData] = useState(defaultData);
  const [adjustedData, setAdjustedData] = useState(defaultData);
  const [editedData, setEditedData] = useState(defaultData);
  const [isAppScaleSettingChanged, setIsAppScaleSettingChanged] = useState(false);

  const isStageDataLoad =
    appRtValuessetSetting && includes(appRtValuessetSetting, PERCENT_PROPPANT.key);

  const wellIds = selectedWells.map(well => well.id);
  const allSeriesTypes = useMemo(
    () =>
      appScaleSetting.reduce((result, setting) => {
        return [...result, ...setting.series];
      }, []),
    [appScaleSetting]
  );

  useEffect(() => {
    async function fetchAllData(selectedWells) {
      const allData = await fetchData(
        selectedWells,
        appOffsetSetting,
        appFilterSetting,
        appPadModeSetting,
        isAssetViewer,
        queryLastTimestamp,
        customTimeSetting,
        isStageDataLoad,
        abraWells
      );

      setData(allData);
      setLoading(false);
    }

    if (isEmpty(selectedWells) || isEmpty(appFilterSetting)) {
      setData(defaultData);
      setLoading(false);
      setIsAppScaleSettingChanged(false);
      return;
    }

    if (
      isCustomTimeRangeSetting(appFilterSetting) &&
      (!customTimeSetting.start || !customTimeSetting.end)
    ) {
      setIsAppScaleSettingChanged(false);
      return;
    }

    if (isAssetViewer === null) {
      return;
    }
    setLoading(true);
    setData(defaultData);
    setEditedData(defaultData);
    setAdjustedData(defaultData);
    fetchAllData(selectedWells);
    setIsAppScaleSettingChanged(false);
  }, [
    String(wellIds),
    abraWells,
    appOffsetSetting,
    appPadModeSetting,
    appFilterSetting,
    isAssetViewer,
    queryLastTimestamp,
    customTimeSetting,
    isStageDataLoad,
    isAppScaleSettingChanged,
  ]);

  useEffect(() => {
    setEditedData(adjustedData);
  }, [adjustedData]);

  useEffect(() => {
    const { offsetPressures, customChannels, mappedChemicals, mainData } = data;
    if (isEmpty(mainData)) return;

    let newScaleSetting = cloneDeep(appScaleSetting);

    // NOTE: create or use trash channels instead of create new scales
    let trashChannelsIndex = newScaleSetting.findIndex(item => item.key === 'trashChannels');
    if (trashChannelsIndex === -1) {
      newScaleSetting = [
        ...newScaleSetting,
        {
          key: 'trashChannels',
          label: 'Trash Channels',
          series: [],
        },
      ];
      trashChannelsIndex = newScaleSetting.length - 1;
    }

    // NOTE: add offset pressures into scale setting
    const offsetPressureScale = newScaleSetting.find(item => item.key === 'offsetPressure');
    const newOffsetPressures = offsetPressures.filter(
      item =>
        !newScaleSetting.find(setting =>
          get(setting, 'series', []).find(series => series.key === item.key)
        )
    );
    if (offsetPressureScale) {
      newScaleSetting = newScaleSetting.map(scaleSetting => {
        if (scaleSetting.key === 'offsetPressure') {
          return {
            ...scaleSetting,
            series: [...scaleSetting.series, ...newOffsetPressures],
          };
        }
        return scaleSetting;
      });
    } else {
      newScaleSetting = newScaleSetting.map(scaleSetting => {
        if (scaleSetting.key === 'trashChannels') {
          return {
            ...scaleSetting,
            series: [...scaleSetting.series, ...newOffsetPressures],
          };
        }
        return scaleSetting;
      });
    }

    // NOTE: add custom channels into scale setting
    customChannels.forEach(customChannel => {
      const isExistChannel = !!newScaleSetting.find(setting =>
        setting.series.find(series => series.key === customChannel.key)
      );
      if (isExistChannel) return;

      newScaleSetting = set(
        newScaleSetting,
        [trashChannelsIndex, 'series'],
        [
          ...get(newScaleSetting, [trashChannelsIndex, 'series']).filter(
            series => series.key !== customChannel.key
          ),
          customChannel,
        ]
      );
    });

    const offsetPressureKeys = offsetPressures.map(offsetPressure => offsetPressure.key);
    const customChannelKeys = customChannels.map(customChannel => customChannel.key);
    const mappedChemicalsKeys = mappedChemicals.map(chemical => chemical.key);

    // NOTE: remove unavailable custom channels
    newScaleSetting = newScaleSetting.map(item => ({
      ...item,
      series: item.series.filter(
        series =>
          (series.category !== 'offsetPressure' && series.category !== 'customChannels') ||
          (series.category === 'offsetPressure' && offsetPressureKeys.includes(series.key)) ||
          (series.category === 'customChannels' && customChannelKeys.includes(series.key))
      ),
    }));

    const newDataSetting = {
      ...appDataSetting,
      selectedOffsetPressure: appDataSetting.selectedOffsetPressure.filter(seriesKey =>
        offsetPressureKeys.includes(seriesKey)
      ),
      selectedCustomChannels: appDataSetting.selectedCustomChannels.filter(seriesKey =>
        customChannelKeys.includes(seriesKey)
      ),
      selectedVolumeChemical: appDataSetting.selectedVolumeChemical.filter(seriesKey =>
        mappedChemicalsKeys.includes(seriesKey)
      ),
      selectedMassChemical: appDataSetting.selectedMassChemical.filter(seriesKey =>
        mappedChemicalsKeys.includes(seriesKey)
      ),
    };

    onAppSettingChange('dataSetting', newDataSetting, false);
    onAppSettingChange('scaleSetting', newScaleSetting, false);
  }, [data]);

  useEffect(() => {
    const { dataRange, mainData } = editedData;
    if (!witsSubData) return;
    const liveStageIndex = mainData.findIndex(stageData =>
      isRecordInStage(stageData, witsSubData, isAssetViewer)
    );
    if (liveStageIndex === -1) {
      return;
    }
    const firstTimestamp = isLastNActiveSetting(appFilterSetting)
      ? getFirstTimestampBySetting(witsSubData.timestamp, appFilterSetting)
      : null;

    const newDataRange = firstTimestamp
      ? [firstTimestamp, witsSubData.timestamp]
      : [dataRange[0], max([witsSubData.timestamp, dataRange[1]])];

    const newMainData = mainData.map(stageData => {
      if (isRecordInStage(stageData, witsSubData, isAssetViewer)) {
        const converted = convertWitItem(witsSubData, allSeriesTypes);

        const newStageWits = firstTimestamp
          ? [...stageData.wits, converted].filter(wit => wit.timestamp >= firstTimestamp)
          : [...stageData.wits, converted];

        const newPredictions = firstTimestamp
          ? getAdjustedPredictionRecord(
              stageData.predictions,
              firstTimestamp,
              witsSubData.timestamp
            )
          : stageData.predictions;
        const newActivities = firstTimestamp
          ? getAdjustedActivities(stageData.activities, firstTimestamp)
          : stageData.activities;
        const newStageData = {
          ...stageData,
          wits: newStageWits,
          activities: newActivities,
          predictions: newPredictions,
        };

        return newStageData;
      }

      return stageData;
    });
    setAdjustedData(prev => ({
      ...prev,
      mainData: newMainData,
      dataRange: newDataRange,
    }));
  }, [witsSubData, appFilterSetting, allSeriesTypes]);

  useEffect(() => {
    const { mainData } = data;

    const convertedMainData = mainData.map(stageData => {
      const { wits, predictions, activities } = stageData;

      const convertedWits = wits.map(witItem => convertWitItem(witItem, allSeriesTypes));

      const convertedPredictions = predictions
        ? convertPredictionItem(predictions, allSeriesTypes)
        : null;
      const convertedActivities = activities
        ? convertActivityItem(activities[activities.length - 1])
        : [];

      return {
        ...stageData,
        wits: convertedWits,
        predictions: convertedPredictions,
        activities: convertedActivities,
      };
    });

    setAdjustedData({
      ...data,
      mainData: convertedMainData,
    });
  }, [data, allSeriesTypes]);

  useEffect(() => {
    const { mainData } = editedData;
    if (!predictionsSubData) return;
    const liveStageIndex = mainData.findIndex(stageData =>
      isRecordInStage(stageData, predictionsSubData)
    );

    if (liveStageIndex === -1) {
      return;
    }

    const newMainData = mainData.map(stageData => {
      if (isRecordInStage(stageData, predictionsSubData)) {
        const firstTimestamp = isLastNActiveSetting(appFilterSetting)
          ? getFirstTimestampBySetting(predictionsSubData.updated_at, appFilterSetting)
          : null;
        const adjustedPredictinRecord = firstTimestamp
          ? getAdjustedPredictionRecord(
              predictionsSubData,
              firstTimestamp,
              predictionsSubData.updated_at
            )
          : predictionsSubData;
        const predictions = convertPredictionItem(adjustedPredictinRecord, allSeriesTypes);
        const newStageData = {
          ...stageData,
          predictions,
        };

        return newStageData;
      }
      return stageData;
    });

    setAdjustedData(prev => ({
      ...prev,
      mainData: newMainData,
    }));
  }, [predictionsSubData, appFilterSetting]);

  useEffect(() => {
    const { mainData } = editedData;

    const newMainData = mainData.map(stageData => {
      const stageSubData = createActivitySubData
        .filter(sub => !!sub)
        .find(
          record =>
            stageData.asset_id === record.asset_id && stageData.stage_number === record.stage_number
        );
      if (stageSubData) {
        const firstTimestamp = isLastNActiveSetting(appFilterSetting)
          ? getFirstTimestampBySetting(stageSubData.timestamp, appFilterSetting)
          : null;
        const activities = convertActivityItem(stageSubData);
        const adjustedActivities = firstTimestamp
          ? getAdjustedActivities(activities, firstTimestamp)
          : activities;
        const newStageData = {
          ...stageData,
          activities: adjustedActivities,
        };

        return newStageData;
      }
      return stageData;
    });

    setAdjustedData(prev => ({
      ...prev,
      mainData: newMainData,
    }));
  }, [createActivitySubData, appFilterSetting]);

  useEffect(() => {
    const { mainData } = editedData;

    const newMainData = mainData.map(stageData => {
      const stageSubData = updateActivitySubData
        .filter(sub => !!sub)
        .find(
          record =>
            stageData.asset_id === record.asset_id && stageData.stage_number === record.stage_number
        );
      if (stageSubData) {
        const firstTimestamp = isLastNActiveSetting(appFilterSetting)
          ? getFirstTimestampBySetting(stageSubData.timestamp, appFilterSetting)
          : null;
        const activities = convertActivityItem(stageSubData);
        const adjustedActivities = firstTimestamp
          ? getAdjustedActivities(activities, firstTimestamp)
          : activities;
        const newStageData = {
          ...stageData,
          activities: adjustedActivities,
        };

        return newStageData;
      }
      return stageData;
    });

    setAdjustedData(prev => ({
      ...prev,
      mainData: newMainData,
    }));
  }, [updateActivitySubData, appFilterSetting]);

  const updatePredictions = useCallback(
    (
      assetId,
      stageNumber,
      eventName,
      refTimestamp,
      dataItem,
      targetDataIndex,
      returnToThePreviousValue = false
    ) => {
      const { mainData } = editedData;
      const predictionKey = getPredictionKeyByEventName(eventName);
      const targetStageIndex = mainData.findIndex(
        item => item.asset_id === assetId && item.stage_number === stageNumber
      );
      const viewMode = appFilterSetting.viewMode;
      const timestamp = viewMode === 'overlay' ? refTimestamp + dataItem[0] * 60 : dataItem[0];
      const value = dataItem[1];

      const newMainData = mainData.map((stageData, stageIndex) => {
        if (targetStageIndex === stageIndex) {
          const { predictions } = stageData;
          let newPredictions;

          if (
            predictionKey === 'breakdown' ||
            predictionKey === 'isip' ||
            predictionKey === 'opening_wellhead_pressure' ||
            predictionKey === 'target_ramp_rate'
          ) {
            const subData = predictions[predictionKey].map((dataItem, dataIndex) => {
              if (targetDataIndex === dataIndex && !returnToThePreviousValue) {
                return {
                  ...dataItem,
                  timestamp,
                  wellhead_pressure: value,
                };
              }
              return dataItem;
            });
            newPredictions = {
              ...predictions,
              [predictionKey]: subData,
            };
          } else {
            newPredictions = {
              ...predictions,
              [predictionKey]: timestamp,
            };
          }
          return {
            ...stageData,
            predictions: newPredictions,
          };
        }
        return stageData;
      });

      setEditedData(prev => ({
        ...prev,
        mainData: newMainData,
      }));
    },
    [editedData, appFilterSetting.viewMode]
  );

  const cancelEditData = () => {
    setEditedData(adjustedData);
  };

  const saveEditedData = async () => {
    const { mainData: editedMainData } = editedData;
    const { mainData } = adjustedData;
    const newMainData = mainData.map((stageData, index) => {
      const { predictions } = stageData;
      const invalidMSG = getValidation(convertPredictionItemBack(predictions));
      if (!invalidMSG) return editedMainData[index];
      return stageData;
    });

    setAdjustedData(prev => ({
      ...prev,
      mainData: newMainData,
    }));
    const isSaved = await saveEvents(editedMainData);

    if (!isSaved) {
      setAdjustedData(prev => ({
        ...prev,
        mainData,
      }));
    }
  };

  const addDetailData = useCallback(
    async (timeRanges, setDetailLoading, collection) => {
      const { mainData } = adjustedData;

      const newMainData = await loadDataInTimeRange(
        timeRanges,
        mainData,
        allSeriesTypes,
        collection
      );

      setAdjustedData(prev => ({
        ...prev,
        mainData: newMainData,
      }));
      setDetailLoading(false);
    },
    [adjustedData, allSeriesTypes]
  );

  return [editedData, updatePredictions, addDetailData, cancelEditData, saveEditedData];
}
