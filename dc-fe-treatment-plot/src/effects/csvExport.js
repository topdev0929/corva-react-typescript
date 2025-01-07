import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { jsonApi } from '@corva/ui/clients';
import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from '@corva/ui/utils';

import { compact } from 'lodash';
import { DYNAMIC_MENUS, TIME_RANGES } from '../constants';
import { METADATA } from '../meta';

const MAX_DAYS_IN_SECONDS = 7 * 24 * 3600;
const SECONDS_PER_DAY = 60 * 60 * 24;
const MAX_STAGES = 50;

export function useCsvExportMenuItems(registerMenuItems, handleDownloadCSV) {
  useEffect(() => {
    const dynamicMenus = [
      {
        ...DYNAMIC_MENUS.download,
        onClick: handleDownloadCSV,
      },
    ];
    registerMenuItems(dynamicMenus);
  }, [registerMenuItems, handleDownloadCSV]);
}

const getChannels = collection => {
  if (collection === METADATA.collections.wits) return {};
  if (collection === METADATA.collections.wits10s)
    return {
      channels: {
        value: '^((median.*)|(timestamp))$',
        strategy: 'match',
        removePrefixes: ['median'],
      },
    };

  return { channels: { value: '^((median.*)|(timestamp))$', strategy: 'match' } };
};

const getFinalTimestamp = (isLive, latestData) => {
  return isLive ? moment().unix() : latestData.timestamp;
};

export function useExportRangeValidation({ timeRangeType, timeRange, selectedStages, stageTimes }) {
  const [isExport1sDisabled, setIsExport1sDisabled] = useState(false);
  const [isExport10sDisabled, setIsExport10sDisabled] = useState(false);
  const [exportRequestType, setExportRequestType] = useState(METADATA.collections.wits);
  const [isExportRangeTooBig, setIsExportRangeTooBig] = useState(false);
  const [isExportButtonDisabled, setIsExportButtonDisabled] = useState(false);
  const [emptyStages, setEmptyStages] = useState([]);

  useEffect(() => {
    const isTimeRange = timeRangeType === TIME_RANGES.specificTimeRange.key;
    const isStagesRange = timeRangeType === TIME_RANGES.specificStages.key;
    const timeRangeInSeconds = moment(timeRange.to).unix() - moment(timeRange.from).unix();

    if (
      (isTimeRange && isNaN(timeRangeInSeconds)) ||
      (isStagesRange && selectedStages.length < 1)
    ) {
      setIsExportRangeTooBig(false);
      return setIsExportButtonDisabled(true);
    }

    if (
      (isTimeRange && timeRangeInSeconds <= SECONDS_PER_DAY) ||
      (isStagesRange && selectedStages.length <= 5)
    ) {
      setIsExport1sDisabled(false);
      setIsExport10sDisabled(false);
      setIsExportRangeTooBig(false);
      setIsExportButtonDisabled(false);
      setExportRequestType(METADATA.collections.wits);
    } else if (
      (isTimeRange && timeRangeInSeconds <= MAX_DAYS_IN_SECONDS) ||
      (isStagesRange && selectedStages.length <= 50)
    ) {
      setIsExport1sDisabled(true);
      setIsExport10sDisabled(false);
      setIsExportRangeTooBig(false);
      setIsExportButtonDisabled(false);
      setExportRequestType(METADATA.collections.wits10s);
    } else {
      setIsExport1sDisabled(true);
      setIsExport10sDisabled(true);
      setIsExportRangeTooBig(true);
      setIsExportButtonDisabled(true);
    }

    if (isStagesRange) {
      const emptyStagesArray = [];
      selectedStages.map(stageNumber => {
        const stageTimeRecord = stageTimes.find(record => record.stage_number === stageNumber);
        if (!stageTimeRecord) {
          emptyStagesArray.push(stageNumber);
        }
        setEmptyStages(emptyStagesArray);
      });
      setIsExportButtonDisabled(emptyStagesArray.length === selectedStages.length);
    }
  }, [timeRangeType, timeRange.to, timeRange.from, String(selectedStages)]);

  return {
    isExport1sDisabled,
    isExport10sDisabled,
    exportRequestType,
    isExportRangeTooBig,
    isExportButtonDisabled,
    onExportRequestTypeSet: type => setExportRequestType(type),
    emptyStages,
  };
}

export function useCsvExport({
  onCancel,
  timeRangeType,
  timeRange,
  selectedStages,
  assetId,
  stageTimes,
  companyId,
  latestWitsData,
  isLive,
  exportRequestType,
}) {
  const rtFileDownloadTaskId = useRef(null);
  const rtFileDownloadTaskPoolingHandler = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // NOTE: Download realtime files
  const cancelPoolJob = () => {
    clearInterval(rtFileDownloadTaskPoolingHandler.current);
    rtFileDownloadTaskPoolingHandler.current = null;
    setIsLoading(false);
    onCancel();
  };

  const poolRTFileDownloadTask = async () => {
    const taskId = rtFileDownloadTaskId.current;
    if (taskId) {
      try {
        const { payload, state, fail_reason } = await jsonApi.getTask(taskId);
        if (state === 'failed') {
          console.error('Failed!', fail_reason);
          showErrorNotification(fail_reason);
          cancelPoolJob();
          return;
        } else if (state === 'succeeded') {
          showSuccessNotification('The data exported successfully');
          window.open(payload.url, '_parent');
          rtFileDownloadTaskId.current = null;
          cancelPoolJob();
        } else if (state === 'running') {
          // Do nothing
        }
      } catch (e) {
        console.error(e);
        showErrorNotification('Download request failed');
        cancelPoolJob();
      }
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    // NOTE: validation to export csv
    if (
      timeRangeType === 'specificTimeRange' &&
      moment(timeRange.to).unix() - moment(timeRange.from).unix() > MAX_DAYS_IN_SECONDS
    ) {
      console.error('Time range should not be more than 7 days');
      showErrorNotification('Time range should not be more than 7 days');
      return;
    }
    if (timeRangeType === 'specificStages' && selectedStages.length > MAX_STAGES) {
      console.error('The count of selected stages should not be more than 10');
      return;
    }

    // NOTE: make proper payload
    let exportInterval = [];

    if (timeRangeType === TIME_RANGES.specificTimeRange.key) {
      exportInterval = [
        {
          from: moment(timeRange.from).unix(),
          to: moment(timeRange.to).unix(),
        },
      ];
    }

    if (timeRangeType === TIME_RANGES.specificStages.key) {
      exportInterval = compact(
        selectedStages.map(stageNumber => {
          const stageTimeRecord = stageTimes.find(record => record.stage_number === stageNumber);
          return stageTimeRecord
            ? {
                from: stageTimeRecord.data.stage_start,
                to: stageTimeRecord.data.stage_end || getFinalTimestamp(isLive, latestWitsData),
              }
            : undefined;
        })
      );
    }

    const collection = exportRequestType;
    const task = {
      provider: 'corva',
      companyId,
      app_key: 'tasks.dataset-export-task',
      asset_id: assetId,
      properties: {
        segment: 'completion',
        type: 'realtime-download',
        collection,
        ...getChannels(collection),
        ...(exportInterval.length
          ? {
              exportInterval,
            }
          : {}),
      },
    };

    try {
      const { id } = await jsonApi.postTask({ task });
      rtFileDownloadTaskId.current = id;
      rtFileDownloadTaskPoolingHandler.current = setInterval(poolRTFileDownloadTask, 1500);
      showInfoNotification('The data export is running');
    } catch (e) {
      console.error(e);
    }
  };

  return {
    handleExport,
    isLoading,
  };
}
