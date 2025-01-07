import { render, fireEvent } from '@testing-library/react';

import { SeafloorTab } from '@/components/Tabs/Seafloor';

describe('SeafloorTab component', () => {
  test('renders', () => {
    const { getByTestId } = render(<SeafloorTab currentUser={{ company_id: 1 }} assetId={0} />);
    expect(getByTestId('seafloor-tab')).toBeInTheDocument();
  });

  test('opens popover when clicking on a card in Preventative safeguards section', () => {
    const { getByTestId } = render(<SeafloorTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('riser-card'));
  });

  test('opens popover when clicking on Uncontrolled HC Release to Rig Floor card', () => {
    const { getByTestId } = render(<SeafloorTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('uncontrolled-hc-card'));
  });

  test('opens popover when clicking on a card in Mitigative safeguards section', () => {
    const { getByTestId } = render(<SeafloorTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('emergency-well-card'));
  });

  test('check all icons', () => {
    const { queryAllByTestId } = render(
      <SeafloorTab currentUser={{ company_id: 1 }} assetId={0} />
    );
    const arrowIcons = queryAllByTestId('arrow-right-icon');
    expect(arrowIcons.length).toBeGreaterThan(0);

    const arrowLineLeftSeafloorIcon = queryAllByTestId('arrow-line-left-seafloor-icon');
    expect(arrowLineLeftSeafloorIcon.length).toBeGreaterThan(0);

    const arrowLineRightSeafloorIcon = queryAllByTestId('arrow-line-right-seafloor-icon');
    expect(arrowLineRightSeafloorIcon.length).toBeGreaterThan(0);
  });

  test('passes correct props to popover', () => {
    const { getByTestId } = render(<SeafloorTab currentUser={{ company_id: 1 }} assetId={2} />);
    fireEvent.click(getByTestId('riser-integrity-id'));
    const popover = getByTestId('seafloor-popover');
    expect(popover).toHaveTextContent('Riser Integrity');
  });
});
