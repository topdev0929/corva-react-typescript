import { render } from '@testing-library/react';

import { LayoutContextProvider } from '@/context/layoutContext';

import { mockLayoutContextProps } from '@/__mocks__/mockContextProps';
import FilterBoxEditDialog from '@/components/FilterBox/FilterBoxEditDialog';
import { mockFilterBoxEditDialogProps, mockFilterBoxProps } from '@/__mocks__/mockFilterBoxProps';
import { FilterBoxContextProvider } from '@/context/filterBoxContext';

describe('<FilterBoxContainer />', () => {
  it('should render correct ', () => {
    render(
      <LayoutContextProvider {...mockLayoutContextProps}>
        <FilterBoxContextProvider>
          <FilterBoxEditDialog {...mockFilterBoxProps} {...mockFilterBoxEditDialogProps} />
        </FilterBoxContextProvider>
      </LayoutContextProvider>
    );
  });
});
