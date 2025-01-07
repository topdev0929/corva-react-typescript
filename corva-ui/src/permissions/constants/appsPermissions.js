import { stringifyPermission } from '../utils';
import { ABILITIES } from './abilities';

export default {
  // SETTINGS APPS
  canViewCorvaAssetStatus: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'corva.asset-status',
  }),
  canViewCorvaDrilloutAssetStatus: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'corva.drillout.asset-status-ui',
  }),
  canViewCorvaMultiAssetStatus: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'corva.multi-asset-status',
  }),
};
