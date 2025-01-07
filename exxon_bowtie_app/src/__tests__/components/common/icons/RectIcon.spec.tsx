import { render } from '@testing-library/react';

import { RectIcon } from '@/components/common/icons/RectIcon';

describe('RectIcon', () => {
  it('renders without crashing', () => {
    render(<RectIcon />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<RectIcon />);
    const arrowRightIcon = getByTestId('rect-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#D32F2F');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<RectIcon color={color} />);
    const arrowRightIcon = getByTestId('rect-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
