import { get, sortBy } from 'lodash';

const FORMATION_COLORS = [
  '#FF00FF',
  '#F5BD80',
  '#FF0000',
  '#0080FF',
  '#FF8000',
  '#58ACFA',
  '#FA58F4',
  '#40FF00',
  '#4B8A08',
  '#40FF00',
  '#D8F781',
];

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
  return colors;
}
