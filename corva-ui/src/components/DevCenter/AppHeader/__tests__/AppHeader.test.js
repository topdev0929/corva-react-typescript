import { render } from '@testing-library/react';

import { SEGMENTS } from '~constants/segment';
import AppHeader, { PAGE_NAME } from '../AppHeader';

const TEST_ID = {
  ANNOTATIONS: 'annotations',
  PAD_ICON: 'padIcon',
  PAD_MODE: 'padMode',
  VERSION_BADGE: 'versionBadge',
};

jest.mock('~/components/Annotations', () => ({
  LastAnnotation: () => <div data-testid={TEST_ID.ANNOTATIONS} />,
}));
jest.mock('~/components/DevCenter/AppHeader/PadMode', () => () => (
  <div data-testid={TEST_ID.PAD_MODE} />
));
jest.mock('~/components/DevCenter/AppHeader/VersionBadge', () => ({
  VersionBadge: () => <div data-testid={TEST_ID.VERSION_BADGE} />,
}));
jest.mock('../PadIcon', () => ({ PadIcon: () => <div data-testid={TEST_ID.PAD_ICON} /> }));

const minimalAppHeaderProps = {
  app: {},
  classes: {},
  showLastAnnotation: true,
  updateCurrentDashboardAppLastAnnotation: () => {},
  // NOTE: these props are not required but they should be passed in order to render controls
  coordinates: { pixelWidth: 1024 },
};

const mergeProps = props => ({ ...minimalAppHeaderProps, ...props });

