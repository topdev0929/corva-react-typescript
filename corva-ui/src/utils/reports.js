import { LOCAL_STORAGE_PDF_REPORT_VIEW_KEY } from '~/constants/localStorageKeys';

// NOTE: Define this on the initialization of the app. User can't go to the Reports page from
// another page and vice versa. On report generation Back-end just goes straight to the Reports page
// using JWT in query params
export const isReportsPage = window.parent.location.pathname.startsWith('/reports/');

export const isPDFReportView = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PDF_REPORT_VIEW_KEY) || 'false'
);
