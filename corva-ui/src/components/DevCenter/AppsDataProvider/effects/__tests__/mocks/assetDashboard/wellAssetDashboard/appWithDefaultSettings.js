import Jsona from 'jsona';
import { omit } from 'lodash';
import { getInitialAppsDataState } from '~/components/DevCenter/AppsDataProvider/effects/utils';

const dataFormatter = new Jsona();

const APP_ID = 'appWithDefaultProps';
const COMPANY_ID = 555;
const DASHBOARD_ASSET_ID = 111;
const RIG_ASSET_ID = 333;
const RIG_ID = 444;
const WELL_ID = 222;

export const hookProps = {
  apps: [
    {
      id: APP_ID,
      app: { platform: 'dev_center' },
    },
  ],
  dashboardAssetId: DASHBOARD_ASSET_ID,
};

const initialAppData = getInitialAppsDataState(hookProps.apps)[APP_ID];

export const initialResponse = {
  [APP_ID]: initialAppData,
};

export const resolveResponse = {
  wells: [
    {
      data: {
        id: WELL_ID,
        type: 'well',
        attributes: {
          asset_id: DASHBOARD_ASSET_ID,
        },
      },
    },
  ],
};

export const wellsResponse = {
  data: [
    {
      id: WELL_ID,
      type: 'well',
      attributes: {
        name: 'OS_Ponderosa East 10H (2022-06-27 19:34:14 UTC)',
        settings: {
          timezone: 'America/Chicago',
          top_hole: { raw: '10,11', coordinates: [10, 11] },
          bottom_hole: {},
          day_shift_start_time: '06:00',
          completion_day_shift_start_time: '06:00',
        },
        asset_id: DASHBOARD_ASSET_ID,
      },
      relationships: {
        company: { data: { id: COMPANY_ID, type: 'company' } },
        rig: { data: { id: RIG_ID, type: 'rig' } },
      },
    },
  ],
  included: [
    { id: COMPANY_ID, type: 'company' },
    {
      id: RIG_ID,
      type: 'rig',
      attributes: { name: 'Geosteering Rig', asset_id: RIG_ASSET_ID },
    },
  ],
};

const deserializedWellResponse = dataFormatter.deserialize(wellsResponse);

export const fullResponse = {
  [APP_ID]: {
    ...initialAppData,
    rig: omit(deserializedWellResponse[0].rig, 'type'),
    well: {
      ...omit(deserializedWellResponse[0], ['type', 'relationshipNames', 'rig', 'company']),
      companyId: COMPANY_ID,
    },
    isLoading: false,
  },
};
