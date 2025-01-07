import classNames from 'classnames';
import Loader from './Loader';
import { screenLoadingIndicatorPropTypes, InlineLoadingIndicatorProps } from "./types";
import styles from './LoadingIndicator.css';

const InlineLoadingIndicator = (props: InlineLoadingIndicatorProps): JSX.Element => {
  const { white, size, className } = props;

  return (
    <div className={classNames(styles.appLoadingInline, className)}>
      <Loader white={white} size={size} />
    </div>
  );
};

InlineLoadingIndicator.propTypes = screenLoadingIndicatorPropTypes;

InlineLoadingIndicator.defaultProps = {
  white: true,
  size: 80, // NOTE: px
  className: '',
};

export default InlineLoadingIndicator;
