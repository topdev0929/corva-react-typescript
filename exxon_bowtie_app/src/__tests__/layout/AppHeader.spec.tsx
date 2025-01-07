import { render } from '@testing-library/react';

import { CustomAppHeader } from '@/layout/AppHeader';

describe('CustomAppHeader component', () => {
  const mockAppHeaderProps = {
    app: 'Test App',
  };

  it('renders without crashing', () => {
    render(<CustomAppHeader appHeaderProps={mockAppHeaderProps} />);
  });

  it('displays the logo', () => {
    const { getByAltText } = render(<CustomAppHeader appHeaderProps={mockAppHeaderProps} />);
    const logo = getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });
});
