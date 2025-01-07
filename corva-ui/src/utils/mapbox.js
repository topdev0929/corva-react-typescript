// NOTE: Don't want to break the algorithm
import { get, isArray } from 'lodash';

export function parseLatLng(input) {
  if (!input || !(typeof input === 'string') || input.length < 1) {
    return [];
  }

  if (
    input.indexOf('N') === -1 &&
    input.indexOf('S') === -1 &&
    input.indexOf('W') === -1 &&
    input.indexOf('E') === -1
  ) {
    const coords = input.split(',');
    if (!coords[0] || !coords[1])
      return [];
    coords[0] = parseFloat(coords[0]);
    coords[1] = parseFloat(coords[1]);
    return coords;
  }

  const parts = input
    .split(/[°'"]+/)
    .join(' ')
    .split(/[^\w\S]+/);
  const directions = [];
  const coords = [];
  let dd = 0;
  let pow = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const i in parts) {
    // we end on a direction
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(parts[i])) {
      const floatNumber = parseFloat(parts[i]);

      let direction = parts[i];

      if (!Number.isNaN(floatNumber)) {
        dd += floatNumber / 60 ** pow;
        pow += 1;
        direction = parts[i].replace(floatNumber, '');
      }

      [direction] = direction;

      if (direction === 'S' || direction === 'W') {
        dd *= -1;
      }

      directions[directions.length] = direction;

      coords[coords.length] = dd;
      dd = 0;
      pow = 0;
    } else {
      dd += parseFloat(parts[i]) / 60 ** pow;
      pow += 1;
    }
  }

  if (directions[0] === 'W' || directions[0] === 'E') {
    const tmp = coords[0];
    coords[0] = coords[1]; // eslint-disable-line prefer-destructuring
    coords[1] = tmp;
  }

  return coords;
}

function toRadians(value) {
  /** Converts numeric degrees to radians */
  return (value * Math.PI) / 180;
}

export function getDistanceByCoordinates(coords1, coords2) {
  // Earth radius in meters
  const R = 6371e3;
  const mile = 1609.34;
  const phi1 = toRadians(coords1[0]);
  const phi2 = toRadians(coords2[0]);
  const deltaPhi = toRadians(coords2[0] - coords1[0]);
  const deltaLambda = toRadians(coords2[1] - coords1[1]);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c) / mile;
}

export function isValidLatLng(latLngArray) {
  let isValid = true;
  if (!isArray(latLngArray) || latLngArray.length !== 2) {
    isValid = false;
  } else {
    latLngArray.forEach(part => {
      if (!Number.isFinite(part)) {
        isValid = false;
      }
    });
  }
  return isValid;
}

export const isValidCoordinates = ([lat, lng]) => Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

export function getAssetCoordinates(asset) {
  if (!asset) {
    return null;
  }
  const coordinates = get(asset, ['top_hole', 'coordinates']);
  const raw = get(asset, ['top_hole', 'raw']);
  if (coordinates) {
    return coordinates;
  } else if (raw) {
    const parsed = parseLatLng(raw);
    if (isValidLatLng(parsed)) {
      return parsed;
    }
  }
  return null;
}

// NOTE: Data path of top_hole info may be modified for the purpose
export function getAssetV2Coordinates(asset, path = 'attributes.top_hole') {
  if (!asset) return null;
  const { coordinates, raw } = get(asset, path) || {};
  if (coordinates) return coordinates;
  if (raw) {
    const parsed = parseLatLng(raw);
    if (isValidLatLng(parsed)) return parsed;
  }
  return null;
}
