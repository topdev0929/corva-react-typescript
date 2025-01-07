import { render, fireEvent } from '@testing-library/react';
import AppSideBar from '../AppSideBar';

describe('AppSideBar', () => {
  test('renders with default props', () => {
    const { getByTestId } = render(<AppSideBar>PAGE CONTENT</AppSideBar>);
    const appSideBar = getByTestId('AppSideBar_Drawer');
    expect(appSideBar).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    const { getByTestId, getByText, getByTitle } = render(
      <AppSideBar
        anchor="right"
        drawerPaperClassName="custom-class"
        expandedTooltipTitle="Expanded"
        collapsedTooltipTitle="Collapsed"
        header={<div>Header</div>}
        headerTitleIcon={<div>Header Title Icon</div>}
        isOpen={true}
        openedDrawerWidth={300}
        size="large"
        allOptionsButtonShown={true}
        isAllOptionsSelected={true}
        onAllOptionsClick={() => console.log('All options clicked')}
      >
        PAGE CONTENT
      </AppSideBar>
    );
    const appSideBar = getByTestId('AppSideBar_Drawer');
    expect(appSideBar).toBeInTheDocument();

    const expandedTooltip = getByTitle('Expanded');
    expect(expandedTooltip).toBeInTheDocument();

    const headerContent = getByText('Header');
    expect(headerContent).toBeInTheDocument();

    const headerTitleIcon = getByText('Header Title Icon');
    expect(headerTitleIcon).toBeInTheDocument();

    expect(appSideBar).toHaveStyle('width: 300px');

    expect(appSideBar).toHaveClass('MuiDrawer-root');

    const clearAllButton = getByText('Clear All');
    expect(clearAllButton).toBeInTheDocument();
  });

  test('calls setIsOpen when toggle button is clicked', () => {
    const setIsOpenMock = jest.fn();
    const { getByTestId } = render(
      <AppSideBar isOpen={true} setIsOpen={setIsOpenMock}>
        PAGE CONTENT
      </AppSideBar>
    );
    const toggleButton = getByTestId('AppSideBar_arrowButton');
    fireEvent.click(toggleButton);
    expect(setIsOpenMock).toHaveBeenCalledTimes(1);
    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

  test('calls onAllOptionsClick when select all button is clicked', () => {
    const onAllOptionsClickMock = jest.fn();
    const { getByText } = render(
      <AppSideBar isOpen allOptionsButtonShown onAllOptionsClick={onAllOptionsClickMock}>
        PAGE CONTENT
      </AppSideBar>
    );
    const selectAllButton = getByText('Select All');
    expect(selectAllButton).toBeInTheDocument();
    fireEvent.click(selectAllButton);
    expect(onAllOptionsClickMock).toHaveBeenCalledTimes(1);
  });

  test('correctly adjusts width when openedDrawerWidth prop changes', () => {
    const { getByTestId, rerender } = render(
      <AppSideBar isOpen openedDrawerWidth={300}>
        PAGE CONTENT
      </AppSideBar>
    );
    const appSideBar = getByTestId('AppSideBar_Drawer');
    expect(appSideBar).toHaveStyle('width: 300px');

    rerender(
      <AppSideBar isOpen openedDrawerWidth={400}>
        PAGE CONTENT
      </AppSideBar>
    );
    expect(appSideBar).toHaveStyle('width: 400px');
  });
});
