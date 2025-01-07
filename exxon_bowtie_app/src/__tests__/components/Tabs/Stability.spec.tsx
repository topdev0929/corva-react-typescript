import { render, fireEvent } from '@testing-library/react';

import { StabilityTab } from '@/components/Tabs/Stability';

describe('StabilityTab component', () => {
  test('renders', () => {
    const { getByTestId } = render(<StabilityTab currentUser={{ company_id: 1 }} assetId={0} />);
    expect(getByTestId('stability-tab')).toBeInTheDocument();
  });

  test('opens popover when clicking on a card in Mitigative safeguards section', () => {
    const { getByTestId } = render(<StabilityTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('fatalities-card'));
  });

  test('opens popover when clicking on a card in Preventative safeguards section', () => {
    const { getByTestId } = render(<StabilityTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('vessel-impact-card'));
  });

  test('opens popover when clicking on Uncontrolled HC Release to Rig Floor card', () => {
    const { getByTestId } = render(<StabilityTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('uncontrolled-hc-card'));
  });

  test('check all icons', () => {
    const { queryAllByTestId } = render(
      <StabilityTab currentUser={{ company_id: 1 }} assetId={0} />
    );
    const arrowIcons = queryAllByTestId('arrow-right-icon');
    expect(arrowIcons.length).toBeGreaterThan(0);

    const arrowLineLeftSeafloorIcon = queryAllByTestId('arrow-line-left-seafloor-icon');
    expect(arrowLineLeftSeafloorIcon.length).toBeGreaterThan(0);

    const arrowLineRightStabilityIcon = queryAllByTestId('arrow-line-right-stability-icon');
    expect(arrowLineRightStabilityIcon.length).toBeGreaterThan(0);
  });

  test('passes correct props to popover', () => {
    const { getByTestId } = render(<StabilityTab currentUser={{ company_id: 1 }} assetId={2} />);
    fireEvent.click(getByTestId('search-rescue-id'));
    const popover = getByTestId('stability-popover');
    expect(popover).toHaveTextContent('Search & Rescue');
  });
});
