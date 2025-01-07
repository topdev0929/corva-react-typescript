import Jsona from 'jsona';

import { getInitialAppsDataState } from '~/components/DevCenter/AppsDataProvider/effects/utils';

const dataFormatter = new Jsona();

const APP_ID = 1789975;
const FRAC_FLEET_ID = 15999;
const PAD_ID = 24836;

export const hookProps = {
  apps: [
    {
      id: APP_ID,
      settings: { fracFleetId: FRAC_FLEET_ID, padId: PAD_ID },
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
      attributes: { name: 'Fraser Frac Fleet', current_pad_id: 21069 },
      relationships: {
        pad_frac_fleets: {
          data: [
            { id: '2426', type: 'pad_frac_fleet' },
            { id: '1741', type: 'pad_frac_fleet' },
          ],
        },
      },
    },
  ],
  included: [
    {
      id: '2426',
      type: 'pad_frac_fleet',
      attributes: {
        current: false,
        pad: {
          id: 24836,
          name: 'Custom Channel Pad',
        },
        frac_fleet: {
          id: FRAC_FLEET_ID,
          name: 'Fraser Frac Fleet',
        },
      },
    },
    {
      id: '1741',
      type: 'pad_frac_fleet',
      attributes: {
        current: true,
        pad: {
          id: 21069,
          name: 'Fraser Pad (ivan test ------ long long name long long namelong long namelong long name)',
        },
        frac_fleet: {
          id: FRAC_FLEET_ID,
          name: 'Fraser Frac Fleet',
        },
      },
    },
  ],
};

export const padWellsResponse = {
  data: [
    {
      id: '203023',
      type: 'well',
      attributes: {
        asset_id: 30513536,
        name: 'Custom CSV Channels 10/29 GL112',
      },
      relationships: {
        app_streams: { data: [{ id: '25372', type: 'app_stream' }] },
        rig: { data: { id: '37923', type: 'rig' } },
      },
    },
  ],
  included: [
    {
      id: '25372',
      type: 'app_stream',
      attributes: {
        id: 25372,
        status: 'idle',
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
    wells: dataFormatter.deserialize(padWellsResponse),
    isLoading: false,
  },
};
