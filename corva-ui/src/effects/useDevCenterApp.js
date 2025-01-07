import { useState, useEffect } from 'react';
import { getAppIdentifier } from '~/utils/devcenter';

const COMPONENTS = {};

const LOCAL_DEBUG_URL = 'http://127.0.0.1:3000/app.js';

const useDevCenterApp = ({ CLIAppComponent, CLIAppSettings, app, version }) => {
  const appKey = app.app.app_key;

  const isLocalDebugMode = process.env.REACT_APP_DEBUG_DC_APP_KEY === appKey;
  const url = isLocalDebugMode ? LOCAL_DEBUG_URL : app?.package?.url;

  const appName = getAppIdentifier({ appKey, version, isLocalDebugMode });
  const [isLoading, setIsLoading] = useState(false);

  const AppComponent =
    CLIAppComponent || (COMPONENTS[appName] && COMPONENTS[appName].component) || null;
  const AppSettings =
    CLIAppSettings || (COMPONENTS[appName] && COMPONENTS[appName].settings) || null;
  const finishLoading = () => setIsLoading(false);

  useEffect(() => {
    const AppSource = COMPONENTS[appName];

    if (!url || !appName || (AppComponent && AppSettings)) return;

    if ((!CLIAppComponent && !AppSource) || (AppSource && AppSource.component)) {
      setIsLoading(true);

      if (!AppSource || !AppSource.script) {
        const scriptFile = document.createElement('script');

        scriptFile.src = url;

        scriptFile.onload = () => {
          COMPONENTS[appName] = window[appName] && window[appName].default;
          finishLoading();
        };

        COMPONENTS[appName] = {
          component: null,
          script: scriptFile,
        };

        setTimeout(() => document.body.appendChild(scriptFile));
      }

      const { script } = COMPONENTS[appName];

      if (script.onload) {
        const loaderCallback = script.onload;
        script.onload = () => {
          loaderCallback();
          finishLoading();
        };
      }

      script.onabort = finishLoading;

      script.error = finishLoading;
    }
  }, [url]);

  return {
    isLoading,
    AppComponent,
    AppSettings,
  };
};

export default useDevCenterApp;
