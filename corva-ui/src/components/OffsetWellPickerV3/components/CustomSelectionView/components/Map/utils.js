import { get, sortBy } from 'lodash';
import { FORMATION_COLORS } from '../../constants';

// NOTE: Get unique formations & determine its colors
export function getAllFormations(wells) {
  const formations = [];
  let hasNullFormation = false;

  wells.forEach(well => {
    if (well.formation === 'Null') {
      hasNullFormation = true;
    } else if (!formations.includes(get(well, 'formation'))) {
      formations.push(get(well, 'formation'));
    }
  });
  const sortedFormations = sortBy(formations);
  if (hasNullFormation && !sortedFormations.includes('Null')) {
    sortedFormations.push('Null');
  }
  const colors = sortedFormations.reduce(
    (result, item, idx) => ({
      ...result,
      [item]: FORMATION_COLORS[idx % FORMATION_COLORS.length],
    }),
    {}
  );
  return [sortedFormations, colors];
}
