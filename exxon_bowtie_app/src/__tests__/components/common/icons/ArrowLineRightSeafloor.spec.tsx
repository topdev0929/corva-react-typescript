import { render } from '@testing-library/react';

import { ArrowLineRightSeafloor } from '@/components/common/icons/ArrowLineRightSeafloor';

describe('ArrowLineRightSeafloor', () => {
  it('renders without crashing', () => {
    render(<ArrowLineRightSeafloor />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLineRightSeafloor />);
    const arrowRightIcon = getByTestId('arrow-line-right-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowLineRightSeafloor color={color} />);
    const arrowRightIcon = getByTestId('arrow-line-right-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
