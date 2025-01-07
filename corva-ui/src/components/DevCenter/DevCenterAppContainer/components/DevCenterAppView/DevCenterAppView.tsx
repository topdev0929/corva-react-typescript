import ErrorBoundary from '~/components/ErrorBoundary';
import LoadingIndicator from '~/components/LoadingIndicator';
import { SEGMENTS } from '~/constants/segment';
import EmptyAppView from '~/components/EmptyView/EmptyAppView';
import EmptyState from '~/components/EmptyState';
import { ChooseAssetButton } from './components/ChooseAssetButton';
import AppInfoMessage from '../AppInfoMessage';

const PAGE_NAME = 'DevCenterAppView';

export const getNoActiveWellMessage = (rigName: string): string => `${rigName} has no active well`;

function DevCenterAppView({
  AppComponent,
  app,
  appData,
  appProps,
  availability,
  isCLIApp,
  isLoading,
  isMultiRig,
  layoutEnvironment,
  openIntercom,
  segment,
  toggleAppSettingsDialog,
}) {
  if (!app.package)
    return (
      <AppInfoMessage app={app}>
        <EmptyState
          data-testid={`${PAGE_NAME}_EmptyState`}
          title={EmptyState.APP_MESSAGES.appPackageWasNotFound.title}
          subtitle={EmptyState.APP_MESSAGES.appPackageWasNotFound.subtitle}
          image={EmptyState.IMAGES.AppLoadingError}
        />
      </AppInfoMessage>
    );

  if (isLoading)
    return (
      <AppInfoMessage app={app}>
        <LoadingIndicator />
      </AppInfoMessage>
    );

  if (!(availability.hasProductSubscription && availability.isAppSubscribedForAsset)) {
    const {
      APP_MESSAGES: { appNotSubscribed, appNotSubscribedForAsset },
      IMAGES: { NoSubscription },
    } = EmptyState;
    const { title, subtitle } = !availability.hasProductSubscription
      ? appNotSubscribed
      : appNotSubscribedForAsset;

    return (
      <AppInfoMessage app={app}>
        <EmptyState
          data-testid={`${PAGE_NAME}_EmptyState`}
          title={title}
          subtitle={subtitle}
          image={NoSubscription}
        />
      </AppInfoMessage>
    );
  }

  if (!AppComponent)
    return (
      <AppInfoMessage app={app}>
        <EmptyState
          data-testid={`${PAGE_NAME}_EmptyState`}
          title={EmptyAppView.APP_MESSAGES.appComponentWasNotFound.title}
          image={EmptyState.IMAGES.AppLoadingError}
        />
      </AppInfoMessage>
    );

  if (!isMultiRig) {
    const actions = isCLIApp && (
      <ChooseAssetButton toggleAppSettingsDialog={toggleAppSettingsDialog} />
    );

    if (appData.rig && !appData.well) {
      return (
        <AppInfoMessage app={app}>
          <EmptyState
            data-testid={`${PAGE_NAME}_EmptyState`}
            title={getNoActiveWellMessage(appData.rig.name)}
            image={EmptyState.IMAGES.RigHasNoActiveWell}
            subtitle={actions}
          />
        </AppInfoMessage>
      );
    }

    if (
      layoutEnvironment?.type === 'general' &&
      segment === SEGMENTS.COMPLETION &&
      !appData.fracFleet
    ) {
      return (
        <AppInfoMessage app={app}>
          <EmptyState
            data-testid={`${PAGE_NAME}_EmptyState`}
            title={EmptyAppView.APP_MESSAGES.fracFleetWasNotFound.title}
            image={EmptyState.IMAGES.FracFleetHasNoActivePad}
            subtitle={actions}
          />
        </AppInfoMessage>
      );
    }

    if (
      layoutEnvironment?.type === 'general' &&
      segment === SEGMENTS.COMPLETION &&
      !appData.fracFleet?.current_pad_id &&
      !app.settings.padId
    ) {
      return (
        <AppInfoMessage app={app}>
          <EmptyState
            data-testid={`${PAGE_NAME}_EmptyState`}
            image={EmptyState.IMAGES.FracFleetHasNoActivePad}
            subtitle={actions}
            title={EmptyState.APP_MESSAGES.fracFleetHasNoPad.title}
          />
        </AppInfoMessage>
      );
    }

    if (
      layoutEnvironment?.type === 'general' &&
      segment === SEGMENTS.COMPLETION &&
      (!appData.wells || appData.wells.length < 1)
    ) {
      return (
        <AppInfoMessage app={app}>
          <EmptyState
            data-testid={`${PAGE_NAME}_EmptyState`}
            image={EmptyState.IMAGES.NoWellsSelected}
            subtitle={actions}
            title={EmptyState.APP_MESSAGES.padHasNoWells.title}
          />
        </AppInfoMessage>
      );
    }

    if (!appData.rig && !appData.well && !appData.settings && !appData.wells) {
      return (
        <AppInfoMessage app={app}>
          <EmptyState
            data-testid={`${PAGE_NAME}_EmptyState`}
            image={EmptyState.IMAGES.AssetHasNoData}
            subtitle={actions}
            title={EmptyState.APP_MESSAGES.noAssetData.title}
          />
        </AppInfoMessage>
      );
    }
  }
  return (
    <ErrorBoundary app={app} openIntercom={openIntercom}>
      <AppComponent app={app} {...app.settings} {...appData} {...appProps} />
    </ErrorBoundary>
  );
}

DevCenterAppView.defaultProps = {
  availability: {
    hasProductSubscription: true,
    isAppSubscribedForAsset: true,
  },
};

export default DevCenterAppView;
