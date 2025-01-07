import classNames from 'classnames';
import Loader from './Loader';
import { screenLoadingIndicatorPropTypes, FullScreenLoadingIndicatorProps } from "./types";
import styles from './LoadingIndicator.css';

const FullScreenLoadingIndicator = (props: FullScreenLoadingIndicatorProps): JSX.Element => {
  const { white, size, className } = props;

  return (
    <div className={classNames(styles.appLoading, className)}>
      <div className={styles.appLoadingGrid}>
        <div className={styles.appLoadingInner}>
          <Loader white={white} size={size} />
        </div>
      </div>
    </div>
  );
};

FullScreenLoadingIndicator.propTypes = screenLoadingIndicatorPropTypes;

FullScreenLoadingIndicator.defaultProps = {
  white: true,
  size: 80, // NOTE: px
  className: '',
};

export default FullScreenLoadingIndicator;
