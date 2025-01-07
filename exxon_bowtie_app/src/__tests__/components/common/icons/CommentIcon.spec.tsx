import { render } from '@testing-library/react';

import { CommentIcon } from '@/components/common/icons/CommentIcon';

describe('CheckIcon', () => {
  it('renders without crashing', () => {
    render(<CommentIcon />);
  });

  it('renders with default color if no color prop is provided', () => {
    const { getByTestId } = render(<CommentIcon />);
    const arrowRightIcon = getByTestId('comment-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', '#03BCD4');
  });

  it('renders with the provided color', () => {
    const color = '#FF0000';
    const { getByTestId } = render(<CommentIcon color={color} />);
    const arrowRightIcon = getByTestId('comment-icon');
    expect(arrowRightIcon).toHaveAttribute('fill', color);
  });
});
