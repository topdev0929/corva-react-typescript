import { render } from '@testing-library/react';

import { RigSelector } from '@/components/RigSelector';

describe('RigSelector component', () => {
  test('renders RigSelector correctly', () => {
    const { getByText } = render(<RigSelector />);
    expect(getByText('Rig')).toBeInTheDocument();
  });
});
