import { render } from '@testing-library/react';

import { ArrowLeft } from '@/components/common/icons/ArrowLeft';

describe('ArrowLeft', () => {
  it('renders without crashing', () => {
    render(<ArrowLeft />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<ArrowLeft />);
    const arrowRightIcon = getByTestId('arrow-left-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#BDBDBD');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<ArrowLeft color={color} />);
    const arrowRightIcon = getByTestId('arrow-left-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
