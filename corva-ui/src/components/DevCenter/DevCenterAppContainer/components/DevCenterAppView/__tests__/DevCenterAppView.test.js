import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { APP_MESSAGES } from '~/components/EmptyView/EmptyAppView/EmptyAppView';
import { SEGMENTS } from '~/constants/segment';

import DevCenterAppView, { getNoActiveWellMessage } from '../DevCenterAppView';
import { PAGE_NAME as CHOOSE_DATA_TEST_ID } from '../components/ChooseAssetButton';
import { PAGE_NAME as APP_INFO_MESSAGE_TEST_ID } from '../../AppInfoMessage/AppInfoMessage';

const TEST_IDS = {
  LOADING_INDICATOR: 'loadingIndicator',
};
const APP = {
  package: { manifest: { application: { name: 'My awesome app' } } },
  settings: {},
};
const withProps = (props = {}) => <DevCenterAppView app={APP} {...props} />;

jest.mock('~/components/LoadingIndicator', () => () => (
  <div data-testid={TEST_IDS.LOADING_INDICATOR} />
));

const testChooseAssetButton = props =>
  describe('ChooseAssetButton', () => {
    it('does not render ChooseAssetButton for non CLI app', () => {
      const { queryByTestId } = render(withProps(props));

      expect(queryByTestId(CHOOSE_DATA_TEST_ID)).toBeNull();
    });

    describe('CLI app', () => {
      it('renders ChooseAssetButton', () => {
        const { getByTestId } = render(withProps({ ...props, isCLIApp: true }));

        expect(getByTestId(CHOOSE_DATA_TEST_ID)).toBeInTheDocument();
      });

      it('calls toggleAppSettingsDialog onClick', () => {
        const toggleAppSettingsDialog = jest.fn();
        const { getByTestId } = render(
          withProps({ ...props, isCLIApp: true, toggleAppSettingsDialog })
        );

        fireEvent.click(getByTestId(CHOOSE_DATA_TEST_ID));
        expect(toggleAppSettingsDialog).toHaveBeenCalled();
      });
    });
  });

