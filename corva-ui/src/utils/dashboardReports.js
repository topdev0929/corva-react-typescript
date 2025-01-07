const Size = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE',
};

export const PIXELS_IN_CM = 37.7952755906;
export const PDF_REPORT_PIXEL_RATIO = PIXELS_IN_CM * 0.5; // NOTE: PDF reports are zoomed

export const getPDFAppPixelSize = ({ width, height }) => ({
  pixelWidth: Math.round(width * PDF_REPORT_PIXEL_RATIO),
  pixelHeight: Math.round(height * PDF_REPORT_PIXEL_RATIO),

  // NOTE: PDF report uses zoom: 0.5 for apps
  realWidth: Math.round(2 * width * PDF_REPORT_PIXEL_RATIO),
  realHeight: Math.round(2 * height * PDF_REPORT_PIXEL_RATIO),
});

const REPORT_APP_GRID_TYPES = {
  NORMAL: {
    type: 'NORMAL',
    columns: { min: 1, max: 7 },
    rows: { min: 1, max: 1000 },
    slots: 1,
    height: 17.5, // NOTE: in CM
    width: 20.8, // NOTE: in CM
  },
  WIDE: {
    type: 'WIDE',
    columns: { min: 8, max: 12 },
    rows: { min: 1, max: 25 },
    slots: 2,
    height: 17.5, // NOTE: in CM
    width: 41.8, // NOTE: in CM
  },
  HALFSCREEN: {
    type: 'HALFSCREEN',
    columns: { min: 8, max: 12 },
    rows: { min: 26, max: 40 },
    slots: 4,
    height: 26.5, // NOTE: in CM
    width: 41.8, // NOTE: in CM
  },
  FULLSCREEN: {
    type: 'FULLSCREEN',
    columns: { min: 8, max: 12 },
    rows: { min: 41, max: 1000 },
    slots: 6, // NOTE: max slots count
    height: 53.3, // NOTE: in CM
    width: 41.8, // NOTE: in CM
  },
};

export function sortPDFDashboardApps(apps) {
  // Sorts apps into their proper order via coordinates

  return apps.concat().sort((a, b) => {
    const ay = a.coordinates.y;
    const by = b.coordinates.y;

    if (ay < by) {
      return -1;
    }
    if (ay > by) {
      return 1;
    }

    if (ay === by) {
      const ax = a.coordinates.x;
      const bx = b.coordinates.x;

      if (ax < bx) {
        return -1;
      }
      if (ax > bx) {
        return 1;
      }
    }

    return 0;
  });
}

export function getAppType(
  { coordinates, isFullScreenReport },
  currentDashboardLayout = 'dashboard'
) {
  if (currentDashboardLayout === 'singleApp' || isFullScreenReport)
    return REPORT_APP_GRID_TYPES.FULLSCREEN;

  const { w, h } = coordinates;

  return Object.values(REPORT_APP_GRID_TYPES).find(
    appType =>
      w >= appType.columns.min &&
      w <= appType.columns.max &&
      h >= appType.rows.min &&
      h <= appType.rows.max
  );
}

// NOTE: This code was extracted from DashboardReport.js. It's not written by dumavit originally
export function getPages(apps, layout) {
  const maxAppSlots = 6;
  const initPage = [];
  const initPages = [initPage];
  let appWasAdded;
  let usedSlotsCount = 0;

  return apps.reduce((pages, app, index) => {
    appWasAdded = false;

    const appType = getAppType(app, layout);
    let { slots, type } = appType;

    if (type !== REPORT_APP_GRID_TYPES.FULLSCREEN.type) {
      const nextApp = apps[index + 1];

      if (nextApp) {
        const nextAppType = getAppType(nextApp, layout);
        // NOTE: Place elements in the correct order and stretch them if necessary
        if (usedSlotsCount % 2 === 0 && slots === 1 && nextAppType.slots % 2 === 0) {
          ({ slots, type } = REPORT_APP_GRID_TYPES.WIDE);
        }
      } else if (index % 2 === 0) {
        ({ slots, type } = REPORT_APP_GRID_TYPES.WIDE);
      }
    }

    usedSlotsCount += slots;

    const newPageApp = { app, slots, reportAppSize: appType };

    const newPages = pages.map(page => {
      if (appWasAdded) return page;

      const filledAppSlots = page.reduce(
        (filledAppSlotsResult, pageApp) => filledAppSlotsResult + pageApp.slots,
        0
      );
      const freeAppSlots = maxAppSlots - filledAppSlots;

      if (freeAppSlots >= slots) appWasAdded = true;

      return freeAppSlots >= slots
        ? [...page, newPageApp] // NOTE: Add an app on a page
        : page;
    });

    return appWasAdded ? newPages : [...newPages, [...initPage, newPageApp]]; // NOTE: Add a page with an app
  }, initPages);
}

export function getPDFAppSize({ w }, maximized = false) {
  if (maximized) return Size.XLARGE;
  if (w >= 5) return Size.LARGE;
  if (w >= 3) return Size.MEDIUM;
  return Size.SMALL;
}
