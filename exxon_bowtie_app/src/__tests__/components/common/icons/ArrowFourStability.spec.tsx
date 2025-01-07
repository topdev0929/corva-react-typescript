import { render } from '@testing-library/react';

import { ArrowFourStability } from '@/components/common/icons/ArrowFourStability';

describe('ArrowFourStability', () => {
  it('renders without crashing', () => {
    render(<ArrowFourStability />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowFourStability />);
    const arrowRightIcon = getByTestId('arrow-four-stability-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowFourStability color={color} />);
    const arrowRightIcon = getByTestId('arrow-four-stability-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
