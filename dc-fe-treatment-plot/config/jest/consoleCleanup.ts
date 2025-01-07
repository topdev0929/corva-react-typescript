/* eslint-disable no-console */
const ignoreConsoleMessages = (): void => {
  const ignoreConsoleMessages = {
    error: [
      'Warning: Failed %s type',
      'Warning: useLayoutEffect does nothing on the server',
      'Warning: Each child in a list should h',
    ],
    warn: ['Material-UI: The `css` function is deprecated', 'Warning: componentWillReceiveProps'],
    log: ['Highcharts warning #26'],
  };

  Object.entries(ignoreConsoleMessages).forEach(([key, ignoreItems]) => {
    const original = console[key];
    console[key] = (...args) => {
      if (ignoreItems.some(ignored => RegExp(ignored).test(args[0]))) return;
      original(...args);
    };
  });
};

ignoreConsoleMessages();

export {};
