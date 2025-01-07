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
};

export const AUTO_CATEGORIZE_KEYS = Object.values(SEARCH_CATEGORIES)
  .filter(item => item.autoCategorizedKey)
  .map(item => item.autoCategorizedKey);

export const CATEGORY_KEY_VALUES = Object.entries(SEARCH_CATEGORIES);
