import { sortBy } from 'lodash';

import { getTextWidth } from '@/utils/textWidth';
import { GroupedWitsData } from '@/types/Data';
import { StageCaptionInfo } from './types';
import { TimeRange } from '../ChartSlider/types';
import { SUCCESS_COLOR } from '@/constants';

const AVG_CHAR_WIDTH = 6;
const STAGE_NAME_GAP_WIDTH = 4;
const ELLIPSIS_SIZE = 2;

const formatNameFragment = (fragment: string): string => {
  return fragment
    .trim()
    .replace(/^[,_-]+/, '')
    .replace(/[,_-]+$/, '')
    .trim();
};
export const calculateStageNameItemStyles = (
  parameters: {
    assetTimeLimits: TimeRange;
    secondsPerPixel: number;
    isSingleStage: boolean;
    isLive: boolean;
  } & StageCaptionInfo
): { styles: { left: number; width: number | string; color: string }; isZoomedIn: boolean } => {
  const { firstTimestamp, lastTimestamp, secondsPerPixel, assetTimeLimits, isSingleStage, isLive } =
    parameters;

  const stageWidth = lastTimestamp - firstTimestamp;

  return {
    styles: {
      left: isSingleStage ? 0 : (firstTimestamp - assetTimeLimits.startValue) / secondsPerPixel,
      width: isSingleStage ? '100%' : stageWidth / secondsPerPixel,
      color: isLive ? SUCCESS_COLOR : undefined,
    },
    isZoomedIn: assetTimeLimits.endValue - assetTimeLimits.startValue < stageWidth,
  };
};

export const getStageNamesInfo = ({
  data,
  isZoomedIn,
  isAssetViewer,
}: {
  data: GroupedWitsData[];
  isZoomedIn: boolean;
  isAssetViewer: boolean;
}): StageCaptionInfo[] => {
  if (!data.length) return [];
  const sortedData = sortBy(data, item => item.wits.at(0)?.timestamp);
  const result = [];

  if (isAssetViewer) {
    return [
      {
        firstTimestamp: sortedData.at(0)?.wits.at(0)?.timestamp,
        lastTimestamp: sortedData.at(-1)?.wits.at(-1)?.timestamp,
        stageNumber: 0,
        assetName: sortedData.at(-1).asset_name,
      },
    ];
  }

  for (let i = 0; i < sortedData.length; i++) {
    const currentStage = sortedData[i] || { wits: [], stage_number: 0, asset_name: '' };
    const currentStageFirstTimestamp = currentStage?.wits.at(0)?.timestamp;
    const currentStageLastTimestamp = currentStage?.wits.at(-1)?.timestamp;

    const nextStage = sortedData[i + 1] || {
      wits: [{ timestamp: currentStageLastTimestamp }],
    };
    result.push({
      firstTimestamp: currentStageFirstTimestamp,
      lastTimestamp: isZoomedIn
        ? Math.min(currentStageLastTimestamp, nextStage.wits?.at(0)?.timestamp)
        : nextStage.wits?.at(0)?.timestamp,
      stageNumber: currentStage.stage_number,
      assetName: currentStage.asset_name,
    });
  }

  return result;
};

export const getTruncatedAssetName = (
  containerWidth: number | string,
  stageNumber: number,
  assetName: string
) => {
  // for '100%' width in the single stage
  if (typeof containerWidth === 'string') {
    return {
      assetName,
      tooltip: '',
    };
  }

  const result = {
    assetName,
    tooltip: '',
  };
  const stageNumberWidth = stageNumber ? getTextWidth(`${stageNumber} `, 14) : 0;
  const realContainerWidth = containerWidth - stageNumberWidth - STAGE_NAME_GAP_WIDTH;

  if (realContainerWidth < assetName.length * AVG_CHAR_WIDTH) {
    const wellNameRealWidth = getTextWidth(assetName);
    if (wellNameRealWidth > realContainerWidth) {
      let maxCounts = Math.floor(realContainerWidth / (wellNameRealWidth / assetName.length));
      if (maxCounts <= 1) {
        result.assetName = '';
      } else if (maxCounts <= 3) {
        result.assetName = formatNameFragment(assetName.slice(0, maxCounts));
      } else {
        // count in "..." in caption
        maxCounts -= ELLIPSIS_SIZE;
        const assetNameStart = formatNameFragment(assetName.substring(0, maxCounts / 2));
        const assetNameEnd = formatNameFragment(assetName.slice(-maxCounts / 2));
        result.assetName = `${assetNameStart}...${assetNameEnd}`;
      }
      result.tooltip = `${stageNumber || ''} ${assetName}`;
    }
  }

  return result;
};
