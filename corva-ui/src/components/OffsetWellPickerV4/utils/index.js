import { get, sortBy } from 'lodash';
import { getAssets } from '~/clients/jsonApi';
import { mapbox } from '~/utils';
import { ANDROID_DEVICE, IOS_DEVICE, OTHER_DEVICE, WINDOWS_PHONE } from '../constants';

const { getAssetV2Coordinates, getDistanceByCoordinates } = mapbox;

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

export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return WINDOWS_PHONE;
  }

  if (/android/i.test(userAgent)) {
    return ANDROID_DEVICE;
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return IOS_DEVICE;
  }

  return OTHER_DEVICE;
}

async function getWells(wellIds) {
  let response = null;
  try {
    response = await getAssets({
      ids: wellIds,
      fields: ['asset.name', 'asset.top_hole', 'asset.settings'],
    });
  } catch (e) {
    console.error(e);
  }

  return response
    ? response.data.map(item => ({
        id: Number(item.id),
        name: get(item, 'attributes.name'),
        topHole: get(item, 'attributes.top_hole') ?? get(item, 'attributes.settings.top_hole'),
      }))
    : [];
}

export async function getCoordinatedWells(wellIds, subjectWellId) {
  const wells = await getWells(wellIds);
  const subjectWell = wells.find(well => well.id === subjectWellId);
  const subjectWellCoord = subjectWell && getAssetV2Coordinates(subjectWell, 'topHole');
  if (!subjectWellCoord) {
    return wells;
  }

  const coordinatedWells = await Promise.all(
    wells.map(async well => {
      try {
        const coord = await getAssetV2Coordinates(well, 'topHole');
        if (coord) {
          const distance = parseFloat(await getDistanceByCoordinates(subjectWellCoord, coord));
          return { ...well, distance: parseFloat(distance.toFixed(2)) };
        } else {
          return well;
        }
      } catch {
        return well;
      }
    })
  );
  return sortBy(coordinatedWells, 'distance');
}
