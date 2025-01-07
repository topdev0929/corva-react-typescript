export const MIXPANEL_ACTION_TYPES = {
  PAGE: {
    VIEW: 'Page view',
    PASSIVE_VIEW: 'Page view - Passive',
  },

  DASHBOARD: {
    CREATE: 'Dashboard - Create',
    SCHEDULE_REPORT: 'Dashboard - Scheduled Report',
    DOWNLOAD_REPORT: 'Dashboard - Download Report',
    SHARE: 'Dashboard - Share',
  },

  APP: {
    ADD_TO_DASHBOARD: 'App - Add to Dashboard',
    VIEW: 'App - View',
    SETTINGS: 'App - Settings',
    SHARE: 'App - Share',
    EXPORT: 'App - Export',
    ZOOM_IN: 'App - Zoom In',
    ZOOM_OUT: 'App - Zoom Out',
    JUMP: 'App - Jump',
    TO_DEFAULT_VIEW: 'App - To Default View',
    MOVE_TIME_WINDOW_UP: 'App - Move Time Window Up',
    MOVE_TIME_WINDOW_DOWN: 'App - Move Time Window Down',
  },
};

export const MIXPANEL_DASHBOARD_ACTION_TYPES = Object.values(MIXPANEL_ACTION_TYPES.DASHBOARD);
export const MIXPANEL_APP_ACTION_TYPES = Object.values(MIXPANEL_ACTION_TYPES.APP);
export const MIXPANEL_PAGE_TYPES = Object.values(MIXPANEL_ACTION_TYPES.PAGE);

export const LOG_APP_VIEW_DELAY = 5000; // NOTE: 5 seconds to define that user looks on an App
