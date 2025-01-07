import { render, fireEvent } from '@testing-library/react';

import { SurfaceTab } from '@/components/Tabs/Surface';

describe('SurfaceTab component', () => {
  test('renders', () => {
    const { getByTestId } = render(<SurfaceTab currentUser={{ company_id: 1 }} assetId={0} />);
    expect(getByTestId('surface-tab')).toBeInTheDocument();
  });

  test('opens popover when clicking on a card', () => {
    const { getByTestId } = render(<SurfaceTab currentUser={{ company_id: 1 }} assetId={0} />);
    fireEvent.click(getByTestId('influx-id'));
    const popover = getByTestId('surface-popover');
    expect(popover).toBeInTheDocument();
  });

  test('check all icons', () => {
    const { queryAllByTestId } = render(<SurfaceTab currentUser={{ company_id: 1 }} assetId={0} />);
    const arrowIcons = queryAllByTestId('arrow-right-icon');
    expect(arrowIcons.length).toBeGreaterThan(0);

    const arrowLeftIcon = queryAllByTestId('arrow-line-left-icon');
    expect(arrowLeftIcon.length).toBeGreaterThan(0);

    const arrowRightIcon = queryAllByTestId('arrow-line-right-icon');
    expect(arrowRightIcon.length).toBeGreaterThan(0);
  });

  test('passes correct props to popover', () => {
    const { getByTestId } = render(<SurfaceTab currentUser={{ company_id: 1 }} assetId={2} />);
    fireEvent.click(getByTestId('influx-id'));
    const popover = getByTestId('surface-popover');
    expect(popover).toHaveTextContent('Influx ID');
  });
});
