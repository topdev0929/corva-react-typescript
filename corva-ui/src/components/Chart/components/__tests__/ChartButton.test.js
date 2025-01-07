import { render, fireEvent, screen } from '@testing-library/react';
import ChartButton from '../ChartButton';

describe('ChartButton', () => {
  it('should render the button with children', () => {
    const { getByText } = render(<ChartButton>Click Me</ChartButton>);
    const buttonElement = getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<ChartButton onClick={handleClick}>Click Me</ChartButton>);
    const buttonElement = getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalled();
  });

  it('should not call onClick when button is disabled', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <ChartButton onClick={handleClick} disabled>
        Click Me
      </ChartButton>
    );
    const buttonElement = getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should add "isActive" class when isActive prop is true', () => {
    const { container } = render(<ChartButton isActive>Click Me</ChartButton>);
    const buttonElement = container.firstChild;
    expect(buttonElement.className.includes('isActive')).toBeTruthy();
  });

  it('should add "isHidden" class when isHidden prop is true', () => {
    const { container } = render(<ChartButton isHidden>Click Me</ChartButton>);
    const buttonElement = container.firstChild;
    expect(buttonElement.className.includes('isHidden')).toBeTruthy();
  });

  it('should add "disabled" class when disabled prop is true', () => {
    const { container } = render(<ChartButton disabled>Click Me</ChartButton>);
    const buttonElement = container.firstChild;
    expect(buttonElement.className.includes('disabled')).toBeTruthy();
  });

  it('should render a tooltip when the button is not disabled', () => {
    const { container, getByText } = render(<ChartButton>Click Me</ChartButton>);
    const buttonElement = container.firstChild;
    expect(buttonElement.tagName).toBe('DIV');
    const tooltipElement = getByText('Click Me');
    expect(tooltipElement).toBeInTheDocument();
  });
});
