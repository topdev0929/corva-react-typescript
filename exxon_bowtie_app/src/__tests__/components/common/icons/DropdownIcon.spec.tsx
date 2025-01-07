import { render } from '@testing-library/react';

import { DropdownIcon } from '@/components/common/icons/DropdownIcon';

describe('DropdownIcon', () => {
  it('renders without crashing', () => {
    render(<DropdownIcon />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<DropdownIcon />);
    const arrowRightIcon = getByTestId('dropdown-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#BDBDBD';
    const { getByTestId } = render(<DropdownIcon color={color} />);
    const arrowRightIcon = getByTestId('dropdown-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
