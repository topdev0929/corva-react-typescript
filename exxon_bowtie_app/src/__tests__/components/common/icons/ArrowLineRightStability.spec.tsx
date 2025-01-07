import { render } from '@testing-library/react';

import { ArrowLineRightStability } from '@/components/common/icons/ArrowLineRightStability';

describe('ArrowLineRightStability', () => {
  it('renders without crashing', () => {
    render(<ArrowLineRightStability />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLineRightStability />);
    const arrowRightIcon = getByTestId('arrow-line-right-stability-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#BDBDBD';
    const { getByTestId } = render(<ArrowLineRightStability color={color} />);
    const arrowRightIcon = getByTestId('arrow-line-right-stability-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
