import { SIZES } from './constants';

export const getSize = contentHeight => {
  if (contentHeight >= 400) return SIZES.LARGE;
  if (contentHeight >= 300) return SIZES.MEDIUM;
  return SIZES.SMALL;
};