describe('DevCenterAppView', () => {
  it('should render DevCenterAppView without errors', () => {
    const { container } = render(withProps());

    expect(container).toBeInTheDocument();
  });

  it(`renders ${APP_MESSAGES.appPackageWasNotFound.title} error if app has not package`, () => {
    const { getByText } = render(withProps({ app: {} }));

    expect(getByText(APP_MESSAGES.appPackageWasNotFound.title)).toBeInTheDocument();
    expect(getByText(APP_MESSAGES.appPackageWasNotFound.subtitle)).toBeInTheDocument();
  });

  it('renders loading indicator if isLoading', () => {
    const { getByTestId } = render(withProps({ isLoading: true }));

    expect(getByTestId(TEST_IDS.LOADING_INDICATOR)).toBeInTheDocument();
  });

  it(`renders ${APP_MESSAGES.appNotSubscribed.title} if app does not have PRODUCT subscription `, () => {
    const { getByText } = render(withProps({ availability: { hasProductSubscription: false } }));

    expect(getByText(APP_MESSAGES.appNotSubscribed.title)).toBeInTheDocument();
    expect(getByText(APP_MESSAGES.appNotSubscribed.subtitle)).toBeInTheDocument();
  });

  it(`renders ${APP_MESSAGES.appNotSubscribedForAsset.title} if app does not have ASSET subscription `, () => {
    const { getByText } = render(
      withProps({ availability: { hasProductSubscription: true, isAppSubscribedForAsset: false } })
    );

    expect(getByText(APP_MESSAGES.appNotSubscribedForAsset.title)).toBeInTheDocument();
    expect(getByText(APP_MESSAGES.appNotSubscribedForAsset.subtitle)).toBeInTheDocument();
  });

  it(`renders ${APP_MESSAGES.appComponentWasNotFound.title} if there is no AppComponent`, () => {
    const { getByText } = render(
      withProps({ availability: { hasProductSubscription: true, isAppSubscribedForAsset: true } })
    );

    expect(getByText(APP_MESSAGES.appComponentWasNotFound.title)).toBeInTheDocument();
  });

  describe('non MultiRigApp', () => {
    describe('drilling app', () => {
      const RIG_NAME = 'My awesome rig';
      const drillingAppProps = {
        availability: { hasProductSubscription: true, isAppSubscribedForAsset: true },
        AppComponent: {},
        appData: { rig: { name: RIG_NAME } },
      };

      it(`renders No Active Well message if there is rig but not well in appData`, () => {
        const { getByText } = render(withProps(drillingAppProps));

        expect(getByText(getNoActiveWellMessage(RIG_NAME))).toBeInTheDocument();
      });

      testChooseAssetButton(drillingAppProps);
    });

    describe('completion app on general dashboard', () => {
      const completionAppProps = {
        availability: { hasProductSubscription: true, isAppSubscribedForAsset: true },
        AppComponent: {},
        segment: SEGMENTS.COMPLETION,
        layoutEnvironment: { type: 'general' },
        appData: {},
      };

      describe('no frac fleet', () => {
        it(`renders ${APP_MESSAGES.fracFleetWasNotFound.title} messages if there is no frac fleet in appData`, () => {
          const { getByText } = render(withProps(completionAppProps));

          expect(getByText(APP_MESSAGES.fracFleetWasNotFound.title)).toBeInTheDocument();
        });

        testChooseAssetButton(completionAppProps);
      });

      describe('no pad', () => {
        const props = { ...completionAppProps, appData: { fracFleet: {} } };
        it(`renders ${APP_MESSAGES.fracFleetHasNoPad.title} messages if there is no curent pad and padId in settings`, () => {
          const { getByText } = render(withProps(props));

          expect(getByText(APP_MESSAGES.fracFleetHasNoPad.title)).toBeInTheDocument();
        });

        testChooseAssetButton(props);
      });

      describe('no wells', () => {
        const props = { ...completionAppProps, appData: { fracFleet: { current_pad_id: 42 } } };
        it(`renders ${APP_MESSAGES.padHasNoWells.title} messages if there are no wells in appData`, () => {
          const { getByText } = render(withProps(props));

          expect(getByText(APP_MESSAGES.padHasNoWells.title)).toBeInTheDocument();
        });

        it(`renders ${APP_MESSAGES.padHasNoWells.title} messages if there are no wells`, () => {
          const { getByText } = render(
            withProps({
              ...completionAppProps,
              appData: { fracFleet: { current_pad_id: 42 }, wells: [] },
            })
          );

          expect(getByText(APP_MESSAGES.padHasNoWells.title)).toBeInTheDocument();
        });

        testChooseAssetButton(props);
      });
    });

    describe('empty app data', () => {
      const props = {
        availability: { hasProductSubscription: true, isAppSubscribedForAsset: true },
        AppComponent: {},
        appData: {},
      };

      it(`renders ${APP_MESSAGES.noAssetData.title} messages if there are assets`, () => {
        const { getByText } = render(withProps(props));

        expect(getByText(APP_MESSAGES.noAssetData.title)).toBeInTheDocument();
      });

      testChooseAssetButton(props);
    });
  });

  const testRegularApp = (testTitle, additionalProps = {}) =>
    describe(`regular app - ${testTitle}`, () => {
      const COMPONENT_TEST_ID = 'componentTestId';
      const AppComponent = props => (
        <div data-testid={COMPONENT_TEST_ID}>{JSON.stringify(props)}</div>
      );
      const regularAppProps = {
        availability: { hasProductSubscription: true, isAppSubscribedForAsset: true },
        AppComponent,
        appData: {},
        openIntercom: () => {},
        appProps: { appProp1: 'appProp1' },
        app: { ...APP, settings: { rigId: 'rigId' } },
        ...additionalProps,
      };

      it('renders AppComponent without errors', () => {
        const { getByTestId } = render(withProps(regularAppProps));

        expect(getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
      });

      it('does not render AppInfoMessage', () => {
        const { queryByTestId } = render(withProps(regularAppProps));

        expect(queryByTestId(APP_INFO_MESSAGE_TEST_ID)).toBeNull();
      });

      // NOTE: props are stringified inside the mocked component
      it('passes all required props to AppComponent', () => {
        const tree = render(withProps(regularAppProps)).baseElement;

        expect(tree).toMatchSnapshot();
      });

      it(`renders ${APP_MESSAGES.internalAppError.title} in case of error`, () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByText } = render(
          withProps({
            ...regularAppProps,
            AppComponent: () => {
              throw new Error('Should be caught by ErrorBoundary');
            },
          })
        );

        expect(getByText(APP_MESSAGES.internalAppError.title)).toBeInTheDocument();
      });
    });

  testRegularApp('with actual appData', { appData: { well: {} } });
  testRegularApp('multirig app', { isMultiRig: true });

  // TODO: add test for openIntercom link
  // TODO: add test for correct image on AppInforPage
});
