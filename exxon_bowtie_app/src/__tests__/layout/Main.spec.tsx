import { render } from '@testing-library/react';

import { Main } from '@/layout/Main';

describe('Main component', () => {
  const mockTabsProps = {
    tabIndex: 0,
    currentUser: { company_id: 1 },
    assetId: 0,
  };

  it('renders without crashing', () => {
    render(<Main {...mockTabsProps} />);
  });
});
