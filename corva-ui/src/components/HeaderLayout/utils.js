// NOTE: Get components based on "key" props specified
export function getAppTitle(components) {
  return components.find(item => item && item.key && item.key.includes('title'));
}

export function getAppSubTitle(components) {
  return components.find(item => item && item.key && item.key.includes('subtitle'));
}

export function getExpander(components) {
  return components.find(item => item && item.key && item.key.includes('expander'));
}

export function getOffsetPicker(components) {
  return components.find(item => item && item.key && item.key.includes('offset-picker'));
}

export function getSecondaryAsset(components) {
  return components.find(item => item && item.key && item.key.includes('secondary-asset'));
}

export function getModeSelect(components) {
  return components.find(item => item && item.key && item.key.includes('mode-select'));
}

export function getPadChip(components) {
  return components.find(item => item && item.key && item.key.includes('pad-chip'));
}

export function getPrimaryAsset(components) {
  return components.find(item => item && item.key && item.key.includes('primary-asset'));
}

export function getOffsetWellsChip(components) {
  return components.find(item => item && item.key && item.key.includes('offset-chip'));
}
