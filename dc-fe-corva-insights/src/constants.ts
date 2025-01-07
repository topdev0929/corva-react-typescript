export const API_PATH = '/api/v1/data';
export const USER_API_PATH = '/v2';

export const API_CONFIG = {
  INSIGHTS_DATASET: 'data.insights.events',
  RECORDS_DATASET: 'data.insights.files',
  PROVIDER: 'corva',
  DEFAULT_LIMIT: 10000,
};

export const SUPPORTED_FILE_MIME_TYPES = [
  'text/csv',
  'text/plain',
  'text/xml',
  'application/json',
  'application/xml',
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/bmp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
];

export const VIEWS = {
  HEADER: 'Header',
  CALENDAR: 'Calendar',
  INSIGHT_FORM: 'InsightForm',
  DAY_PANEL: 'DayPanel',
  APP_SETTINGS: 'AppSettings',
};

export const SCREEN_BREAKPOINTS = {
  MOBILE_SM: 375,
  MOBILE: 599,
  TABLET: 959,
};

export const USER_ROLES = {
  corvaadmin: 'corvaadmin',
};
