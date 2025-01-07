import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DevCenterAppContainer from '../DevCenterAppContainer';

describe('DevCenterAppContainer', () => {
  const app = {
    id: 'test-app-id',
    app: { name: 'Test App' },
    availability: {},
  };
  const currentUser = { id: 'test-user-id', name: 'Test User', company: {} };
  const devCenterRouter = {
    location: { pathname: '/test-path', query: { query: 'test-query' } },
  };
  const onAppContainerClick = jest.fn();
  const onIsMaximizedChange = jest.fn();
  const onSettingChange = jest.fn();
  const onSettingsChange = jest.fn();
  const openIntercom = jest.fn();
  const updateCurrentDashboardAppLastAnnotation = jest.fn();
  const onHelpCenterClick = jest.fn();
  const setIsFullscreenModalMode = jest.fn().mockResolvedValue(null);
  const devCenterAppContainerProps = {
    app,
    currentUser,
    devCenterRouter,
    onAppContainerClick,
    onIsMaximizedChange,
    onSettingChange,
    onSettingsChange,
    openIntercom,
    updateCurrentDashboardAppLastAnnotation,
    onHelpCenterClick,
    setIsFullscreenModalMode,
  };

  it('should render DevCenterAppContainer', () => {
    const { getByTestId } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

    const Container = getByTestId('DevCenter_AppContainer_Test App');

    expect(Container).toBeInTheDocument();
  });

  it('should run onAppContainerClick when the container is clicked', () => {
    render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

    fireEvent.click(screen.getByTestId('DevCenter_AppContainer_Test App'));

    expect(onAppContainerClick).toHaveBeenCalledTimes(1);
  });

  describe('NonPrioritiesMenu', () => {
    it('should display NonPrioritiesMenu', () => {
      const { getByTestId } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

      expect(getByTestId('DevCenter_AppPriorityMenu_menu')).toBeInTheDocument();
    });

    it('should display MenuItems', async () => {
      const { getByTestId } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

      fireEvent.click(getByTestId('DevCenter_AppPriorityMenu_menu'));

      await waitFor(() => {
        expect(getByTestId('DevCenter_AppPriorityMenu_fullScreenMenuItem')).toBeInTheDocument();
        expect(getByTestId('DevCenter_AppPriorityMenu_settings')).toBeInTheDocument();
      });
    });

    it('should hide Menu on click outside Menu', () => {
      const { container } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);
      fireEvent.click(container);

      expect(setIsFullscreenModalMode).toHaveBeenCalled();
    });
  });

  describe('HelpContentIconButton', () => {
    it('should display HelpContentIconButton', () => {
      const { getByTestId } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

      expect(getByTestId('DevCenter_AppContainer_helpContent')).toBeInTheDocument();
    });

    it('should call onHelpCenterClick by clicking on HelpCenterIconButton', () => {
      const { getByTestId } = render(<DevCenterAppContainer {...devCenterAppContainerProps} />);

      fireEvent.click(getByTestId('DevCenter_AppContainer_helpContent'));

      expect(onHelpCenterClick).toHaveBeenCalled();
    });
  });
});
