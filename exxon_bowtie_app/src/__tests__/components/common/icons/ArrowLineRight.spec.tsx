import { render } from '@testing-library/react';

import { ArrowLineRight } from '@/components/common/icons/ArrowLineRight';

describe('ArrowLineRight', () => {
  it('renders without crashing', () => {
    render(<ArrowLineRight />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLineRight />);
    const arrowRightIcon = getByTestId('arrow-line-right-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowLineRight color={color} />);
    const arrowRightIcon = getByTestId('arrow-line-right-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
