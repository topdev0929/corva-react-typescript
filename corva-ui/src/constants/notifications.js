import { List } from 'immutable';

export const NAME = 'notifications';

export const ADD_NEW_NOTIFICATION = 'ADD_NEW_NOTIFICATION';
export const INCREASE_UNREAD_NOTIFICATIONS_COUNT = 'INCREASE_UNREAD_NOTIFICATIONS_COUNT';
export const CLEAR_UNREAD_NOTIFICATIONS_COUNT = 'CLEAR_UNREAD_NOTIFICATIONS_COUNT';
export const SET_UNREAD_NOTIFICATIONS_COUNT = 'SET_UNREAD_NOTIFICATIONS_COUNT';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const ADD_NOTIFICATIONS = 'ADD_NOTIFICATIONS';
export const NOTIFICATIONS_LOADING_ATTEMPT = 'NOTIFICATIONS_LOADING_ATTEMPT';
export const NOTIFICATIONS_LOADING_ERROR = 'NOTIFICATIONS_LOADING_ERROR';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const NOTIFICATION = {
  SUBSCRIPTIONS: [
    {
      collection: 'notification',
    },
  ],
};

export const NOTIFICATION_TRIGGER_TYPES = {
  activity: 'Activity',
  activityComment: 'Comment',
  activityLike: 'Like',
  dashboardAppAnnotation: 'DashboardAppAnnotation',
  // alert: 'Alert',
};

export const SIDEBAR_FILTERS = {
  DATE_RANGE_FILTERS: [
    // NOTE: Order matters in handleChangeDateRangeFilter and renderDateRangeFilters
    { label: 'All', value: 'all' },
    { label: 'Last 12 hours', value: 'last12hours' },
    { label: 'Last 24 hours', value: 'last24hours' },
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last month', value: 'lastMonth' },
    { label: 'Custom', value: 'custom' },
  ],

  CONTENT_TYPE_FILTERS: [
    { label: 'Feed post', value: 'activity', trigger: NOTIFICATION_TRIGGER_TYPES.activity },
    { label: 'Comment', value: 'comment', trigger: NOTIFICATION_TRIGGER_TYPES.activityComment },
    { label: 'Like', value: 'Like', trigger: NOTIFICATION_TRIGGER_TYPES.activityLike },
    {
      label: 'Annotation',
      value: 'dashboard_app_annotation',
      trigger: NOTIFICATION_TRIGGER_TYPES.dashboardAppAnnotation,
    },
    // { label: 'Alert', value: 'alert', trigger: NOTIFICATION_TRIGGER_TYPES.alert },
  ],
};

export const defaultContentTypesFilter = List(
  SIDEBAR_FILTERS.CONTENT_TYPE_FILTERS.reduce((result, { value }) => [...result, value], [])
);

export const defaultRequestFilters = {
  triggerType: defaultContentTypesFilter.toArray(),
  perPage: 20,
  sort: 'created_at',
  order: 'desc',
};

export const NOTIFICATION_VARIANTS = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
  neutral: 'neutral',
};
