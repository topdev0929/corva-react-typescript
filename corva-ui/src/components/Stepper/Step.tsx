import classNames from 'classnames';

import PropTypes from 'prop-types';
import { SIZES } from './constants';
import styles from './Step.css';

interface CheckIconProps {
  size: number;
}

const CheckIcon = ({ size }: CheckIconProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0001 10.7799L3.2201 7.9999L2.27344 8.9399L6.0001 12.6666L14.0001 4.66656L13.0601 3.72656L6.0001 10.7799Z"
      fill="white"
    />
  </svg>
);

interface StepProps extends PropTypes.InferProps<typeof stepPropTypes> {}

function Step({
  value,
  checked,
  active,
  error,
  disabled,
  size,
  canGoBack,
  label,
  className,
}: StepProps): JSX.Element {
  return (
    <div
      className={classNames(
        styles.step,
        styles[size],
        active && styles.active,
        error && styles.error,
        checked && !error && styles.checked,
        disabled && styles.disabled,
        className
      )}
    >
      <div className={styles.stepCircle}>
        {checked && !error && !canGoBack ? (
          <CheckIcon size={size === SIZES.large ? 24 : 16} />
        ) : (
          value
        )}
      </div>
      {label}
    </div>
  );
}

const stepPropTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.node,
  checked: PropTypes.bool,
  active: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  canGoBack: PropTypes.bool,
  className: PropTypes.string,
};

Step.propTypes = stepPropTypes;

Step.defaultProps = {
  checked: false,
  active: false,
  error: false,
  disabled: false,
  size: SIZES.medium,
  canGoBack: true,
  label: '',
  className: '',
};

export default Step;
