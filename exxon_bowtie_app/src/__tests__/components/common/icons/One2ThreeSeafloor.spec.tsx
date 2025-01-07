import { render } from '@testing-library/react';

import { One2ThreeSeafloor } from '@/components/common/icons/One2ThreeSeafloor';

describe('One2ThreeSeafloor', () => {
  it('renders without crashing', () => {
    render(<One2ThreeSeafloor />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<One2ThreeSeafloor />);
    const arrowRightIcon = getByTestId('one-to-three-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<One2ThreeSeafloor color={color} />);
    const arrowRightIcon = getByTestId('one-to-three-seafloor-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
