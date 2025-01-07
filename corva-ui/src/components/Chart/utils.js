import { MAX_ZOOM, X_AXIS_RIGHT_GAP, ZOOM_TYPE } from './constants';

export const getXExtremes = chart => chart?.xAxis[0].getExtremes();

export const getYExtremes = chart => chart?.yAxis[0].getExtremes();

export const getChartScale = ({ extremes, step, maxZoom = MAX_ZOOM }) =>
  maxZoom - (extremes.max - extremes.min) / step;

export const getCurrentMinValue = (countedValue, originValue) => {
  if (countedValue <= originValue) {
    return originValue;
  }
  return countedValue;
};

export const getCurrentMaxValue = (countedValue, originValue) => {
  if (countedValue >= originValue) {
    return originValue;
  }
  return countedValue;
};

export const getNextZoomCoordinates = ({ min, max, zoomType, zoomStep, scale }) => {
  if (zoomType === ZOOM_TYPE.zoomIn) {
    if (Math.round(min + zoomStep) === Math.round(max - zoomStep) || scale > MAX_ZOOM - 1) {
      return [min, max];
    }
    return [min + zoomStep, max - zoomStep];
  }

  return [min - zoomStep, max + zoomStep];
};

export const getIsMaxZoom = ({ min, max, zoomStep, zoomType }) => {
  if (zoomType !== ZOOM_TYPE.zoomIn) {
    return false;
  }

  return Math.round(min + zoomStep) === Math.round(max - zoomStep);
};

export const addXAxisNullablePoints = chart => {
  const plotWidth = chart.plotBox.width;

  const { max } = chart.xAxis[0];
  const pointStep = plotWidth / max;

  const newXAxisMax = Math.round((plotWidth + X_AXIS_RIGHT_GAP) / pointStep);
  for (let currentX = max; currentX <= newXAxisMax; currentX += 1) {
    chart.series[0].addPoint([currentX, null], true);
  }
};
