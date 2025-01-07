import { render, fireEvent } from '@testing-library/react';

import { TabsHeader } from '@/layout/SubHeader';

describe('TabsHeader component', () => {
  const mockTabsHeaderProps = {
    tabIndex: 0,
    setTabIndex: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<TabsHeader {...mockTabsHeaderProps} />);
  });

  it('calls setTabIndex function when tab is clicked', () => {
    const { getByText } = render(<TabsHeader {...mockTabsHeaderProps} />);
    fireEvent.click(getByText('Surface Blowout'));
    expect(mockTabsHeaderProps.setTabIndex).toHaveBeenCalled();
  });
});
