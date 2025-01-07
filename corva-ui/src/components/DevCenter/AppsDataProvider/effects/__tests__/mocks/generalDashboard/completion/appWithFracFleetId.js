import Jsona from 'jsona';

import { getInitialAppsDataState } from '~/components/DevCenter/AppsDataProvider/effects/utils';

const dataFormatter = new Jsona();

const APP_ID = 1789975;
const FRAC_FLEET_ID = 32610;

export const hookProps = {
  apps: [
    {
      id: APP_ID,
      settings: { fracFleetId: FRAC_FLEET_ID, padId: null },
      app: { platform: 'dev_center' },
    },
  ],
};

const initialAppData = getInitialAppsDataState(hookProps.apps)[APP_ID];

export const initialResponse = {
  [APP_ID]: initialAppData,
};

export const fracFleetResponse = {
  data: [
    {
      id: FRAC_FLEET_ID,
      type: 'frac_fleet',
      attributes: { name: 'DustFleet', current_pad_id: 50113 },
      relationships: {
        pad_frac_fleets: {
          data: [
            { id: '7760', type: 'pad_frac_fleet' },
            { id: '8757', type: 'pad_frac_fleet' },
          ],
        },
      },
    },
  ],
  included: [
    {
      id: '7760',
      type: 'pad_frac_fleet',
      attributes: {
        current: false,
        pad: {
          id: 47082,
          name: 'DustPad',
        },
        frac_fleet: {
          id: FRAC_FLEET_ID,
          name: 'DustFleet',
        },
      },
    },
    {
      id: '8757',
      type: 'pad_frac_fleet',
      attributes: {
        current: true,
        pad: {
          id: 50113,
          name: 'DustyPad',
        },
        frac_fleet: {
          id: FRAC_FLEET_ID,
          name: 'DustFleet',
        },
      },
    },
  ],
};

export const fracFleetWellsResponse = {
  data: [
    {
      id: '339293',
      type: 'well',
      attributes: {
        asset_id: 42749077,
        name: 'Dusty3 - PSD',
      },
      relationships: {
        app_streams: { data: [{ id: '36872', type: 'app_stream' }] },
        rig: { data: { id: '187587', type: 'rig' } },
      },
    },
    {
      id: '344183',
      type: 'well',
      attributes: {
        asset_id: 47032839,
        name: 'Dusty3 - PSD (Mytiuk rerun)',
      },
      relationships: {
        app_streams: { data: [{ id: '37348', type: 'app_stream' }] },
        rig: { data: { id: '187587', type: 'rig' } },
      },
    },
  ],
  included: [
    {
      id: '36872',
      type: 'app_stream',
      attributes: {
        id: 36872,
        status: 'active',
        visibility: 'visible',
        segment: 'completion',
        source_type: 'frac',
      },
    },
    {
      id: '37348',
      type: 'app_stream',
      attributes: {
        id: 37348,
        status: 'active',
        visibility: 'visible',
        segment: 'completion',
        source_type: 'frac',
      },
    },
  ],
};

export const fullResponse = {
  [APP_ID]: {
    ...initialAppData,
    fracFleet: dataFormatter.deserialize(fracFleetResponse)[0],
    wells: dataFormatter.deserialize(fracFleetWellsResponse),
    isLoading: false,
  },
};
