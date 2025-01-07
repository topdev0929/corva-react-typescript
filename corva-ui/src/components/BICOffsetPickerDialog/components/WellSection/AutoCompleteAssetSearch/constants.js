export const SEARCH_CATEGORIES = {
  well: {
    name: 'well',
    labelSingular: 'Well',
    labelPlural: 'Wells',
    autoCategorizedKey: 'well',
    isAssetType: true,
  },
  rig: {
    name: 'rig',
    labelSingular: 'Rig',
    labelPlural: 'Rigs',
    autoCategorizedKey: 'rig',
    isAssetType: true,
  },
  frac_fleet: {
    name: 'frac_fleet',
    labelSingular: 'Frac Fleet',
    labelPlural: 'Frac Fleets',
    autoCategorizedKey: 'frac fleet',
    isAssetType: true,
  },
  drillout_unit: {
    name: 'drillout_unit',
    labelSingular: 'Drillout unit',
    labelPlural: 'Drillout Units',
    autoCategorizedKey: 'drillout unit',
    isAssetType: true,
  },
  api_number: {
    name: 'api_number',
    labelSingular: 'API#',
    labelPlural: 'API#',
    isAssetType: false,
  },
};

export const AUTO_CATEGORIZE_KEYS = Object.values(SEARCH_CATEGORIES)
  .filter(item => item.autoCategorizedKey)
  .map(item => item.autoCategorizedKey);

export const CATEGORY_KEY_VALUES = Object.entries(SEARCH_CATEGORIES);
