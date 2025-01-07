import FullScreenLoadingIndicator from './FullScreenLoadingIndicator';
import InlineLoadingIndicator from './InlineLoadingIndicator';
import { loadingIndicatorPropTypes, LoadingIndicatorProps } from "./types";

import { LOADER_HREF, LOADER_DEFAULT_SIZE } from './Loader';

const LoadingIndicator = ({ fullscreen, ...props }: LoadingIndicatorProps): JSX.Element =>
  fullscreen ? <FullScreenLoadingIndicator {...props} /> : <InlineLoadingIndicator {...props} />;

LoadingIndicator.propTypes = loadingIndicatorPropTypes;

LoadingIndicator.defaultProps = {
  fullscreen: true,
  white: true,
  size: LOADER_DEFAULT_SIZE, // NOTE: px
  className: '',
};

LoadingIndicator.LOADER_HREF = LOADER_HREF;
LoadingIndicator.LOADER_DEFAULT_SIZE = LOADER_DEFAULT_SIZE;

export default LoadingIndicator;
