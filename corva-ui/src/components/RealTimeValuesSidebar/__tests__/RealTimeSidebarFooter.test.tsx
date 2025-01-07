import { render, screen, fireEvent } from '@testing-library/react';
import SidebarFooter from '../SidebarFooter';
import RealTimeSidebarContext from '../RealTimeSidebarContext';
import { ORIENTATIONS } from '../enums';

describe('RealTimeSidebar Footer', () => {
  const handleOpenCloseDialog = jest.fn();

  const sidebarFooterProps = {
    onSidebarOpened: jest.fn(),
    onSidebarClosed: jest.fn(),
  };

  it('should render RealTimeSidebarFooter', () => {
    const { getByTestId } = render(
      <RealTimeSidebarContext.Provider
        value={{ isSidebarOpen: false, orientation: ORIENTATIONS.vertical, handleOpenCloseDialog }}
      >
        <SidebarFooter {...sidebarFooterProps} />
      </RealTimeSidebarContext.Provider>
    );

    expect(getByTestId('sidebar_footer')).toBeInTheDocument();
  });

  it('opens closed sidebar on button click', () => {
    const { getByTestId } = render(
      <RealTimeSidebarContext.Provider
        value={{ isSidebarOpen: false, orientation: ORIENTATIONS.vertical, handleOpenCloseDialog }}
      >
        <SidebarFooter {...sidebarFooterProps} />
      </RealTimeSidebarContext.Provider>
    );

    const addButton = screen.queryByText('Add');
    expect(addButton).not.toBeInTheDocument();

    const sidebarOpenButton = getByTestId('sidebar_open_button');
    fireEvent.click(sidebarOpenButton);
    expect(sidebarFooterProps.onSidebarOpened).toHaveBeenCalledTimes(1);
    expect(sidebarFooterProps.onSidebarOpened).toHaveBeenCalledTimes(1);
  });

  it('closes opened sidebar on button click', () => {
    const { getByTestId } = render(
      <RealTimeSidebarContext.Provider
        value={{ isSidebarOpen: true, orientation: ORIENTATIONS.vertical, handleOpenCloseDialog }}
      >
        <SidebarFooter {...sidebarFooterProps} />
      </RealTimeSidebarContext.Provider>
    );

    const sidebarCloseButton = getByTestId('sidebar_close_button');
    fireEvent.click(sidebarCloseButton);
    expect(sidebarFooterProps.onSidebarClosed).toHaveBeenCalledTimes(1);
  });
});
