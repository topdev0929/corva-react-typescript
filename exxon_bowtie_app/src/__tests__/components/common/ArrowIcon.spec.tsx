import { render } from '@testing-library/react';

import { ArrowIcon } from '@/components/common/ArrowIcon';

describe('ArrowIcon component', () => {
  test('renders ArrowLeft icon when direction is "left"', () => {
    const { getByTestId } = render(<ArrowIcon direction="left" data-testid="arrow-icon" />);
    expect(getByTestId('arrow-left-icon')).toBeVisible();
  });

  test('renders ArrowRight icon when direction is "right"', () => {
    const { getByTestId } = render(<ArrowIcon direction="right" data-testid="arrow-icon" />);
    expect(getByTestId('arrow-right-icon')).toBeVisible();
  });
});
