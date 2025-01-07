import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import AppSettingsDialog from '../AppSettingsDialog/AppSettingsDialog';
import { PAGE_NAME } from '../AppSettingsDialog/AppSettingsDialog';

jest.mock('~/clients/jsonApi', () => ({
  getAppPackages: () => [],
  mapAssetGetRequest: jest.fn().mockReturnValue(() => ({
    data: [
      { id: '1', attributes: { name: 'Asset 1' } },
      { id: '2', attributes: { name: 'Asset 2' } },
    ],
  })),
}));

const withPermissionsHOC = () => () => () => <div />;

jest.mock('~/permissions', () => ({
  withPermissionsHOC,
  PERMISSIONS: {},
}));

const app = {
  id: 1,
  name: 'Test App',
  settings: { package: '1.0.0' },
  package: { version: '1.0.0' },
  app: { id: 1 },
};
const onCloneDashboard = jest.fn();
const onSettingsChange = jest.fn();
const toggleAppSettingsDialog = jest.fn();
const defaultProps = {
  app,
  appData: { version: '1.0.0' },
  appName: 'Test App',
  currentUser: { id: 1, name: 'Test User' },
  isMultiRig: false,
  isSettingsDialogHidden: false,
  layoutEnvironment: { type: 'asset' },
  onAppRemove: jest.fn(),
  onCloneDashboard,
  onSettingsChange,
  segment: 'drilling',
  toggleAppSettingsDialog,
};

describe('AppSettingsDialog', () => {
  it('should renders the app name in the dialog title', () => {
    render(<AppSettingsDialog {...defaultProps} />);
    expect(screen.getByText('Test App settings')).toBeInTheDocument();
  });

  describe('AppDetailsTab', () => {
    it('should render app details tab', () => {
      render(<AppSettingsDialog {...defaultProps} />);
      expect(screen.getByTestId(`${PAGE_NAME}_appDetailsTab`)).toBeInTheDocument();
    });

    it('should render app details view', async () => {
      const { getByTestId, getByText } = render(<AppSettingsDialog {...defaultProps} />);
      await waitFor(() => {
        fireEvent.click(getByTestId(`${PAGE_NAME}_appDetailsTab`));
        expect(getByText('Description')).toBeInTheDocument();
      });
    });
  });

  describe('ViewAppPageTab', () => {
    it('should render view app page tab', () => {
      render(<AppSettingsDialog {...defaultProps} />);
      expect(screen.getByTestId(`${PAGE_NAME}_viewAppPageTab`)).toBeInTheDocument();
    });

    it('should redirect to app page if click on viewAppPageTab', () => {
      const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
      window.open = jest.fn();
      fireEvent.click(getByTestId(`${PAGE_NAME}_viewAppPageTab`));
      expect(window.open).toHaveBeenCalledWith('/app-store/app/1', '_blank');
    });
  });

  it('should render settings tab', () => {
    render(<AppSettingsDialog {...defaultProps} />);
    expect(screen.getByTestId(`${PAGE_NAME}_settingsTab`)).toBeInTheDocument();
  });

  it('should run toggleAppSettingsDialog after click on cancel button', () => {
    const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    const CancelButton = getByTestId(`${PAGE_NAME}_cancel`);
    fireEvent.click(CancelButton);
    expect(toggleAppSettingsDialog).toHaveBeenCalled();
  });

  it('should run onCopyDashboard after click on copy dashboard button', () => {
    const { getByText } = render(<AppSettingsDialog {...defaultProps} isSettingsDialogHidden />);
    const CopyDashboardButton = getByText('Copy Dashboard');
    fireEvent.click(CopyDashboardButton);
    expect(onCloneDashboard).toHaveBeenCalled();
  });

  it('should run onSettingsChange after click on the save button for CLI apps', () => {
    const { getByTestId } = render(
      <AppSettingsDialog
        {...defaultProps}
        app={{ ...defaultProps.app, id: -1 }}
        isSettingsDialogHidden={false}
      />
    );
    const SaveButton = getByTestId(`${PAGE_NAME}_save`);
    fireEvent.click(SaveButton);
    expect(onSettingsChange).toHaveBeenCalledWith(app.settings);
  });
});
