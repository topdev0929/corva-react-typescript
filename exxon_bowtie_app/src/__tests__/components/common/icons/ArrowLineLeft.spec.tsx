import { render } from '@testing-library/react';

import { ArrowLineLeft } from '@/components/common/icons/ArrowLineLeft';

describe('ArrowLineLeft', () => {
  it('renders without crashing', () => {
    render(<ArrowLineLeft />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLineLeft />);
    const arrowRightIcon = getByTestId('arrow-line-left-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowLineLeft color={color} />);
    const arrowRightIcon = getByTestId('arrow-line-left-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
