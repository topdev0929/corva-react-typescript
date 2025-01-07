import { isReportsPage } from '~/utils/reports';

export const isLoggingToGoogleAnalytics =
  (process.env.REACT_APP_ENVIRONMENT === 'production' ||
    process.env.REACT_APP_ENVIRONMENT === 'beta') &&
  !isReportsPage;
