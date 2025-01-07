import { getUnitPreference, getUnitDescription } from '~/utils';

export function getIsImperial() {
  const { system } = getUnitDescription(getUnitPreference('length'));
  return system === 'imperial';
}
