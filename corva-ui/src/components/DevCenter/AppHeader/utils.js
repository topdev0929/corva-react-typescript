export const APP_LAYOUT_SIZES = {
  EXTRA_LARGE: 'EXTRA_LARGE',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
};

const APP_WIDTH_DEMENSIONS = {
  EXTRA_LARGE: 1440,
  LARGE: 960,
  MEDIUM: 600,
  SMALL: 428,
};

export const getAppDimension = appCoordinatesWidth => {
  if (appCoordinatesWidth <= APP_WIDTH_DEMENSIONS.SMALL) {
    return APP_LAYOUT_SIZES.SMALL;
  } else if (appCoordinatesWidth <= APP_WIDTH_DEMENSIONS.MEDIUM) {
    return APP_LAYOUT_SIZES.MEDIUM;
  } else if (appCoordinatesWidth <= APP_WIDTH_DEMENSIONS.LARGE) {
    return APP_LAYOUT_SIZES.LARGE;
  } else return APP_LAYOUT_SIZES.EXTRA_LARGE;
};
