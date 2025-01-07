/* eslint-disable @typescript-eslint/no-empty-function */
import { render, fireEvent } from '@testing-library/react';

import { TabGroup } from '@/components/TabGroup';

describe('TabGroup component', () => {
  test('renders TabGroup correctly', () => {
    const { getByText } = render(<TabGroup tabIndex={0} setTabIndex={jest.fn()} />);
    expect(getByText('Surface Blowout')).toBeInTheDocument();
    expect(getByText('Seafloor Blowout')).toBeInTheDocument();
    expect(getByText('Loss of MODU Stability')).toBeInTheDocument();
  });

  test('changes tab index correctly', () => {
    const setTabIndexMock = jest.fn();
    const { getByText } = render(<TabGroup tabIndex={0} setTabIndex={setTabIndexMock} />);

    fireEvent.click(getByText('Seafloor Blowout'));
    expect(setTabIndexMock).toHaveBeenCalledWith(1);

    fireEvent.click(getByText('Loss of MODU Stability'));
    expect(setTabIndexMock).toHaveBeenCalledWith(2);

    fireEvent.click(getByText('Surface Blowout'));
    expect(setTabIndexMock).toHaveBeenCalledWith(0);
  });
});
