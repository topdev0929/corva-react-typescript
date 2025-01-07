// NOTE: Non-greedy regexp to find the app key from filename
const DEVCENTER_APP_KEY_EXTRACTOR_REGEXP = /corva\.ai\/(.+?)\/packages/;
const PLATFORM_APP_KEY_EXTRACTOR_REGEXP = /app\/(.+?)\/.*\.chunk\.js/;

export function getAppKeyFromStackTrace() {
  const prevStackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 300;

  const error = new Error();
  const match =
    error.stack.match(DEVCENTER_APP_KEY_EXTRACTOR_REGEXP) ||
    error.stack.match(PLATFORM_APP_KEY_EXTRACTOR_REGEXP);

  Error.stackTraceLimit = prevStackTraceLimit;
  return match ? match[1].replace('/app/', '.') : null;
}

export function attachHTTPHeaders({ config, appKey }) {
  const headers = { ...(config.headers || {}) };
  if (appKey) headers['x-corva-app'] = appKey;
  return { ...config, headers };
}
