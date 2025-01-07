import { useState, useEffect, useCallback } from 'react';
import { debounce, isEmpty } from 'lodash';
import {
  getChartScale,
  getCurrentMaxValue,
  getCurrentMinValue,
  getIsMaxZoom,
  getNextZoomCoordinates,
  getXExtremes,
  getYExtremes,
} from '../utils';
import { MAX_ZOOM } from '../constants';

export const useZoom = ({ chart }) => {
  const [zoomConfig, setZoomConfig] = useState({});
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);
  const [zoomStatus, setZoomStatus] = useState({
    isReset: true,
    isMax: false,
  });

  const handleIsZoomEnabledChange = isEnabled => {
    setIsZoomEnabled(isEnabled);
  };

  useEffect(() => {
    if (isEmpty(chart)) return;

    const { xAxis, yAxis } = chart;

    const { min: originXMin, max: originXMax } = xAxis?.length ? xAxis[0] : {};
    const { min: originYMin, max: originYMax } = yAxis?.length ? yAxis[0] : {};

    setZoomConfig({
      xStep: (originXMax - originXMin) / MAX_ZOOM,
      yStep: (originYMax - originYMin) / MAX_ZOOM,
      originXMin,
      originXMax,
      originYMin,
      originYMax,
      isMaxZoom: false,
      isZoomReset: true,
    });
  }, [chart]);

  const handleChartSelection = () => {
    setZoomStatus(prevState => ({ ...prevState, isReset: false }));
  };

  const debouncedChartSelection = useCallback(debounce(handleChartSelection, 500), [chart]);

  const handleZoomEvent = zoomType => {
    const xAxisExtremes = getXExtremes(chart);
    const yAxisExtremes = getYExtremes(chart);

    const xScale = getChartScale({ extremes: xAxisExtremes, step: zoomConfig.xStep });
    const yScale = getChartScale({ extremes: yAxisExtremes, step: zoomConfig.yStep });

    const xAxisCoordinates = getNextZoomCoordinates({
      min: xAxisExtremes.min,
      max: xAxisExtremes.max,
      initialMin: zoomConfig.originXMin,
      initialMax: zoomConfig.originXMax,
      zoomStep: zoomConfig.xStep,
      zoomType,
      scale: xScale,
    });

    const yAxisCoordinates = getNextZoomCoordinates({
      min: yAxisExtremes.min,
      max: yAxisExtremes.max,
      initialMin: zoomConfig.originYMin,
      initialMax: zoomConfig.originYMax,
      zoomStep: zoomConfig.yStep,
      zoomType,
      scale: yScale,
    });

    const [minX, maxX] = xAxisCoordinates;
    const [minY, maxY] = yAxisCoordinates;
    const { originXMin, originXMax, originYMax, originYMin } = zoomConfig;

    const currentXMin = getCurrentMinValue(minX, originXMin);
    const currentYMin = getCurrentMinValue(minY, originYMin);
    const currentXMax = getCurrentMaxValue(maxX, originXMax);
    const currentYMax = getCurrentMaxValue(maxY, originYMax);

    const isXMaxZoom = getIsMaxZoom({
      min: minX,
      max: maxX,
      zoomStep: zoomConfig.xStep,
      zoomType,
    });

    const isYMaxZoom = getIsMaxZoom({
      min: minX,
      max: maxX,
      zoomStep: zoomConfig.xStep,
      zoomType,
    });

    const isZoomReset =
      originXMin === currentXMin &&
      originXMax === currentXMax &&
      originYMax === currentYMax &&
      originYMin === currentYMin;

    chart.xAxis[0].setExtremes(
      currentXMin > maxX ? maxX : currentXMin,
      currentXMax < minX ? minX : currentXMax
    );
    chart.yAxis[0].setExtremes(
      currentYMin > maxY ? maxY : currentYMin,
      currentYMax < minY ? minY : currentYMax
    );
    setZoomStatus({ isReset: isZoomReset, isMax: isXMaxZoom && isYMaxZoom });
    if (isZoomReset) {
      setIsZoomEnabled(true);
    }
  };

  const handleResetZoom = () => {
    const { originXMin, originXMax, originYMin, originYMax } = zoomConfig;

    chart.xAxis[0].setExtremes(originXMin, originXMax);
    chart.yAxis[0].setExtremes(originYMin, originYMax);

    setIsZoomEnabled(true);
    setZoomStatus({
      isReset: true,
      isMax: false,
    });
  };

  return {
    zoomStatus,
    debouncedChartSelection,
    isZoomEnabled,
    handleIsZoomEnabledChange,
    handleResetZoom,
    handleZoomEvent,
    zoomConfig,
  };
};
