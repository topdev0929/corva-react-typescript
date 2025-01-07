import {
  FIT_IN_STATUS,
  FitInParameters,
  FitInParametersType,
  OptimizationParameters,
} from './index';

import { DamageIndex } from '../damage-index';
import { FIT_IN_PERCENTS } from '../../constants';

const LAST_OP_INDEX = 0;

export const getLastOptimizationParameters = (
  list: OptimizationParameters[]
): OptimizationParameters => {
  return list[LAST_OP_INDEX];
};

export const getFitInPercent = (fitInParameters: FitInParameters): number => {
  const { max, min, real } = fitInParameters;
  const minMaxDiff = max - min;
  const minRealDiff = real - min;
  const fitInPercent = (minRealDiff / minMaxDiff) * 100;
  return Math.min(Math.max(fitInPercent, FIT_IN_PERCENTS.LOW_DANGER), FIT_IN_PERCENTS.HIGH_DANGER);
};

export const getFitInStatus = (fitInParameters: FitInParameters): FIT_IN_STATUS => {
  const fitInPercent = getFitInPercent(fitInParameters);
  if (fitInPercent === FIT_IN_PERCENTS.LOW_DANGER || fitInPercent === FIT_IN_PERCENTS.HIGH_DANGER) {
    return FIT_IN_STATUS.DANGER;
  }
  if (fitInPercent <= FIT_IN_PERCENTS.LOW_WARN || fitInPercent >= FIT_IN_PERCENTS.HIGH_WARN) {
    return FIT_IN_STATUS.WARN;
  }
  return FIT_IN_STATUS.SAFE;
};

export const sortParametersByTime = (list: OptimizationParameters[]): OptimizationParameters[] => {
  return list.sort((recordA, recordB) => recordB.time - recordA.time);
};

export const generateFitInParameters = (
  parameters: OptimizationParameters | null,
  di: DamageIndex | null,
  type: FitInParametersType
): FitInParameters[] => {
  if (!parameters || !di) return [];
  return [
    {
      min: parameters[`low${type}WeightOnBit`],
      max: parameters[`high${type}WeightOnBit`],
      real: di.weightOnBit,
      id: `${type}_weightOnBit`,
      type,
    },
    {
      min: parameters[`low${type}RotaryRPM`],
      max: parameters[`high${type}RotaryRPM`],
      real: di.rotaryRPM,
      id: `${type}_rotaryRPM`,
      type,
    },
    {
      min: parameters[`low${type}MudFlowIn`],
      max: parameters[`high${type}MudFlowIn`],
      real: di.mudFlowIn,
      id: `${type}_mudFlowIn`,
      type,
    },
  ];
};
