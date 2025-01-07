import { NOTIFICATION_TRIGGER_TYPES } from '~/constants/notifications';

export const getNotificationMessageByType = (type, triggerObj) => {
  if (
    [
      NOTIFICATION_TRIGGER_TYPES.activityComment,
      NOTIFICATION_TRIGGER_TYPES.dashboardAppAnnotation,
    ].includes(type)
  ) {
    return triggerObj.body;
  }

  if (type === NOTIFICATION_TRIGGER_TYPES.activity) {
    return triggerObj.context.post.body;
  }

  return null;
};

export const getNotificationAttachmentByType = (type, triggerObj) => {
  if (
    [
      NOTIFICATION_TRIGGER_TYPES.activityComment,
      NOTIFICATION_TRIGGER_TYPES.dashboardAppAnnotation,
    ].includes(type)
  ) {
    return triggerObj.attachment;
  }

  if (type === NOTIFICATION_TRIGGER_TYPES.activity) {
    return triggerObj.context.post.attachment;
  }

  return null;
};

export const getNotificationSourceUrl = activityId => (activityId ? `/feed/${activityId}` : null);
