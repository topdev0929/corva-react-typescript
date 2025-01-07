import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import * as jsonApi from '~/clients/jsonApi';

import useAppsData from '~/components/DevCenter/AppsDataProvider/effects/useAppsData';
import {
  appWithRigId,
  appWithActiveWellId,
  appWithFracFleetId,
  appWithPadId,
  appWithDefaultSettings,
} from './mocks';

const { getRigs, getWells, getFracFleets, getFracFleetWells, getPadWells, getResolvedAssets } =
  jsonApi;

jest.mock('~/clients/jsonApi');

beforeEach(() => {
  getRigs.mockReset();
  getWells.mockReset();
  getFracFleets.mockReset();
  getFracFleetWells.mockReset();
  getPadWells.mockReset();
  getResolvedAssets.mockReset();
});

const testAppData = (testName, mocks, mockAPI) => {
  describe(testName, () => {
    it('returns initial app data object on first run', async () => {
      const { result } = renderHook(() => useAppsData(mocks.hookProps));
      await waitFor(() => expect(result.current).toStrictEqual(mocks.initialResponse));
    });

    it('returns full response after data fetching', async () => {
      mockAPI();

      const { result, waitForNextUpdate } = renderHook(() => useAppsData(mocks.hookProps));
      await waitForNextUpdate();
      expect(result.current).toStrictEqual(mocks.fullResponse);
    });
  });
};

describe('useAppsData', () => {
  it('returns empty object for empty dashboard', async () => {
    const { result } = renderHook(() => useAppsData({ apps: [] }));
    await waitFor(() => expect(result.current).toStrictEqual({}));
  });

  describe('handling of failed responses', () => {
    it('sets isLoading=true after resolving even if fetching failed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAppsData(appWithRigId.hookProps));
      getRigs.mockResolvedValue(null);
      await waitForNextUpdate();
      expect(result.current[appWithRigId.APP_ID].isLoading).toEqual(false);
    });

    it('returns null values for rig/well/fracFleet/wells', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAppsData(appWithRigId.hookProps));
      getRigs.mockResolvedValue(null);
      await waitForNextUpdate();
      const hookResponse = result.current[appWithRigId.APP_ID];

      expect(hookResponse.rig).toEqual(null);
      expect(hookResponse.well).toEqual(null);
      expect(hookResponse.fracFleet).toEqual(null);
      expect(hookResponse.wells).toEqual(null);
    });
  });

  describe('general dashboard', () => {
    describe('single drilling app', () => {
      testAppData('app with rig id selected', appWithRigId, () =>
        getRigs.mockResolvedValue(appWithRigId.rigsResponse)
      );

      testAppData('app with active well id selected', appWithActiveWellId, () =>
        getWells.mockResolvedValue(appWithActiveWellId.wellsResponse)
      );
    });

    describe('single completion app', () => {
      testAppData('app with frac_fleet id selected', appWithFracFleetId, () => {
        getFracFleets.mockResolvedValue(appWithFracFleetId.fracFleetResponse);
        getFracFleetWells.mockResolvedValue(appWithFracFleetId.fracFleetWellsResponse);
      });

      testAppData('app with pad id selected', appWithPadId, () => {
        getFracFleets.mockResolvedValue(appWithPadId.fracFleetResponse);
        getPadWells.mockResolvedValue(appWithPadId.padWellsResponse);
      });
    });

    describe('multiple different apps', () => {
      testAppData(
        'drilling app with seleted well and completion app with selected pad',
        {
          hookProps: {
            apps: [...appWithActiveWellId.hookProps.apps, ...appWithPadId.hookProps.apps],
          },
          initialResponse: {
            ...appWithActiveWellId.initialResponse,
            ...appWithPadId.initialResponse,
          },
          fullResponse: { ...appWithActiveWellId.fullResponse, ...appWithPadId.fullResponse },
        },
        () => {
          getWells.mockResolvedValue(appWithActiveWellId.wellsResponse);
          getFracFleets.mockResolvedValue(appWithPadId.fracFleetResponse);
          getPadWells.mockResolvedValue(appWithPadId.padWellsResponse);
        }
      );

      testAppData(
        'drilling app with seleted rig and completion app with selected fracFleet',
        {
          hookProps: {
            apps: [...appWithRigId.hookProps.apps, ...appWithFracFleetId.hookProps.apps],
          },
          initialResponse: {
            ...appWithRigId.initialResponse,
            ...appWithFracFleetId.initialResponse,
          },
          fullResponse: {
            ...appWithRigId.fullResponse,
            ...appWithFracFleetId.fullResponse,
          },
        },
        () => {
          getRigs.mockResolvedValue(appWithRigId.rigsResponse);
          getFracFleets.mockResolvedValue(appWithFracFleetId.fracFleetResponse);
          getFracFleetWells.mockResolvedValue(appWithFracFleetId.fracFleetWellsResponse);
        }
      );
    });

    describe('dynamic flow', () => {
      // NOTE: empty dashboard
      const { result, rerender } = renderHook(useAppsData, {
        initialProps: { apps: [] },
      });

      it('returns empty obj for empty db', () => {
        expect(result.current).toStrictEqual({});
      });

      describe('add first app to db', () => {
        it('returns initial app data for added app on first run', async () => {
          // NOTE: should be resolved before rerender
          getRigs.mockResolvedValue(appWithRigId.rigsResponse);

          // NOTE: add single drilling app to dashboard
          rerender(appWithRigId.hookProps);

          await waitFor(() => {
            expect(result.current).toStrictEqual(appWithRigId.initialResponse);
          });
        });

        it('return full app data with isLoading = false for added app on next update', () => {
          expect(result.current).toStrictEqual(appWithRigId.fullResponse);
        });
      });

      describe('add second app to db', () => {
        it('returns cached data for first app and initial app data for added app', async () => {
          // NOTE: should be resolved before rerender
          getFracFleets.mockResolvedValue(appWithFracFleetId.fracFleetResponse);
          getFracFleetWells.mockResolvedValue(appWithFracFleetId.fracFleetWellsResponse);

          // NOTE: add one more app to db
          rerender({
            apps: [...appWithRigId.hookProps.apps, ...appWithFracFleetId.hookProps.apps],
          });

          await waitFor(() => {
            expect(result.current).toStrictEqual({
              ...appWithRigId.fullResponse,
              ...appWithFracFleetId.initialResponse,
            });
          });
        });

        it('returns full data for all apps on next update', () => {
          expect(result.current).toStrictEqual({
            ...appWithRigId.fullResponse,
            ...appWithFracFleetId.fullResponse,
          });
        });
      });

      describe('remove app from db', () => {
        it('returns cached data for remaining app without redundant rerenders', async () => {
          rerender(appWithFracFleetId.hookProps);

          expect(result.current).toStrictEqual(appWithFracFleetId.fullResponse);
        });
      });
    });
  });

  describe('assets dashboard', () => {
    describe('well asset dashboard', () => {
      testAppData('app with default settings', appWithDefaultSettings, () => {
        getResolvedAssets.mockResolvedValue(appWithDefaultSettings.resolveResponse);
        getWells.mockResolvedValue(appWithDefaultSettings.wellsResponse);
      });
    });
    // TODO: add tests for app with settings
  });

  // TODO: add test for feed dashboard
});
