import { mobileDetect } from '~/utils';
import { GRID_ROW_HEIGHT, GRID_COLUMN_SIZES, DEFAULT_GRID_LAYOUT_PADDING } from '~/constants/apps';

// NOTE: Returns precise pixel sizes
export const getAppSize = ({ coordinates, dashboardWidth, isMaximized }) => {
  return {
    pixelHeight: isMaximized
      ? window.innerHeight - DEFAULT_GRID_LAYOUT_PADDING * 2
      : coordinates.h * (GRID_ROW_HEIGHT + DEFAULT_GRID_LAYOUT_PADDING) -
        DEFAULT_GRID_LAYOUT_PADDING,
    pixelWidth:
      isMaximized || mobileDetect.isMobileDetected || mobileDetect.isNativeDetected
        ? dashboardWidth - DEFAULT_GRID_LAYOUT_PADDING * 2
        : ((dashboardWidth - DEFAULT_GRID_LAYOUT_PADDING) * coordinates.w) /
            GRID_COLUMN_SIZES.large -
          DEFAULT_GRID_LAYOUT_PADDING,
  };
};
