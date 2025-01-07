import { render, screen } from '@testing-library/react';
import Step from '../Step';

describe('Step component', () => {
  const defaultProps = {
    value: 1,
  };

  it('renders the value prop', () => {
    const { getByText } = render(<Step {...defaultProps} />);
    const valueElement = getByText(defaultProps.value.toString());
    expect(valueElement).toBeInTheDocument();
  });

  it('renders the label prop', () => {
    const label = <span>Step 1</span>;
    const { getByText } = render(<Step {...defaultProps} label={label} />);
    const labelElement = getByText('Step 1');
    expect(labelElement).toBeInTheDocument();
  });

  it('applies the active class when the active prop is true', () => {
    const { container } = render(<Step {...defaultProps} active />);
    expect(container.firstChild).toHaveClass('active');
  });

  it('applies the error class when the error prop is true', () => {
    const { container } = render(<Step {...defaultProps} error />);
    expect(container.firstChild).toHaveClass('error');
  });

  it('applies the checked class when the checked prop is true', () => {
    const { container } = render(<Step {...defaultProps} checked />);
    expect(container.firstChild).toHaveClass('checked');
  });

  it('does not apply the checked class when the error prop is true', () => {
    const { container } = render(<Step {...defaultProps} checked error />);
    expect(container.firstChild).not.toHaveClass('checked');
  });

  it('renders CheckIcon when step is checked', () => {
    const { container } = render(<Step {...defaultProps} checked canGoBack={false} />);
    expect(container.getElementsByTagName('svg')).toBeTruthy();
  });
});
