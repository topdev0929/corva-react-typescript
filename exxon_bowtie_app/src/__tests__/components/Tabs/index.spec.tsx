/* eslint-disable jsx-a11y/tabindex-no-positive */
import { render } from '@testing-library/react';

import Tabs from '@/components/Tabs';

describe('Tabs component', () => {
  test('renders SurfaceTab when tabIndex is 0', () => {
    const { getByTestId } = render(
      <Tabs tabIndex={0} currentUser={{ company_id: 1 }} assetId={0} />
    );
    expect(getByTestId('surface-tab')).toBeInTheDocument();
  });

  test('renders SeafloorTab when tabIndex is 1', () => {
    const { getByTestId } = render(
      <Tabs tabIndex={1} currentUser={{ company_id: 1 }} assetId={0} />
    );
    expect(getByTestId('seafloor-tab')).toBeInTheDocument();
  });

  test('renders StabilityTab when tabIndex is 2', () => {
    const { getByTestId } = render(
      <Tabs tabIndex={2} currentUser={{ company_id: 1 }} assetId={0} />
    );
    expect(getByTestId('stability-tab')).toBeInTheDocument();
  });
});
