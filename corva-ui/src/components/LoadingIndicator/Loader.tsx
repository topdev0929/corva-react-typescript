import { loaderPropTypes, LoaderProps } from "./types";
import styles from './LoadingIndicator.css';

const PAGE_NAME = 'loader';
export const LOADER_HREF = 'https://cdn.corva.ai/app/images/corva-loading-icon.gif';
export const LOADER_DEFAULT_SIZE = 80;

const Loader = (props: LoaderProps): JSX.Element => {
  const { white, size } = props;

  return (
    <img
      data-testid={`${PAGE_NAME}_image`}
      className={`${styles.cLoader} ${white ? '' : styles.cLoaderBlack}`}
      style={{ width: size, height: size }}
      src={LOADER_HREF}
      alt="Corva Loader"
    />
  );
};

Loader.propTypes = loaderPropTypes;

Loader.defaultProps = {
  white: true,
  size: LOADER_DEFAULT_SIZE, // NOTE: px
};

export default Loader;
