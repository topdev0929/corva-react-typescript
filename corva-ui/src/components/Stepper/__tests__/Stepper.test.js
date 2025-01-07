import { render, screen } from '@testing-library/react';
import Stepper from '../Stepper';

describe('Stepper', () => {
  const steps = [
    { value: 1, label: 'Step 1' },
    { value: 2, label: 'Step 2', disabled: true },
    { value: 3, label: 'Step 3' },
  ];

  it('renders the correct number of steps', () => {
    const { container } = render(<Stepper steps={steps} activeStep={1} />);
    expect(container.querySelectorAll('.step')).toHaveLength(3);
  });

  it('marks steps as checked if they are before the active step', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={3} />);

    expect(getByText('Step 1').classList).toContain('checked');
    expect(getByText('Step 2').classList).toContain('checked');
    expect(getByText('Step 3').classList).not.toContain('checked');
  });

  it('renders the active step', () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const activeStepElement = screen.getByText('Step 1');
    expect(activeStepElement).toHaveClass('active');
  });

  it('renders disabled steps', () => {
    render(<Stepper steps={steps} activeStep={2} />);
    const disabledStepElement = screen.getByText('Step 2');
    expect(disabledStepElement).toHaveClass('disabled');
  });
});
