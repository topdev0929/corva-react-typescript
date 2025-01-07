import Jsona from 'jsona';
import { SEGMENTS } from '~/constants/segment';

import * as jsonApi from '~/clients/jsonApi';

const findWellHubSlug = dashboards =>
  dashboards.find(db => db.name === 'Wellhub' && db.icon === 'settings')?.slug;

async function resolveWellHubSlug(dashboards = []) {
  // 1: Try searching well hub slug in existing dashboards
  let wellHubSlug = findWellHubSlug(dashboards);

  if (!wellHubSlug) {
    // 2: Could not find well hub dashboard slug. Probably user is on general dashboard
    // Send request for asset dashboard and try to find there
    const dataFormatter = new Jsona();
    try {
      const response = await jsonApi.getDashboards({
        layout: 'tabs',
        segment: SEGMENTS.DRILLING,
        type: 'asset_dashboard',
        visibility: 'visible',
      });
      const assetDashboards = dataFormatter.deserialize(response);
      wellHubSlug = findWellHubSlug(assetDashboards);
    } catch (e) {
      console.error(e);
    }
  }

  return wellHubSlug;
}

export default resolveWellHubSlug;
