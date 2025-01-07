import React from 'react';
import { render, screen } from '@testing-library/react';
import { Map } from 'immutable';
import EmbeddedApp from '../EmbeddedApp';

jest.mock('~/components/LoadingIndicator', () => () => <div>LoadingIndicator</div>);
jest.mock('~/components/Tooltip', () => ({ children }) => <div>{children}</div>);
jest.mock('~/utils/mobileDetect', () => ({ isNativeDetected: false }));

const mockAppType = {
  constants: {
    SUBSCRIPTIONS: [],
    METADATA: {
      title: 'Test App Title',
      subtitle: 'Test App Subtitle',
      settingsTitle: 'Test App Settings Title',
    },
  },
  AppComponent: () => <div>App Component</div>,
};

const defaultProps = {
  appData: Map(),
  appRegistry: {
    uiApps: Map({
      testCategory: Map({
        appTypes: Map({
          testKey: mockAppType,
        }),
      }),
    }),
  },
  appComponentCategory: 'testCategory',
  appComponentKey: 'testKey',
  subscribeAppForAsset: jest.fn(),
  unsubscribeAppFromAsset: jest.fn(),
  internalSelectors: {
    isSubDataLoading: jest.fn(),
    getSubErrors: jest.fn(),
    isSubDataEmpty: jest.fn(),
  },
};

describe('EmbeddedApp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when data is loading', () => {
    defaultProps.internalSelectors.isSubDataLoading.mockReturnValue(true);
    render(<EmbeddedApp {...defaultProps} />);

    expect(screen.getByText('LoadingIndicator')).toBeInTheDocument();
  });

  it('renders an error message if there is an error in the data', () => {
    defaultProps.internalSelectors.isSubDataLoading.mockReturnValue(false);
    defaultProps.internalSelectors.getSubErrors.mockReturnValue({
      message: 'Test Error',
      length: 1,
    });
    render(<EmbeddedApp {...defaultProps} />);

    expect(screen.getByText('Data error: Test Error')).toBeInTheDocument();
  });

  it('renders an empty data message if data is empty and no custom handling is provided', () => {
    defaultProps.internalSelectors.isSubDataLoading.mockReturnValue(false);
    defaultProps.internalSelectors.getSubErrors.mockReturnValue(null);
    defaultProps.internalSelectors.isSubDataEmpty.mockReturnValue(true);
    render(<EmbeddedApp {...defaultProps} />);

    expect(screen.getByText('Data is empty')).toBeInTheDocument();
  });
});
