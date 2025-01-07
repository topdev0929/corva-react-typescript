import { render } from '@testing-library/react';

import { ArrowRight } from '@/components/common/icons/ArrowRight';

describe('ArrowRight', () => {
  it('renders without crashing', () => {
    render(<ArrowRight />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowRight />);
    const arrowRightIcon = getByTestId('arrow-right-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#9E9E9E');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowRight color={color} />);
    const arrowRightIcon = getByTestId('arrow-right-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
