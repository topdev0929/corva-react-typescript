import { render } from '@testing-library/react';

import { AppContext } from '@/context/AppContext';
import AppHeaderContainer from '../components/AppHeader';

import { mockAppHeaderProps } from '../__mocks__/mockAppProps';

jest.mock('@corva/ui/components', () => ({
  AppHeader: () => <div>PadModeSelect</div>,
  OffsetWellButton: () => <div>PadModeSelect</div>,
  PadOffsetsPickerV2: () => <div>PadModeSelect</div>,
}));

jest.mock('@corva/ui/components/PadOffsetsPicker', () => ({
  StagesSelector: () => <div>PadModeSelect</div>,
}));

describe('<AppHeader />', () => {
  it('should render correct', () => {
    render(
      <AppContext.Provider value={{ isAssetViewer: false }}>
        <AppHeaderContainer {...mockAppHeaderProps} />
      </AppContext.Provider>
    );
  });
});
