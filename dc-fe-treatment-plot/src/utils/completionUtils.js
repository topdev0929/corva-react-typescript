import { first, concat, sortBy, slice, get } from 'lodash';

import { resolveActiveFracAsset, resolveActiveWirelineAsset } from '@corva/ui/utils/completion';
import { jsonApi } from '@corva/ui/clients';
import { CORVA_PROVIDER } from '../constants';

export const resolveCurrentAssetByPadMode = (assets, padModeSetting) => {
  const { mode, selectedAssets } = padModeSetting;

  if (mode === 'pad') {
    return resolveActiveFracAsset(assets) || first(assets); // Note: first asset is the latest well by its stream last_updated_at
  } else if (mode === 'active_frac') {
    return resolveActiveFracAsset(assets);
  } else if (mode === 'active_wireline') {
    return resolveActiveWirelineAsset(assets);
  } else if (mode === 'custom') {
    const targetAssetId = first(selectedAssets);

    return assets.find(asset => Number(asset.id) === Number(targetAssetId));
  }

  return null;
};

export const fetchLastWit = async assetId => {
  const fields = ['timestamp', 'asset_id', 'stage_number', 'collection'].join(',');

  try {
    const result = await jsonApi.getAppStorage(CORVA_PROVIDER, 'completion.wits', assetId, {
      limit: 1,
      fields,
      sort: '{timestamp: -1}',
    });

    return first(result);
  } catch (e) {
    return {};
  }
};

export const fetchNStageTimeRecords = async (
  assetId,
  sourceType = 'frac',
  n = 100,
  firstTimestamp = null,
  lastTimestamp = null
) => {
  const collection = sourceType === 'frac' ? 'completion.stage-times' : 'wireline.stage-times';
  const stageStartField = sourceType === 'frac' ? 'data.stage_start' : 'data.recorded.stage_start';
  const stageEndField = sourceType === 'frac' ? 'data.stage_end' : 'data.recorded.stage_end';

  let $match = {
    asset_id: assetId,
  };

  if (n > 1 && firstTimestamp && lastTimestamp) {
    $match = {
      $or: [
        { [stageStartField]: { $gte: firstTimestamp, $lte: lastTimestamp } },
        { [stageEndField]: { $gte: firstTimestamp, $lte: lastTimestamp } },
      ],
      ...$match,
    };
  } else if (lastTimestamp) {
    $match[stageStartField] = { $lte: lastTimestamp };
  }

  const $project = {
    _id: 0,
    asset_id: 1,
    stage_number: 1,
    'data.stage_start': 1,
    'data.stage_end': 1,
    'data.recorded.stage_start': 1,
    'data.recorded.stage_end': 1,
  };

  const $limit = n;
  const queryJson = {
    aggregate: JSON.stringify([
      { $match },
      { $project },
      { $sort: { stage_number: -1 } },
      { $limit },
    ]),
  };

  let records;
  try {
    records = await jsonApi.getAppStorage(CORVA_PROVIDER, collection, assetId, queryJson);
  } catch (e) {
    records = [];
  }

  // Note: Collection was supposed to have one record per stage
  // But it was found to have more than one record for some assets.
  // Below logic removes such duplicates.
  let result = [];
  const duplicatesChecks = {};
  records.forEach(record => {
    const stageNumber = record.stage_number;
    if (!duplicatesChecks[stageNumber]) {
      result = concat(result, record);
    }
    duplicatesChecks[record.stage_number] = 1;
  });

  return result;
};

export const getLastNStagesForAssets = async (
  assetIds,
  sourceType = 'frac',
  n = 100,
  firstTimestamp = null,
  lastTimestamp = null,
  loadAllStages = false
) => {
  const apiCalls = assetIds.map(assetId =>
    fetchNStageTimeRecords(assetId, sourceType, n, firstTimestamp, lastTimestamp)
  );

  const stageTimeRecords = await Promise.all(apiCalls);
  const stagesCount = loadAllStages
    ? stageTimeRecords.reduce((sum, { length }) => sum + length, 0)
    : n;

  const sortKeyPath =
    sourceType === 'frac' ? ['data', 'stage_start'] : ['data', 'recorded', 'stage_start'];

  return slice(
    sortBy(concat(...stageTimeRecords), stageTimeRecord => -get(stageTimeRecord, sortKeyPath)),
    0,
    stagesCount
  ).map(stageTimeRecord => ({
    asset_id: stageTimeRecord.asset_id,
    stage_number: stageTimeRecord.stage_number,
  }));
};
