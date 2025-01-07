import { render, screen } from '@testing-library/react';

import FilterBoxContainer from '@/components/FilterBox/FilterBoxContainer';
import { LayoutContextProvider } from '@/context/layoutContext';

import { mockLayoutContextProps } from '@/__mocks__/mockContextProps';
import { mockFilterBoxProps } from '@/__mocks__/mockFilterBoxProps';

jest.mock('@/context/AppContext.ts', () => ({
  useAppContext: () => ({ isAssetViewer: false }),
}));

describe('<FilterBoxContainer />', () => {
  it('should render correct ', () => {
    render(
      <LayoutContextProvider {...mockLayoutContextProps}>
        <FilterBoxContainer {...mockFilterBoxProps} />
      </LayoutContextProvider>
    );

    expect(screen.getByTestId('FilterBoxContainer')).toHaveTextContent('Stage Mode');
  });
});
