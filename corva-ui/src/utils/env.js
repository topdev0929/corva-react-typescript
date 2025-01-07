export const isDevOrQAEnv =
  process.env.REACT_APP_ENVIRONMENT === 'qa' || process.env.REACT_APP_ENVIRONMENT === 'development';
export const isBetaEnv = process.env.REACT_APP_ENVIRONMENT === 'beta';
export const isProdEnv = process.env.REACT_APP_ENVIRONMENT === 'production';
