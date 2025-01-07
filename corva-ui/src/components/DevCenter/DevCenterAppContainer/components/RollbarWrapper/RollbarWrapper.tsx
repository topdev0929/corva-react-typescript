import { useEffect, useRef } from 'react';
import Rollbar from 'rollbar';
import { Provider } from '@rollbar/react';

import { CORVA_COMPANY_ID } from '~/constants';

type RollbarWrapperProps = {
  children: React.ReactElement;
  appKey: string;
  companyId: number;
  isCLIApp?: boolean;
  rollbarManifestConfig?: {
    enabled: boolean;
    useGlobalInstance?: boolean;
    accessToken?: string;
  };
};

const RollbarProvider = (props: RollbarWrapperProps) => {
  const { children, rollbarManifestConfig, appKey } = props;

  const parentRollbarInstance = useRef<Rollbar>((window.parent as any).Rollbar);
  const rollbarInstance = useRef<Rollbar>();

  useEffect(() => {
    const shouldUseCustomAccessToken =
      !rollbarManifestConfig.useGlobalInstance && rollbarManifestConfig.accessToken;
    const accessToken = shouldUseCustomAccessToken
      ? rollbarManifestConfig.accessToken
      : parentRollbarInstance.current?.options?.accessToken;

    rollbarInstance.current = new Rollbar({
      ...parentRollbarInstance.current?.options,
      payload: {
        ...parentRollbarInstance.current?.options?.payload,
        context: appKey,
      },
      accessToken,
    });
  }, []);

  return <Provider instance={rollbarInstance.current}>{children}</Provider>;
};

// NOTE: RollbarWrapper does not provide with ErrorBoundary.
// ErrorBoundary exist in the separate component.
export const RollbarWrapper = (props: RollbarWrapperProps) => {
  const { children, rollbarManifestConfig, isCLIApp, companyId } = props;
  const isCorvaCompany = companyId === CORVA_COMPANY_ID;

  if (!rollbarManifestConfig || !rollbarManifestConfig.enabled || !isCorvaCompany || isCLIApp) {
    return children;
  }

  return <RollbarProvider {...props}>{children}</RollbarProvider>;
};


