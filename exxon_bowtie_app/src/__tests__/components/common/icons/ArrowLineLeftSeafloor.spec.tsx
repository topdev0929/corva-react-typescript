import { render } from '@testing-library/react';

import { ArrowLineLeftSeafloor } from '@/components/common/icons/ArrowLineLeftSeafloor';

describe('ArrowLineLeftSeafloor', () => {
  it('renders without crashing', () => {
    render(<ArrowLineLeftSeafloor />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLineLeftSeafloor />);
    const arrowRightIcon = getByTestId('arrow-line-left-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowLineLeftSeafloor color={color} />);
    const arrowRightIcon = getByTestId('arrow-line-left-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
