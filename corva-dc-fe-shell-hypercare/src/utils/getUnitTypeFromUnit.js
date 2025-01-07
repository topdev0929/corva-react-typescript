import { memoize, some } from 'lodash';
import { getAllUnitTypes, getUnitsByType } from '@corva/ui/utils';

export const getUnitTypeFromUnit = memoize(unit => {
  if (!unit) {
    return null;
  }
  const allUnitTypes = getAllUnitTypes();
  let unitDefinition = allUnitTypes.find(item => item.metric === unit || item.imperial === unit);
  if (unitDefinition) {
    return unitDefinition.type;
  }

  unitDefinition = allUnitTypes.find(item => some(getUnitsByType(item.type), { abbr: unit }));
  return unitDefinition?.type ?? null;
});
