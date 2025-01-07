import get from 'lodash/get';

export function stopPropagation(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
}

export function getSelectRenderValue(selectedValues, items, valueField, displayField) {
  return items
    .filter(item => selectedValues.includes(item[valueField]))
    .map(item => item[displayField])
    .join(', ');
}

// NOTE:
// This function is created to provided as minimal friction as possible when updating to V2
// A few of the menus use this function. It probably needs a refactor, but my only goal right
// now is to upgrade V2.
export function getSelectRenderValueV2(selectedValues, items, valueField, displayField) {
  return items
    .filter(item => selectedValues.map(String).includes(String(item[valueField])))
    .map(item => get(item, ['attributes', displayField]))
    .join(', ');
}
