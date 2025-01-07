import { render, screen } from '@testing-library/react';

import FeedBar from '@/components/FeedBar';
import FeedBarContext from '../context/FeedContext';
import { mockAppProps } from '@/__mocks__/mockAppProps';

jest.mock('../components/FeedBar/components/FeedCreationProvider', () => ({
  useFeedCreationProvider: () => ({ feedLoadTimestamp: 1685704964050 }),
}));

describe('<FeedBar />', () => {
  const mockProps = {
    currentAsset: { asset_id: 1 },
    assets: [],
    timeRange: { startTimestamp: 0, endTimestamp: 0 },
    chartGrid: { left: 0, right: 0, top: 0, bottom: 0, hideAxis: false },
    currentUser: { id: 1, company_id: 1 },
    theme: { isLightTheme: true },
  };
  const mockProviderValue = {
    appKey: mockAppProps.app?.app?.app_key,
    package: mockAppProps.app?.package,
    appId: mockAppProps.app?.id,
  };

  it('should render correct', () => {
    render(
      <FeedBarContext.Provider value={mockProviderValue}>
        <FeedBar {...mockProps} />
      </FeedBarContext.Provider>
    );

    expect(screen.getByTestId('FeedBar')).toHaveTextContent('Loading...uu');
  });
});
