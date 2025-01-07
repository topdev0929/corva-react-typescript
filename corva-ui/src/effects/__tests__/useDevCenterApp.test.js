import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import { getAppIdentifier } from '~/utils/devcenter';
import useDevCenterApp from '../useDevCenterApp';

// NOTE: For these tests, you need to pass unique version or appKey in each renderHook(() => useDevCenterApp())
// otherwise you will receive cached results from COMPONENTS constant (check useDevCenterApp.js)
const hookArguments = {
  app: {
    app: { app_key: 'corva.test-app.ui' },
    package: { url: 'https://test-url.com/package.js' },
  },
  CLIAppComponent: undefined,
  CLIAppSettings: undefined,
};

describe('useDevCenterApp', () => {
  it('returns CLIAppComponent and CLIAppSettings if provided', async () => {
    const mockedAppComponent = () => <div>app component</div>;
    const mockedAppSettings = () => <div>app settings</div>;

    const { result, unmount } = renderHook(() =>
      useDevCenterApp({
        ...hookArguments,
        version: '1',
        CLIAppComponent: mockedAppComponent,
        CLIAppSettings: mockedAppSettings,
      })
    );

    expect(result.current).toEqual({
      isLoading: false,
      AppComponent: mockedAppComponent,
      AppSettings: mockedAppSettings,
    });
    unmount();
  });

  it('appends script with provided URL to the document.body', async () => {
    const documentSpy = jest.spyOn(document.body, 'appendChild');

    const { rerender } = renderHook(() => useDevCenterApp({ ...hookArguments, version: '2' }));

    await waitFor(() => {
      expect(document.body.appendChild).toBeCalledTimes(1);
      expect(document.body.appendChild).toBeCalledWith(
        expect.objectContaining({ src: hookArguments.app.package.url })
      );
    });

    rerender();
    await waitFor(() => {
      // NOTE: Check the script is appended only once
      expect(document.body.appendChild).toBeCalledTimes(1);
    });

    documentSpy.mockClear();
  });

  it('check AppComponent and AppSettings are stored in cache and returned after script execution', async () => {
    const mockedAppComponent = () => <div>app component</div>;
    const mockedAppSettings = () => <div>app settings</div>;
    const version = '3';

    const scriptFile = document.createElement('script');
    const documentSpy = jest.spyOn(document, 'createElement').mockReturnValue(scriptFile);

    const { result } = renderHook(() => useDevCenterApp({ ...hookArguments, version }));
    expect(result.current).toEqual({ isLoading: true, AppComponent: null, AppSettings: null });

    act(() => {
      const appName = getAppIdentifier({ appKey: hookArguments.app.app.app_key, version });
      // NOTE: Here we fake scriptFile execution by directly setting window[appName] property
      window[appName] = { default: { component: mockedAppComponent, settings: mockedAppSettings } };
      scriptFile.onload();
    });
    expect(result.current).toEqual({
      isLoading: false,
      AppComponent: mockedAppComponent,
      AppSettings: mockedAppSettings,
    });

    documentSpy.mockClear();
  });
});
