const devcenterToasts = () => window[Symbol.for('devcenterToasts')];

const toastToConsole = (...args) => {
  // eslint-disable-next-line no-console
  console.log('Toast are not setup: ', ...args);
};

const getToastHandler = handlerName => (...args) => {
  const handler = devcenterToasts()?.[handlerName];
  return handler ? handler(...args) : toastToConsole(...args);
};

export const showToast = getToastHandler('showToast');
