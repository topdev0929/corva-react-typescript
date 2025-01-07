import PropTypes from 'prop-types';
import Step from './Step';
import StepsWrapper from './StepsWrapper';
import { SIZES } from './constants';

interface StepperProps extends PropTypes.InferProps<typeof stepperPropTypes> {}

function Stepper({ steps, activeStep, size }: StepperProps): JSX.Element {
  return (
    <StepsWrapper>
      {steps.map(step => (
        <Step
          key={step.value}
          checked={step.value < activeStep}
          active={step.value === activeStep}
          size={size}
          disabled={step.disabled}
          canGoBack={step.canGoBack}
          {...step}
        />
      ))}
    </StepsWrapper>
  );
}

const stepperPropTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape(Step.propTypes)).isRequired,
  activeStep: PropTypes.number,
  size: PropTypes.string,
};

Stepper.propTypes = stepperPropTypes;

Stepper.defaultProps = {
  activeStep: undefined,
  size: SIZES.medium,
};

export default Stepper;
