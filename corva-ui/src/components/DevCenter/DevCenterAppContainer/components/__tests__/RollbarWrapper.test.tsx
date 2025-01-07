import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { RollbarWrapper } from '../RollbarWrapper/RollbarWrapper';
import { CORVA_COMPANY_ID } from '~/constants';

const mockedRollbarInstance = {
  error: jest.fn(),
};

const ACCESS_TOKEN_PARENT = 'test-parent-token';
const ACCESS_TOKEN_PASSED = 'test-passed-token';

jest.mock('rollbar');
const Rollbar = require('rollbar');

Rollbar.mockImplementation(() => mockedRollbarInstance);

jest.mock('@rollbar/react', () => {
  return {
    __esModule: true,
    Provider: ({ children }: { children: React.ReactElement }) => (
      <div data-testid="rollbar-react-provider">{children}</div>
    ),
  };
});

describe('RollbarWrapper', () => {
  beforeAll(() => {
    (global.parent as any).Rollbar = {
      options: {
        accessToken: ACCESS_TOKEN_PARENT,
      },
    };
  });

  afterAll(() => {
    delete (global.parent as any).Rollbar;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const appKey = 'test-app-key';
  const NON_CORVA_COMPANY_ID = 123;

  it('should not create a new Rollbar instance if rollbarManifestConfig is not provided', () => {
    const { queryByTestId } = render(
      <RollbarWrapper appKey={appKey} companyId={CORVA_COMPANY_ID}>
        <div>test</div>
      </RollbarWrapper>
    );

    expect(queryByTestId('rollbar-react-provider')).toBeFalsy();
    expect(Rollbar).not.toHaveBeenCalled();
  });

  it('should not create a new Rollbar instance if rollbarManifestConfig.enabled is false', () => {
    const { queryByTestId } = render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        rollbarManifestConfig={{ enabled: false }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(queryByTestId('rollbar-react-provider')).toBeFalsy();
    expect(Rollbar).not.toHaveBeenCalled();
  });

  it('should create a new Rollbar instance for CORVA company', () => {
    const { queryByTestId } = render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        rollbarManifestConfig={{ enabled: true }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(queryByTestId('rollbar-react-provider')).toBeTruthy();
    expect(Rollbar).toHaveBeenCalled();
  });

  it('should not create a new Rollbar instance for non Corva company Id', () => {
    const { queryByTestId } = render(
      <RollbarWrapper
        appKey={appKey}
        companyId={NON_CORVA_COMPANY_ID}
        rollbarManifestConfig={{ enabled: true }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(queryByTestId('rollbar-react-provider')).toBeFalsy();
    expect(Rollbar).not.toHaveBeenCalled();
  });

  it('should not create a new Rollbar instance for CLI app', () => {
    const { queryByTestId } = render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        isCLIApp={true}
        rollbarManifestConfig={{ enabled: true }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(queryByTestId('rollbar-react-provider')).toBeFalsy();
    expect(Rollbar).not.toHaveBeenCalled();
  });

  it('should use passed accessToken and {corva: appKey} in payload', () => {
    render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        rollbarManifestConfig={{ enabled: true, accessToken: ACCESS_TOKEN_PASSED }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(Rollbar).toHaveBeenCalledWith({
      accessToken: ACCESS_TOKEN_PASSED,
      payload: { context: appKey },
    });
  });

  it('should use parent Rollbar instance accessToken if it is not passed', () => {
    render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        rollbarManifestConfig={{ enabled: true }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(Rollbar).toHaveBeenCalledWith({
      accessToken: ACCESS_TOKEN_PARENT,
      payload: { context: appKey },
    });
  });

  it('should use parent Rollbar instance accessToken if useGlobalInstance is passed along with accessToken', () => {
    render(
      <RollbarWrapper
        appKey={appKey}
        companyId={CORVA_COMPANY_ID}
        rollbarManifestConfig={{
          enabled: true,
          useGlobalInstance: true,
          accessToken: ACCESS_TOKEN_PASSED,
        }}
      >
        <div>test</div>
      </RollbarWrapper>
    );

    expect(Rollbar).toHaveBeenCalledWith({
      accessToken: ACCESS_TOKEN_PARENT,
      payload: { context: appKey },
    });
  });
});