describe('AppHeader', () => {
  it('renders without errors with minimal props', () => {
    const { container } = render(<AppHeader {...minimalAppHeaderProps} />);

    expect(container).toBeInTheDocument();
  });

  describe('App name', () => {
    const APP_NAME = 'My awesome app';

    it('renders app name from manifest.json', () => {
      const { getByTestId } = render(
        <AppHeader
          {...mergeProps({ app: { package: { manifest: { application: { name: APP_NAME } } } } })}
        />
      );

      expect(getByTestId(`${PAGE_NAME}_name`)).toHaveTextContent(APP_NAME);
    });

    it('renders app name from app', () => {
      const { getByTestId } = render(<AppHeader {...mergeProps({ app: { name: APP_NAME } })} />);

      expect(getByTestId(`${PAGE_NAME}_name`)).toHaveTextContent(APP_NAME);
    });
  });

  it('renders app subtitle if any', () => {
    const APP_SUBTITLE = 'App subtitle';

    const { getByTestId } = render(
      <AppHeader
        {...mergeProps({
          app: { package: { manifest: { application: { subtitle: APP_SUBTITLE } } } },
        })}
      />
    );

    expect(getByTestId(`${PAGE_NAME}_subtitle`)).toHaveTextContent(APP_SUBTITLE);
  });

  // NOTE: VersionBadge component is dested in it's own test file
  it('renders version badge component', () => {
    const { getByTestId } = render(<AppHeader {...minimalAppHeaderProps} />);

    expect(getByTestId(TEST_ID.VERSION_BADGE)).toBeInTheDocument();
  });

  it('renders app logo if any', () => {
    const LOGO_SRC = 'logo src';
    const { getByRole } = render(<AppHeader {...mergeProps({ logoSrc: LOGO_SRC })} />);

    expect(getByRole('img')).toHaveAttribute('src', LOGO_SRC);
  });

  it('renders badge if any', () => {
    const BADGE_TEST_ID = 'Badge';
    const { getByTestId } = render(
      <AppHeader {...mergeProps({ badge: <div data-testid={BADGE_TEST_ID} /> })} />
    );

    expect(getByTestId(BADGE_TEST_ID)).toBeInTheDocument();
  });

  it('renders annotations if any', () => {
    const { getByTestId } = render(
      <AppHeader {...mergeProps({ showLastAnnotation: true, appLastAnnotation: {} })} />
    );

    expect(getByTestId(TEST_ID.ANNOTATIONS)).toBeInTheDocument();
  });

  describe('Drilling App Header', () => {
    it('does not render PadMode', () => {
      const { queryByTestId } = render(
        <AppHeader
          {...mergeProps({
            app: { package: { manifest: { application: { segments: [SEGMENTS.DRILLING] } } } },
          })}
        />
      );

      expect(queryByTestId(TEST_ID.PAD_MODE)).toBeNull();
    });

    describe('Primary chip', () => {
      const RIG_NAME = 'My awesome rig';
      const RIG_ID = 'Rig id';

      it('renders primary chip if app has rigId', () => {
        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.DRILLING] } } },
                settings: { rigId: RIG_ID },
              },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_primaryAsset`)).toBeInTheDocument();
      });

      it('renders primary chip name if there is a rig', () => {
        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.DRILLING] } } },
                settings: { rigId: RIG_ID },
              },
              rig: { name: RIG_NAME },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_primaryAsset`)).toHaveTextContent(RIG_NAME);
      });
    });

    describe('Secondary chip', () => {
      const WELL_NAME = 'My awesome well';

      it('renders secondary chip with well name if app has wellId and well name', () => {
        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.DRILLING] } } },
                settings: { wellId: 'Well id' },
              },
              well: { name: WELL_NAME },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_secondaryAsset`)).toHaveTextContent(WELL_NAME);
        expect(queryByTestId(TEST_ID.PAD_ICON)).not.toBeInTheDocument();
      });
    });
  });

  describe('Completion App Header', () => {
    it('renders PadMode', () => {
      const { getByTestId } = render(
        <AppHeader
          {...mergeProps({
            app: { package: { manifest: { application: { segments: [SEGMENTS.COMPLETION] } } } },
          })}
        />
      );

      expect(getByTestId(TEST_ID.PAD_MODE)).toBeInTheDocument();
    });

    describe('Primary chip', () => {
      it('renders primary chip with frac fleet name if any', () => {
        const FRAC_FLEET_NAME = 'My awesome frac fleet';

        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.COMPLETION] } } },
                settings: { fracFleetId: 'frac fleet id' },
              },
              fracFleet: { name: FRAC_FLEET_NAME, pad_frac_fleets: [] },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_primaryAsset`)).toHaveTextContent(FRAC_FLEET_NAME);
      });

      // NOTE: asset dashboard
      it('renders primary chip with well name if any', () => {
        const WELL_NAME = 'My awesome well';

        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: { package: { manifest: { application: { segments: [SEGMENTS.COMPLETION] } } } },
              well: { id: 'well id', name: WELL_NAME },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_primaryAsset`)).toHaveTextContent(WELL_NAME);
      });
    });

    describe('Secondary chip', () => {
      const PAD_NAME = 'My awesome pad';
      const PAD_ID = 42;

      it('renders secondary chip with SELECTED pad name', () => {
        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.COMPLETION] } } },
                settings: { padId: PAD_ID },
              },
              fracFleet: { pad_frac_fleets: [{ pad: { id: PAD_ID, name: PAD_NAME } }] },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_secondaryAsset`)).toHaveTextContent(PAD_NAME);
        expect(queryByTestId(TEST_ID.PAD_ICON)).toBeInTheDocument();
      });

      it('renders secondary chip with ACTIVE pad name if pad was not selected', () => {
        const { queryByTestId } = render(
          <AppHeader
            {...mergeProps({
              app: {
                package: { manifest: { application: { segments: [SEGMENTS.COMPLETION] } } },
                settings: {},
              },
              fracFleet: {
                current_pad_id: PAD_ID,
                pad_frac_fleets: [{ pad: { id: PAD_ID, name: PAD_NAME } }],
              },
            })}
          />
        );

        expect(queryByTestId(`${PAGE_NAME}_secondaryAsset`)).toHaveTextContent(PAD_NAME);
        expect(queryByTestId(TEST_ID.PAD_ICON)).toBeInTheDocument();
      });
    });
  });
});
