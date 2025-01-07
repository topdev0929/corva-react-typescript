import { fromJS } from 'immutable';

export const NAME = 'assets';

export const LOAD_ASSETS = 'LOAD_ASSETS';
export const LOAD_ASSETS_ATTEMPT = 'LOAD_ASSETS_ATTEMPT';
export const LOAD_ASSETS_ERROR = 'LOAD_ASSETS_ERROR';
export const UNLOAD_ASSET = 'UNLOAD_ASSET';
export const UPDATE_CURRENT_PAGE_ASSETS = 'UPDATE_CURRENT_PAGE_ASSETS';
export const CLEAR_CURRENT_PAGE_ASSETS = 'CLEAR_CURRENT_PAGE_ASSETS';

export const ASSET_TYPES = fromJS({
  rig: {
    name: 'rig',
    labelSingular: 'Rig',
    labelPlural: 'Rigs',
    parent_type: 'program',
    isResolvedToActiveChild: true,
  },
  well: {
    name: 'well',
    labelSingular: 'Well',
    labelPlural: 'Wells',
    parent_type: 'rig',
    isResolvedToActiveChild: false,
  },
  program: {
    name: 'program',
    labelSingular: 'Program/BU',
    labelPlural: 'Programs/BUs',
    isResolvedToActiveChild: false,
  },
  frac_fleet: {
    name: 'frac_fleet',
    labelSingular: 'Frac Fleet',
    labelPlural: 'Frac Fleets',
    isResolvedToActiveChild: false,
  },
  pad: {
    name: 'pad',
    labelSingular: 'Pad',
    labelPlural: 'Pads',
    isResolvedToActiveChild: false,
  },
  drillout_unit: {
    name: 'drillout_unit',
    labelSingular: 'Drillout unit',
    labelPlural: 'Drillout Units',
    isResolvedToActiveChild: false,
  },
});

export const CORVA_WELLSECTIONS = [
  'Surface',
  'Intermediate',
  'Intermediate Vertical',
  'Intermediate Curve',
  'Intermediate 1',
  'Intermediate 2',
  'Production',
  'Production Vertical',
  'Production Curve',
  'Production Lateral',
  'Rig Move',
  'Rig Skid',
];
