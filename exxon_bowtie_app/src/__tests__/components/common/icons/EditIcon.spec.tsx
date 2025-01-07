import { render } from '@testing-library/react';

import { EditIcon } from '@/components/common/icons/EditIcon';

describe('EditIcon', () => {
  it('renders without crashing', () => {
    render(<EditIcon />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<EditIcon />);
    const arrowRightIcon = getByTestId('edit-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<EditIcon color={color} />);
    const arrowRightIcon = getByTestId('edit-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
