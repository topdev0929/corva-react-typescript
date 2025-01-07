import { Well, WellOption } from './index';
import { LINE_CHART_CONFIG } from '../../constants';

export const toWellsOptions = (wells: Well[]): WellOption[] => {
  return wells.map(well => ({
    value: well.assetId,
    label: well.name,
  }));
};

const getRandomWellColor = () => {
  const max = LINE_CHART_CONFIG.COLORS.length - 1;
  const index = Math.floor(Math.random() * max);
  return LINE_CHART_CONFIG.COLORS[index];
};

export const getWellColor = (isActive: boolean, wellIndex?: number): string => {
  if (isActive) return LINE_CHART_CONFIG.CURRENT_WELL_COLOR;
  if ((wellIndex || wellIndex === 0) && wellIndex <= LINE_CHART_CONFIG.COLORS.length - 1) {
    return LINE_CHART_CONFIG.COLORS[wellIndex];
  }
  return getRandomWellColor();
};

export const generateWellsKey = (wells: Well[]): string => {
  return wells.map(well => well.name).join('::');
};
