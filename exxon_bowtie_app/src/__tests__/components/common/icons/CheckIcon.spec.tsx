import { render } from '@testing-library/react';

import { CheckIcon } from '@/components/common/icons/CheckIcon';

describe('CheckIcon', () => {
  it('renders without crashing', () => {
    render(<CheckIcon />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<CheckIcon />);
    const arrowRightIcon = getByTestId('check-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#03BCD4');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<CheckIcon color={color} />);
    const arrowRightIcon = getByTestId('check-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
