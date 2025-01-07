import { DamageIndex, DI_STATUS } from './index';
import { DEFAULT_DI_CHANGES } from '../../constants';
import { roundValue } from '../../shared/utils';

const CURRENT_DI_INDEX = 0;

export const isCurrentDIFromList = (index: number): boolean => {
  return index === CURRENT_DI_INDEX;
};

export const sortDIByTime = (list: DamageIndex[]): DamageIndex[] => {
  return list.sort((recordA, recordB) => recordB.time - recordA.time);
};

export const getCurrentDIFromList = (diList: DamageIndex[]): DamageIndex => {
  return diList[CURRENT_DI_INDEX];
};

export const getDIStatus = (diValue: number, safeLimit: number, warnLimit: number): DI_STATUS => {
  if (diValue <= safeLimit) return DI_STATUS.SAFE;
  else if (diValue <= warnLimit) return DI_STATUS.WARN;
  else return DI_STATUS.DANGER;
};

/*
 * The logic to calculate how DI changes through time or depth.
 * */
const getDIChange = (
  currentDI: DamageIndex,
  diList: DamageIndex[],
  checkDIMatch: (di: DamageIndex) => boolean
): number => {
  let secondDI: DamageIndex = currentDI;
  for (let index = 0; index < diList.length; index += 1) {
    const damageIndex = diList[index];
    if (checkDIMatch(damageIndex)) {
      secondDI = damageIndex;
      break;
    }
  }
  return currentDI.value - secondDI.value;
};

const getDIChangeForOneHour = (currentDI: DamageIndex, diList: DamageIndex[]): number => {
  const oneHourInSec = 3600;
  return getDIChange(
    currentDI,
    diList,
    damageIndex => currentDI.time - damageIndex.time >= oneHourInSec
  );
};

const getDIChangeForDepth = (
  currentDI: DamageIndex,
  diList: DamageIndex[],
  depth: number
): number => {
  return getDIChange(
    currentDI,
    diList,
    damageIndex => currentDI.depth - damageIndex.depth >= depth
  );
};

export const generateDIChanges = (di: DamageIndex | null, diList: DamageIndex[]) => {
  if (!di || !diList) return DEFAULT_DI_CHANGES;
  return [
    {
      ...DEFAULT_DI_CHANGES[0],
      value: roundValue(getDIChangeForOneHour(di, diList)),
    },
    {
      ...DEFAULT_DI_CHANGES[1],
      value: roundValue(getDIChangeForDepth(di, diList, Number(DEFAULT_DI_CHANGES[1].label))),
    },
    {
      ...DEFAULT_DI_CHANGES[2],
      value: roundValue(getDIChangeForDepth(di, diList, Number(DEFAULT_DI_CHANGES[2].label))),
    },
  ];
};
