import { render, fireEvent, screen } from '@testing-library/react';

import Settings from '../components/Settings';
import { LayoutContextProvider } from '../context/layoutContext';

import { mockSettingsProps } from '../__mocks__/mockSettingsProps';
import { mockLayoutContextProps } from '../__mocks__/mockContextProps';

describe('<Settings />', () => {
  it('should render correct', () => {
    const { getByTestId } = render(
      <LayoutContextProvider {...mockLayoutContextProps}>
        <Settings {...mockSettingsProps} />
      </LayoutContextProvider>
    );

    const settingButton = getByTestId('settingButton');
    fireEvent.click(settingButton);

    expect(screen.getByTestId('settingTitle')).toHaveTextContent('Settings');
  });
});
