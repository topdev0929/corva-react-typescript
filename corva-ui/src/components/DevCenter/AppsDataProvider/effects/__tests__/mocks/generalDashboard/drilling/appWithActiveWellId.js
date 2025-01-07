import { getInitialAppsDataState } from '~/components/DevCenter/AppsDataProvider/effects/utils';

const APP_ID = 1789664;
const RIG_ID = 1184;
const WELL_ID = 3428;
const COMPANY_ID = 80;
const ASSET_ID = 31621;
const RIG_NAME = 'AWD#1';

export const hookProps = {
  apps: [
    {
      id: APP_ID,
      settings: { rigId: RIG_ID, wellId: WELL_ID },
      app: { platform: 'dev_center' },
    },
  ],
};

const initialAppData = getInitialAppsDataState(hookProps.apps)[APP_ID];

export const initialResponse = {
  [APP_ID]: initialAppData,
};

export const fullResponse = {
  [APP_ID]: {
    ...initialAppData,
    rig: { name: RIG_NAME, id: RIG_ID, asset_id: ASSET_ID },
    well: {
      id: WELL_ID,
      companyId: COMPANY_ID,
    },
    isLoading: false,
  },
};

export const wellsResponse = {
  data: [
    {
      id: WELL_ID,
      type: 'well',
      relationships: {
        company: { data: { id: COMPANY_ID, type: 'company' } },
        rig: { data: { id: RIG_ID, type: 'rig' } },
      },
    },
  ],
  included: [{ id: RIG_ID, type: 'rig', attributes: { name: RIG_NAME, asset_id: ASSET_ID } }],
};
