import { getAppStorage } from '~/clients/jsonApi';

export async function fetchPredictionsData({ wellId, stageNumber }) {
  let data = {};

  try {
    const records = await getAppStorage('corva', 'completion.predictions', wellId, {
      query: `{stage_number#eq#${stageNumber}}`,
      sort: '{timestamp: -1}',
      limit: 1,
    });

    data = records[0].data;
  } catch (e) {
    console.error(e);
  }

  return data;
}

export async function fetchStagesData({ wellId, stageNumber }) {
  let data = {};

  try {
    const records = await getAppStorage('corva', 'completion.data.stages', wellId, {
      query: `{data.stage_number#eq#${stageNumber}}`,
      sort: '{timestamp: -1}',
      limit: 1,
    });
    [data] = records;
  } catch (e) {
    console.error(e);
  }

  return data;
}
