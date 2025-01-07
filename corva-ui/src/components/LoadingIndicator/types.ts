import PropTypes from 'prop-types';

export const loaderPropTypes = {
  white: PropTypes.bool,
  size: PropTypes.number,
};

export const screenLoadingIndicatorPropTypes = {
  ...loaderPropTypes,
  className: PropTypes.string,
};

export const loadingIndicatorPropTypes = {
  ...screenLoadingIndicatorPropTypes,
  fullscreen: PropTypes.bool,
};

export interface LoaderProps extends PropTypes.InferProps<typeof loaderPropTypes> {}
export interface FullScreenLoadingIndicatorProps extends PropTypes.InferProps<typeof screenLoadingIndicatorPropTypes> {}
export interface InlineLoadingIndicatorProps extends PropTypes.InferProps<typeof screenLoadingIndicatorPropTypes> {}
export interface LoadingIndicatorProps extends PropTypes.InferProps<typeof loadingIndicatorPropTypes> {}