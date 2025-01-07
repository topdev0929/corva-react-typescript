import { render } from '@testing-library/react';

import { One2Three } from '@/components/common/icons/One2Three';

describe('One2Three', () => {
  it('renders without crashing', () => {
    render(<One2Three />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<One2Three />);
    const arrowRightIcon = getByTestId('one-to-three-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#9E9E9E');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<One2Three color={color} />);
    const arrowRightIcon = getByTestId('one-to-three-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
