const notificationToasts = () => window[Symbol.for('notificationToasts')];

const notifyToConsole = (...args) => {
  // eslint-disable-next-line no-console
  console.log('Notifications are not setup: ', ...args);
};

const getHandler = handlerName => (...args) => {
  const handler = notificationToasts()?.[handlerName];
  return handler ? handler(...args) : notifyToConsole(...args);
};

export const createNotification = getHandler('createNotification');
export const removeNotification = getHandler('removeNotification');
export const showErrorNotification = getHandler('showErrorNotification');
export const showInfoNotification = getHandler('showInfoNotification');
export const showNeutralNotification = getHandler('showNeutralNotification');
export const showSuccessNotification = getHandler('showSuccessNotification');
export const showWarningNotification = getHandler('showWarningNotification');
