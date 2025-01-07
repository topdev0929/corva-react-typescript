import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './StepsWrapper.css';

interface StepsWrapperProps extends PropTypes.InferProps<typeof stepsWrapperPropTypes> {}

function StepsWrapper({ children, className }: StepsWrapperProps): JSX.Element {
  return <div className={classNames(styles.container, className)}>{children}</div>;
}

const stepsWrapperPropTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

StepsWrapper.propTypes = stepsWrapperPropTypes;

StepsWrapper.defaultProps = {
  className: '',
};

export default StepsWrapper;
