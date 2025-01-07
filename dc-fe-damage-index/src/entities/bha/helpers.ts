import { BHA, BHAOption, BHAsMap } from './index';

export const toBHAsOptions = (bhas: BHA[]): BHAOption[] => {
  return bhas.map(well => ({
    value: well.name,
    label: well.name,
  }));
};

export const sortBHAs = (bhas: BHA[]): BHA[] => {
  return bhas.sort((firstBHA, secondBHA) => {
    return firstBHA.timestamp - secondBHA.timestamp;
  });
};

export const convertBHAListToMap = (bhas: BHA[]): BHAsMap => {
  const map: BHAsMap = new Map();
  bhas.forEach(bha => map.set(bha.id, true));
  return map;
};
