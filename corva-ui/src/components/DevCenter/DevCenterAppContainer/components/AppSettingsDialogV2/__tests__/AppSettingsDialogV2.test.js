import { render, fireEvent, waitFor } from '@testing-library/react';

import AppSettingsDialog, { PAGE_NAME } from '../AppSettingsDialog';
import { PAGE_NAME as removeAppButtonPageName } from '../RemoveAppButton';

const DATA_TEST_ID = {
  disabledSettingsMessage: 'DisabledSettingsMessage',
};

jest.mock('~/components/DisabledSettingsMessage', () => ({
  DisabledSettingsMessage: () => <div data-testid={DATA_TEST_ID.disabledSettingsMessage} />,
}));

const app = {
  id: 1,
  name: 'Test App',
  settings: { package: '1.0.0' },
  package: { version: '1.0.0' },
  app: { id: 1 },
};
const defaultProps = {
  app,
  appData: { version: '1.0.0' },
  appName: 'Test App',
  currentUser: { id: 1, name: 'Test User' },
  isMultiRig: false,
  layoutEnvironment: { type: 'asset' },
  onAppRemove: jest.fn(),
  onCloneDashboard: jest.fn(),
  onSettingsChange: jest.fn(),
  segment: 'drilling',
  toggleAppSettingsDialog: jest.fn(),
};

window.open = jest.fn();
const originalConsoleError = console.error;

describe('AppSettingsDialog', () => {
  beforeAll(() => {
    console.error = () => {};
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders without crashing', () => {
    render(<AppSettingsDialog {...defaultProps} />);
  });

  it('renders the app name in the dialog title', () => {
    const { getByText } = render(<AppSettingsDialog {...defaultProps} />);
    expect(getByText(`${defaultProps.appName} Settings`)).toBeInTheDocument();
  });

  it('opens app page in appStore on appStoreLink click', () => {
    const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    fireEvent.click(getByTestId(`${PAGE_NAME}_appstoreLink`));
    expect(window.open).toHaveBeenCalledWith(`/app-store/app/${defaultProps.app.app.id}`, '_top');
  });

  it('calls onAppRemove on Remove button click ', async () => {
    const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    fireEvent.click(getByTestId(`${removeAppButtonPageName}_button`));
    fireEvent.click(getByTestId(`${removeAppButtonPageName}_confirm`));
    await waitFor(() => expect(defaultProps.onAppRemove).toHaveBeenCalled());
  });

  it('calls toggleAppSettingsDialog on Cancel button click ', async () => {
    const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    fireEvent.click(getByTestId(`${PAGE_NAME}_cancel`));
    expect(defaultProps.toggleAppSettingsDialog).toHaveBeenCalled();
  });

  it('calls onSettingsChange on Save button click ', async () => {
    const { getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    fireEvent.click(getByTestId(`${PAGE_NAME}_save`));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith(app.settings);
    expect(defaultProps.toggleAppSettingsDialog).toHaveBeenCalled();
  });

  it('does not render Copy Dashboard button and DisabledSeetingsMessage', () => {
    const { getByText, getByTestId } = render(<AppSettingsDialog {...defaultProps} />);
    expect(getByText('Copy Dashboard')).not.toBeInTheDocument();
    expect(getByTestId(DATA_TEST_ID.disabledSettingsMessage)).toBeInTheDocument();
  });

  describe('isSettingsDialogHidden', () => {
    const props = { ...defaultProps, isSettingsDialogHidden: true };

    it('hides Remove and Save buttons', () => {
      const { queryByTestId } = render(<AppSettingsDialog {...props} />);
      expect(queryByTestId(`${removeAppButtonPageName}_button`)).not.toBeInTheDocument();
      expect(queryByTestId(`${PAGE_NAME}_save`)).not.toBeInTheDocument();
    });

    it('shows Copy Dashborad button and calls onCloneDashboard on click', () => {
      const { getByText } = render(<AppSettingsDialog {...props} />);
      fireEvent.click(getByText('Copy Dashboard'));
      expect(defaultProps.onCloneDashboard).toBeCalled();
    });

    it('shows DisabledSettingsMessage', () => {
      const { getByTestId } = render(<AppSettingsDialog {...props} />);
      expect(getByTestId(DATA_TEST_ID.disabledSettingsMessage)).toBeInTheDocument();
    });
  });
});
