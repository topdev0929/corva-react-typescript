import { render } from '@testing-library/react';
import StepsWrapper from '../StepsWrapper';

describe('StepsWrapper', () => {
  test('renders children', () => {
    const { getByTestId } = render(
      <StepsWrapper>
        <div data-testid="child-1" />
        <div data-testid="child-2" />
      </StepsWrapper>
    );

    expect(getByTestId('child-1')).toBeInTheDocument();
    expect(getByTestId('child-2')).toBeInTheDocument();
  });

  test('renders with correct className', () => {
    const { container } = render(<StepsWrapper className="custom-class">test</StepsWrapper>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
