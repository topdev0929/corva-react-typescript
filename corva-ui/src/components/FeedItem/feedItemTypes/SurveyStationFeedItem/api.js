import { getAppStorage } from '~/clients/jsonApi';

export async function fetchDirectionalAccuracyRecords({ wellId, md }) {
  let records;

  try {
    records = await getAppStorage('corva', 'directional.accuracy', wellId, {
      query: `{data.actual_point.measured_depth#eq#${md}}`,
      sort: '{timestamp: -1}',
      limit: 1,
    });
  } catch (e) {
    console.error(e);
  }

  return records;
}
