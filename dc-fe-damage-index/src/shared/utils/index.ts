import _ from 'lodash';
import moment from 'moment';

export const roundValue = (value: number, precision?: number): number => {
  return _.ceil(value, precision || 2);
};

export const setAlphaInRGBA = (rgba: string, alpha: number) => {
  const rgbaComponents = rgba
    .substring(5, rgba.length - 1)
    .replace(/ /g, '')
    .split(',');
  return `rgba(${rgbaComponents[0]}, ${rgbaComponents[1]}, ${rgbaComponents[2]}, ${alpha})`;
};

export const debounce = (func, wait: number) => {
  let timeout;
  return () => {
    const later = () => {
      timeout = null;
      func.apply();
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', options).format(value);
};

export const formatNumberPrecision = (value: number, precisionOrUndefined?: number): string => {
  const precision = precisionOrUndefined || 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(value);
};

export const formatAMPMDate = (timestamp: number): string => {
  return moment(timestamp).format('MM/DD/YYYY hh:mm A');
};

export const formatDate = (timestamp: number): string => {
  return moment(timestamp).format('MM/DD/YYYY HH:mm');
};

export const formatShortDate = (timestamp: number): string => {
  return moment(timestamp).format('MM/DD/YY');
};
