export const DATA_SOURCE_TYPE = {
  offsetWellSelectionApp: 'offsetWellSelectionApp',
  wellHub: 'Wellhub',
  customSelection: 'CustomSelection',
};

export const FILTER_BASEDON_TYPE = {
  entireWell: 'entireWell',
  wellSections: 'wellSections',
};

export const SELECTION_TAB_TYPE = {
  bic: 'bic',
  custom: 'custom',
};

export const SELECTION_TABS_LABEL = {
  wellhub: 'Well Hub Selection',
  offsetWell: 'Offset Wells from App',
  custom: 'Custom Selection',
};

export const ALL_KEY = 'all';
export const WELL_NAME_KEY = 'name';

export const DEFAULT_WELL_SECTIONS = [
  { name: 'Entire Well', wells: [], expanded: false },
  { name: 'Surface', wells: [], expanded: false },
  { name: 'Intermediate', wells: [], expanded: false },
  { name: 'Production Lateral', wells: [], expanded: false },
  { name: 'Production Vertical', wells: [], expanded: false },
  { name: 'Production Curve', wells: [], expanded: false },
];
