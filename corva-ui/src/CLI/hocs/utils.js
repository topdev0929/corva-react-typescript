import { LOCAL_STORAGE_PDF_REPORT_VIEW_KEY } from './constants';

// NOTE: it is imported in @corva/dc-platform-shared
// TODO: fix imports in that package and remove whole CLI dir

export const isPDFReportView = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PDF_REPORT_VIEW_KEY) || 'false'
);
