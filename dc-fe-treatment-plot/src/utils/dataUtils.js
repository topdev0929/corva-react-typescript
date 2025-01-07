import moment from 'moment';
import {
  isEmpty,
  difference,
  concat,
  get,
  max,
  min,
  chunk,
  groupBy,
  first,
  uniqBy,
  uniq,
  head,
  last,
  keys,
} from 'lodash';
import { jsonApi } from '@corva/ui/clients';
import {
  getUniqueUnitsByType,
  showSuccessNotification,
  showErrorNotification,
} from '@corva/ui/utils';

import {
  STAGE_MODE_KEYS,
  SERIES_TYPES,
  OFFSET_PRESSURE_PREFIX,
  PREESURE_UNITS,
  FALLBACK_SERIES_COLOR,
  OFFSET_PRESSURE_COLORS,
  CUSTOM_SERIES_COLORS,
  CHEMICALS_LIST,
  TOTAL_LIQUID_FR_KEY,
  RUNNING_STATE,
  ABRA_PRESSURE_PREFIX,
} from '../constants';

import { METADATA } from '../meta';
import {
  resolveCurrentAssetByPadMode,
  getLastNStagesForAssets,
  fetchLastWit,
} from './completionUtils';
import { convertWitItem, convertPredictionItemBack } from '../utils/conversionUtils';
import { loadAssetWitsData } from '../utils/apiCalls';

const NOT_EXACT_CHANNELS = [
  'is_valid',
  'elapsed_time',
  'timestamp',
  'extra_clean_fluid',
  'total_chemical_rate_in',
  'inverse_hydrostatic_pressure',
];

export const isLight = hex => {
  if (!hex) {
    return false;
  }

  const color = +`0x${hex.slice(1).replace(hex.length < 5 && /./g, '$&$&')}`;
  const r = color >> 16;
  const g = (color >> 8) & 255;
  const b = color & 255;

  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp > 210;
};

export const getGoalKey = (key, type = 'color') => {
  return `${type}_goal_${key}`;
};

const WITS_DATA_INCREMENTS = {
  [METADATA.collections.wits]: 1,
  [METADATA.collections.wits10s]: 10,
  [METADATA.collections.wits1m]: 60,
};

const WITS_2_HOURS_BREAKPOINT = 7200;
const WITS_12_HOURS_BREAKPOINT = 43200;
const MAX_STAGES_PER_ASSET = 100;
const SYNTHETIC_ISIP_TIMESTAMP = 30;
const MAX_API_LIMIT = 10000;

export const isCustomTimeRangeSetting = assetDataSetting => {
  const { stageMode } = assetDataSetting;
  return stageMode === STAGE_MODE_KEYS.activeCustom;
};

export const isLastNActiveSetting = assetDataSetting =>
  assetDataSetting.stageMode === STAGE_MODE_KEYS.lastCustomTime;

export const isMultipleStages = assetDataSetting => {
  const { stageMode, manualStages } = assetDataSetting;
  return (
    stageMode === STAGE_MODE_KEYS.last5 ||
    stageMode === STAGE_MODE_KEYS.last10 ||
    stageMode === STAGE_MODE_KEYS.all ||
    (stageMode === STAGE_MODE_KEYS.manual && manualStages.length > 1)
  );
};

export const getFirstTimestampBySetting = (lastTimestamp, assetDataSetting) => {
  const { lastCustomTime } = assetDataSetting;
  const formatterValue = Number.isFinite(lastCustomTime)
    ? lastCustomTime
    : +lastCustomTime.replace(',', '.');

  return moment.unix(lastTimestamp).subtract(formatterValue, 'hours').unix();
};

const determineManualAssetsAndStages = (asset, manualStages) => {
  const stages = isEmpty(manualStages) ? [] : manualStages;

  const assetsToLoad = [
    {
      asset_id: asset.asset_id,
      stages,
      is_offset: false,
    },
  ];

  return {
    assetsToLoad,
    stagesCount: stages.length,
  };
};

const determineSubjectAssetsAndStages = async (
  assets,
  stagesCount,
  firstTimestamp = null,
  lastTimestamp = null,
  isAssetViewer
) => {
  const assetIds = assets.map(asset => asset.asset_id);
  const loadAllStages = stagesCount === STAGE_MODE_KEYS.all;

  const lastNResult = isAssetViewer
    ? []
    : await getLastNStagesForAssets(
        assetIds,
        'frac',
        loadAllStages ? MAX_STAGES_PER_ASSET : stagesCount,
        firstTimestamp,
        lastTimestamp,
        loadAllStages
      );

  const assetsToLoad = assetIds.reduce((result, assetId) => {
    const assetRecords = lastNResult.filter(record => record.asset_id === assetId);
    const stages = assetRecords.map(record => record.stage_number);

    return [
      ...result,
      {
        asset_id: assetId,
        stages,
        is_offset: false,
      },
    ];
  }, []);

  return {
    assetsToLoad,
    stagesCount: lastNResult.length,
  };
};

const determineOffsetAssetsAndStages = offsetAssets => {
  const offsetsWithStageData = offsetAssets.reduce(
    (result, offset) => {
      const offsetId = offset.selectedWellId;
      const offsetStages = offset.selectedStages.sort((i, j) => j - i);

      const updatedResult = {
        stagesCount: result.stagesCount + offsetStages.length,
        assetsToLoad: [
          {
            asset_id: Number(offsetId),
            stages: offsetStages,
            is_offset: true,
          },
          ...result.assetsToLoad,
        ],
      };

      return updatedResult;
    },
    {
      stagesCount: 0,
      assetsToLoad: [],
    }
  );

  return offsetsWithStageData;
};

const determineAssetsAndStages = ({
  activeAssetsResult,
  offsetAssetsResult,
  isAssetViewer = false,
  isLastNActive = false,
  timeSpan = 0,
}) => {
  const { stagesCount: activeStageCount, assetsToLoad: activeAssetsToLoad } = activeAssetsResult;

  const { stagesCount: offsetStagesCount, assetsToLoad: offsetAssetsToLoad } = offsetAssetsResult;

  const totalStagesCount = activeStageCount + offsetStagesCount;

  let assetsToLoad = offsetAssetsToLoad.reduce((result, offsetAsset) => {
    const existingAsset = result.find(item => item.asset_id === offsetAsset.asset_id);
    if (existingAsset) {
      const diffStages = difference(offsetAsset.stages, existingAsset.stages);
      return [
        ...result,
        {
          ...offsetAsset,
          stages: diffStages,
        },
      ];
    }

    return [...result, offsetAsset];
  }, activeAssetsToLoad);

  let witsCollectionKey = 'wits10s';
  if (isLastNActive) witsCollectionKey = 'wits';
  if (isAssetViewer || totalStagesCount > 1) witsCollectionKey = 'wits1m';
  if (activeStageCount > 1) witsCollectionKey = 'wits1m';
  if (timeSpan && timeSpan <= WITS_2_HOURS_BREAKPOINT) witsCollectionKey = 'wits';
  if (timeSpan && timeSpan <= WITS_12_HOURS_BREAKPOINT) witsCollectionKey = 'wits10s';

  return {
    assetsToLoad,
    witsCollectionKey,
  };
};

const getQuery = (stages, firstTimestamp = null, lastTimestamp = null, isDataStages = false) => {
  let query = stages.length ? `{${isDataStages ? 'data.' : ''}stage_number#in#[${stages}]}` : '';
  if (firstTimestamp) {
    query = query.length
      ? `${query}AND{timestamp#gte#${firstTimestamp}}`
      : `{timestamp#gte#${firstTimestamp}}`;
  }
  if (lastTimestamp) {
    query = `${query}AND{timestamp#lte#${lastTimestamp}}`;
  }
  return query;
};

const loadWitsByStages = async (
  provider,
  collection,
  assetId,
  stageNumbers,
  firstTimestamp = null,
  lastTimestamp = null
) => {
  let query = `{stage_number#in#[${stageNumbers}]}`;
  if (firstTimestamp) {
    query = `${query}AND{timestamp#gte#${firstTimestamp}}`;
  }
  if (lastTimestamp) {
    query = `${query}AND{timestamp#lte#${lastTimestamp}}`;
  }
  const isWitsCollection = collection === METADATA.collections.wits;
  const queryJson = {
    query,
    fields: [
      'timestamp',
      'asset_id',
      'stage_number',
      isWitsCollection ? 'data' : 'data.median',
    ].join(','),
    limit: 10000,
  };

  let result;
  try {
    result = await jsonApi.getAppStorage(provider, collection, assetId, queryJson);

    result = result.map(record => {
      return {
        ...record,
        data: isWitsCollection ? record.data : get(record, ['data', 'median']),
      };
    });
  } catch (e) {
    result = [];
  }

  return result;
};

const loadWitsByTimestamps = async (
  provider,
  collection,
  assetId,
  firstTimestamp,
  lastTimestamp
) => {
  let query = `{timestamp#gte#${firstTimestamp}}AND{timestamp#lte#${lastTimestamp}}`;

  const isWitsCollection = collection === METADATA.collections.wits;
  const queryJson = {
    query,
    fields: [
      'timestamp',
      'asset_id',
      'stage_number',
      isWitsCollection ? 'data' : 'data.median',
    ].join(','),
    limit: 10000,
  };

  let result;
  try {
    result = await jsonApi.getAppStorage(provider, collection, assetId, queryJson);

    result = result.map(record => {
      return {
        ...record,
        data: isWitsCollection ? record.data : get(record, ['data', 'median']),
      };
    });
  } catch (e) {
    result = [];
  }

  return result;
};

const getWitsTimestampBatches = (provider, collection, assetId, firstTimestamp, lastTimestamp) => {
  const collectionIncrement = WITS_DATA_INCREMENTS[collection];
  const totalIncrements = (lastTimestamp - firstTimestamp) / collectionIncrement;
  const totalBatches = Math.ceil(totalIncrements / MAX_API_LIMIT);
  const requests = [];
  let currentFirstTimestamp = firstTimestamp;

  for (let i = 0; i < totalBatches; i++) {
    const currentLastTimestamp = Math.min(
      currentFirstTimestamp + MAX_API_LIMIT * collectionIncrement - collectionIncrement,
      lastTimestamp
    );

    requests.push(
      loadWitsByTimestamps(
        provider,
        collection,
        assetId,
        currentFirstTimestamp,
        currentLastTimestamp
      )
    );

    currentFirstTimestamp = currentLastTimestamp + collectionIncrement;
  }

  return requests;
};

const loadWits = async (provider, collection, assetToLoad, firstTimestamp, lastTimestamp) => {
  if (!assetToLoad.stages.length) {
    if (!firstTimestamp && !lastTimestamp) {
      return [];
    } else {
      const result = await Promise.all(
        getWitsTimestampBatches(
          provider,
          collection,
          assetToLoad.asset_id,
          firstTimestamp,
          lastTimestamp
        )
      );
      return concat(...result);
    }
  }

  // Note: split the stage numbers into several chunks where each chunk is no more than 20 stages.
  // Goal is not to make the one request too big.
  const stageChunks = chunk(assetToLoad.stages, 20);

  const apiCalls = stageChunks.map(stageNumbers =>
    loadWitsByStages(
      provider,
      collection,
      assetToLoad.asset_id,
      stageNumbers,
      firstTimestamp,
      lastTimestamp
    )
  );

  const result = await Promise.all(apiCalls);

  return concat(...result);
};

const loadPrediction = async (provider, collection, assetToLoad, firstTimestamp, lastTimestamp) => {
  if (!assetToLoad.stages.length && !firstTimestamp && !lastTimestamp) {
    return [];
  }

  const queryJson = {
    asset_id: assetToLoad.asset_id,
    query: getQuery(assetToLoad.stages, firstTimestamp, lastTimestamp),
    limit: 1000,
  };

  try {
    const result = await jsonApi.getAppStorage(
      provider,
      collection,
      assetToLoad.asset_id,
      queryJson
    );

    return result;
  } catch (e) {
    return [];
  }
};

const loadStagesData = async (provider, collection, assetToLoad, firstTimestamp, lastTimestamp) => {
  let data = {};
  try {
    const records = await jsonApi.getAppStorage(provider, collection, assetToLoad.asset_id, {
      query: getQuery(assetToLoad.stages, firstTimestamp, lastTimestamp, true),
      sort: '{timestamp: -1}',
      limit: 0,
    });
    data = [...records];
  } catch (e) {
    console.error(e);
  }

  return data;
};

export const getAdjustedActivities = (activities, firstTimestamp) => {
  if (!firstTimestamp) return activities;
  const adjustedActivities = activities
    .filter(item => item.end > firstTimestamp)
    .map(item => {
      return {
        activity: item.activity,
        start: max([item.start, firstTimestamp]),
        end: item.end,
        duration: item.end - max([item.start, firstTimestamp]),
      };
    });
  return adjustedActivities;
};

const loadActivities = async (
  provider,
  collection,
  assetToLoad,
  firstTimestamp = null,
  lastTimestamp = null
) => {
  if (!assetToLoad.stages.length) {
    return [];
  }
  const { asset_id } = assetToLoad;

  const $match = {
    asset_id,
    stage_number: { $in: assetToLoad.stages },
  };
  if (firstTimestamp) {
    $match.timestamp = { $gte: firstTimestamp };
  }
  if (lastTimestamp) {
    $match.timestamp = { ...($match.timestamp || {}), $lte: lastTimestamp };
  }

  const $sort = {
    timestamp: -1,
  };
  const $group = {
    _id: '$stage_number',
    data: { $first: '$data' },
  };

  const queryJson = {
    aggregate: JSON.stringify([{ $match }, { $sort }, { $group }]),
  };

  try {
    const result = await jsonApi.getAppStorage(provider, collection, asset_id, queryJson);

    return assetToLoad.stages.map(stage_number => {
      const stageActivities = result.find(
        ({ _id: currentStage }) => stage_number === +currentStage
      );
      return {
        asset_id,
        stage_number,
        activities: getAdjustedActivities(stageActivities?.data?.activities, firstTimestamp),
      };
    });
  } catch (e) {
    return [];
  }
};

export const getAdjustedPredictionRecord = (record, firstTimestamp, lastTimestamp) => {
  return {
    ...record,
    data: {
      ...get(record, 'data'),
      breakdown: get(record, ['data', 'breakdown'], []).filter(item => {
        return (
          (!firstTimestamp || item.timestamp >= firstTimestamp) &&
          (!lastTimestamp || item.timestamp <= lastTimestamp)
        );
      }),
      isip: get(record, ['data', 'isip'], []).filter(item => {
        return (
          (!firstTimestamp || item.timestamp >= firstTimestamp) &&
          (!lastTimestamp || item.timestamp <= lastTimestamp)
        );
      }),
      target_ramp_rate: get(record, ['data', 'target_ramp_rate'], []).filter(item => {
        return (
          (!firstTimestamp || item.timestamp >= firstTimestamp) &&
          (!lastTimestamp || item.timestamp <= lastTimestamp)
        );
      }),
      opening_wellhead_pressure: get(record, ['data', 'opening_wellhead_pressure'], []).filter(
        item => {
          return (
            (!firstTimestamp || item.timestamp >= firstTimestamp) &&
            (!lastTimestamp || item.timestamp <= lastTimestamp)
          );
        }
      ),
      main_pumping_start_timestamp:
        (!firstTimestamp ||
          get(record, ['data', 'main_pumping_start_timestamp']) >= firstTimestamp) &&
        (!lastTimestamp || get(record, ['data', 'main_pumping_start_timestamp']) <= lastTimestamp)
          ? get(record, ['data', 'main_pumping_start_timestamp'])
          : null,
      proppant_injection_start_timestamp:
        (!firstTimestamp ||
          get(record, ['data', 'proppant_injection_start_timestamp']) >= firstTimestamp) &&
        (!lastTimestamp ||
          get(record, ['data', 'proppant_injection_start_timestamp']) <= lastTimestamp)
          ? get(record, ['data', 'proppant_injection_start_timestamp'])
          : null,
    },
  };
};

const getUnitType = (key, channelUnitType, unit) => {
  if (key.includes(OFFSET_PRESSURE_PREFIX)) return 'pressure';
  const unitType = getUniqueUnitsByType(channelUnitType)
    .map(item => item.abbr)
    .includes(unit)
    ? channelUnitType
    : null;

  return unitType;
};

const loadMappedChannelsV2 = async assetId => {
  const response = await jsonApi.getStreams({ assetId, segment: 'completion' });
  const timeStream = response.find(stream => stream.source_type === 'frac') || {};
  const mappingAppConnections =
    (timeStream.app_connections || []).find(appConnection =>
      get(appConnection, ['settings', 'mappings'])
    ) || {};

  const channels = get(mappingAppConnections, ['settings', 'mappings']);
  if (isEmpty(channels)) return [];

  const adjustedChannels = Object.entries(channels)
    .map(([key, value]) => {
      return {
        key: key.toLowerCase(),
        ...value,
      };
    })
    .filter(channel => !!channel.column);

  return adjustedChannels;
};

const getAllMappedChannels = rawData => {
  const allWitsKeys = rawData.reduce((result, assetRawData) => {
    const groupData = groupBy(assetRawData[0], 'stage_number');
    const recordsByStage = Object.values(groupData).map(records =>
      Object.keys(get(records, [0, 'data']) || {})
    );
    const concatedKeys = concat(...recordsByStage);
    return [...result, ...concatedKeys];
  }, []);
  const uniqKeys = uniq(allWitsKeys);
  const filterKeys = uniqKeys.filter(key => {
    return !SERIES_TYPES.find(series => series.key === key) && !NOT_EXACT_CHANNELS.includes(key);
  });
  return filterKeys;
};

export const getAbraKeyForAssetName = (assetName = '') => {
  const name = ('abra_' + assetName).replace(/ /gi, '_');

  return name;
};

const getCustomChannelsV2 = async (assetsToLoad, rawData, abraWells) => {
  const assetIds = assetsToLoad.map(item => item.asset_id);
  const allChannels = await Promise.all(assetIds.map(assetId => loadMappedChannelsV2(assetId)));

  const abraChannels = abraWells.map(abraType => {
    return {
      ...abraType,
      type: 'pressure',
      source_unit: 'psi',
    };
  });

  const concatedChannels = concat(...allChannels, ...abraChannels);
  const uniqChannels = uniqBy(concatedChannels, 'key');

  const witsCustomKeys = getAllMappedChannels(rawData);
  const preMappedChannels = witsCustomKeys
    .map(key => {
      return {
        key,
        type: key.includes(OFFSET_PRESSURE_PREFIX) ? 'pressure' : null,
        source_unit: null,
      };
    })
    .filter(channel => !uniqChannels.find(mappedChannel => mappedChannel.key === channel.key));
  const combinedChannels = concat(uniqChannels, preMappedChannels);
  const combinedChannelsKeys = combinedChannels
    .map(channel => channel.key)
    .concat(TOTAL_LIQUID_FR_KEY);

  const mappedChemicalChannels = CHEMICALS_LIST.filter(series =>
    combinedChannelsKeys.includes(series.key)
  );

  const offsetPressures = combinedChannels
    .filter(
      channel =>
        channel.key.includes(OFFSET_PRESSURE_PREFIX) || channel.key.startsWith(ABRA_PRESSURE_PREFIX)
    )
    .map((channel, idx) => {
      const label = channel.key
        .replace(OFFSET_PRESSURE_PREFIX, '')
        .replace(ABRA_PRESSURE_PREFIX, 'Abra ')
        .replace(/_/gi, ' ')
        .toUpperCase();

      let unit = 'psi';
      if (channel.source_unit && PREESURE_UNITS.includes(channel.source_unit)) {
        unit = channel.source_unit;
      }
      if (channel.target_unit && PREESURE_UNITS.includes(channel.target_unit)) {
        unit = channel.target_unit;
      }

      return {
        key: channel.key,
        name: label,
        unitType: 'pressure',
        unit,
        color: OFFSET_PRESSURE_COLORS[idx] || FALLBACK_SERIES_COLOR,
        axisId: 'offsetPressure',
        category: 'offsetPressure',
        collection: channel.key.startsWith(ABRA_PRESSURE_PREFIX) ? 'abra' : 'wits',
        precision: 0,
      };
    });

  const customChannels = combinedChannels
    .filter(
      channel =>
        !channel.key.includes(OFFSET_PRESSURE_PREFIX) &&
        !channel.key.startsWith(ABRA_PRESSURE_PREFIX) &&
        !SERIES_TYPES.find(series => series.key === channel.key) &&
        uniqChannels.map(uniqChannel => uniqChannel.key).includes(channel.key)
    )
    .map((channel, idx) => {
      const label = channel.key.replace(/_/gi, ' ').toUpperCase();
      let unit;
      if (channel.source_unit) {
        unit = channel.source_unit;
      }
      if (channel.target_unit) {
        unit = channel.target_unit;
      }
      const unitType = getUnitType(channel.key, channel.type, unit) || null;

      return {
        key: channel.key,
        name: label,
        unitType: unitType,
        unit,
        color: CUSTOM_SERIES_COLORS[idx] || FALLBACK_SERIES_COLOR,
        axisId: 'customChannels',
        category: 'customChannels',
        collection: 'wits',
        precision: 2,
      };
    });
  return [offsetPressures, customChannels, mappedChemicalChannels];
};

const fetchPadFirstTimestamp = async assets => {
  const firstWitsItems = await Promise.all(
    assets.map(asset => loadAssetWitsData(asset.asset_id, 1, false))
  );
  const firstTimestamps = firstWitsItems.map(
    ([data]) => data?.timestamp || Number.MAX_SAFE_INTEGER
  );

  if (firstTimestamps.length === 0) {
    return 0;
  }

  return Math.min(...firstTimestamps);
};

export const fetchData = async (
  assets,
  appOffsetSetting,
  appFilterSetting,
  appPadModeSetting,
  isAssetViewer,
  queryLastTimestamp,
  customTimeSetting,
  isStageDataLoad,
  abraWells
) => {
  const { stageMode, manualStages } = appFilterSetting;

  const currentAsset = resolveCurrentAssetByPadMode(assets, appPadModeSetting);

  let mainData = [];
  let mappedChemicals = [];
  let offsetPressures = [];
  let customChannels = [];
  let dataRange = [null, null];
  if (!currentAsset) {
    return {
      mainData,
      mappedChemicals,
      offsetPressures,
      customChannels,
      dataRange,
    };
  }

  const assetLastWit = await fetchLastWit(currentAsset.asset_id);
  const witsLastTimestamp = assetLastWit?.timestamp || null;
  let lastTimestamp = queryLastTimestamp || null;
  let firstTimestamp = null;

  const isCustomActive =
    isCustomTimeRangeSetting(appFilterSetting) && customTimeSetting.start && customTimeSetting.end;

  const isLastNActive = isLastNActiveSetting(appFilterSetting);
  if (isLastNActive) {
    lastTimestamp = queryLastTimestamp || witsLastTimestamp;
    firstTimestamp = getFirstTimestampBySetting(lastTimestamp, appFilterSetting);
  }

  if (isCustomActive) {
    firstTimestamp = customTimeSetting.start;
    lastTimestamp = customTimeSetting.end;
  }

  let stagesCount = 1; // NOTE: It should be 1 in custom active modes
  if (stageMode === STAGE_MODE_KEYS.active) {
    stagesCount = 1;
  } else if (stageMode === STAGE_MODE_KEYS.last5) {
    stagesCount = 5;
  } else if (stageMode === STAGE_MODE_KEYS.last10) {
    stagesCount = 10;
  } else if (stageMode === STAGE_MODE_KEYS.all) {
    stagesCount = STAGE_MODE_KEYS.all;
  } else if (
    stageMode === STAGE_MODE_KEYS.activeCustom ||
    stageMode === STAGE_MODE_KEYS.lastCustomTime
  ) {
    stagesCount = MAX_STAGES_PER_ASSET;
  }

  let subjectAssetsResult;
  if (appPadModeSetting.mode !== 'pad') {
    if (stageMode === STAGE_MODE_KEYS.manual) {
      subjectAssetsResult = determineManualAssetsAndStages(currentAsset, manualStages);
    } else {
      subjectAssetsResult = await determineSubjectAssetsAndStages(
        [currentAsset],
        stagesCount,
        firstTimestamp,
        lastTimestamp,
        isAssetViewer
      );
    }
  } else {
    subjectAssetsResult = await determineSubjectAssetsAndStages(
      isAssetViewer ? [currentAsset] : assets,
      stagesCount,
      firstTimestamp,
      lastTimestamp,
      isAssetViewer
    );
  }

  const offsetAssetsResult = determineOffsetAssetsAndStages(appOffsetSetting);

  const { witsCollectionKey, assetsToLoad } = determineAssetsAndStages({
    activeAssetsResult: subjectAssetsResult,
    offsetAssetsResult,
    isAssetViewer,
    isLastNActive,
    timeSpan: isCustomActive || isLastNActive ? lastTimestamp - firstTimestamp : 0,
  });

  const { provider, collections } = METADATA;

  const witsCollection = collections[witsCollectionKey];
  const predictionCollection = collections.predictions;
  const activitiesCollection = collections.activities;
  const stagesDataCollection = collections.stagesData;
  const dataApiCalls = Promise.all(
    assetsToLoad.map(assetToLoad => {
      const requestsList = [
        loadWits(provider, witsCollection, assetToLoad, firstTimestamp, lastTimestamp),
        isAssetViewer
          ? null
          : loadPrediction(
              provider,
              predictionCollection,
              assetToLoad,
              firstTimestamp,
              lastTimestamp
            ),

        isCustomActive || isLastNActive || isAssetViewer
          ? null
          : loadActivities(
              provider,
              activitiesCollection,
              assetToLoad,
              firstTimestamp,
              lastTimestamp
            ),
      ];
      if (isStageDataLoad && !isAssetViewer) {
        requestsList.push(
          loadStagesData(provider, stagesDataCollection, assetToLoad, firstTimestamp, lastTimestamp)
        );
      }
      return Promise.all(requestsList);
    })
  );

  const firstTimestampApiCall = fetchPadFirstTimestamp(subjectAssetsResult.assetsToLoad);

  const [rawData, requestedFirstTimestamp] = await Promise.all([
    dataApiCalls,
    firstTimestampApiCall,
  ]);
  const stagesData = isStageDataLoad && rawData?.[0] && last(rawData[0]);

  const abraStart =
    Math.min(...rawData.map(assetData => assetData?.[0]?.at(-1)?.timestamp || +new Date())) * 1000;

  [offsetPressures, customChannels, mappedChemicals] = await getCustomChannelsV2(
    assetsToLoad,
    rawData,
    abraWells
  );

  dataRange = rawData.reduce(
    (result, rawAssetData) => {
      const witsData = first(rawAssetData);
      const assetStartTimestamp = min(witsData.map(record => record.timestamp));
      const assetEndTimestamp = max(witsData.map(record => record.timestamp));
      return [min([result[0], assetStartTimestamp]), max([result[1], assetEndTimestamp])];
    },
    [null, null]
  );

  for (let index = 0; index < rawData.length; index++) {
    const rawAssetData = rawData[index];
    const assetToLoad = assetsToLoad[index];
    const [wits, predictions, activities] = rawAssetData;

    const witsGrouped = isAssetViewer ? { 0: wits } : groupBy(wits, 'stage_number');
    const predictionsGrouped = groupBy(predictions, 'stage_number');
    let activitiesGrouped = groupBy(activities, 'stage_number');

    if (isAssetViewer) {
      assetToLoad.stages = keys(witsGrouped).map(stage => +stage);
    } else if ((isCustomActive || isLastNActive) && !activities) {
      assetToLoad.stages = keys(witsGrouped).map(stage => +stage);
      const response = await loadActivities(
        provider,
        activitiesCollection,
        assetToLoad,
        firstTimestamp,
        lastTimestamp
      );
      activitiesGrouped = groupBy(response, 'stage_number');
    }

    const offsetAsset = assetToLoad.is_offset
      ? appOffsetSetting.find(item => item.selectedWellId === assetToLoad.asset_id)
      : null;

    const activeAsset = !assetToLoad.is_offset
      ? assets.find(item => item.asset_id === assetToLoad.asset_id)
      : null;

    const assetData = assetToLoad.stages.reduce((assetResult, stageNumber, stageIndex) => {
      const witsByStage = witsGrouped[stageNumber];
      const predictionsByStage = predictionsGrouped[stageNumber];
      const activitiesByStage = activitiesGrouped[stageNumber];

      if (!witsByStage) {
        return assetResult;
      }

      // NOTE: remove events from prediction record
      const predictionRecord = predictionsByStage
        ? getAdjustedPredictionRecord(
            predictionsByStage[predictionsByStage.length - 1],
            firstTimestamp,
            lastTimestamp
          )
        : null;

      const stageConfig = { lineStyle: 'solid', lineWidth: 2, alpha: 1 };
      if (assetToLoad.is_offset) {
        const lineStyle = get(offsetAsset, ['stages', String(stageNumber), 'lineStyle'], 'dotted');
        const lineWidth = get(offsetAsset, ['stages', String(stageNumber), 'lineWidth'], 2);
        stageConfig.lineStyle = lineStyle;
        stageConfig.lineWidth = lineWidth;
      } else {
        stageConfig.alpha = 1 - stageIndex / assetToLoad.stages.length;
      }

      const assetName = assetToLoad.is_offset
        ? get(offsetAsset, 'selectedWellName')
        : get(activeAsset, 'name');

      return [
        ...assetResult,
        {
          asset_id: assetToLoad.asset_id,
          asset_name: assetName,
          stage_number: stageNumber,
          wits: witsByStage.sort((a, b) => a.timestamp - b.timestamp),
          predictions: predictionRecord,
          activities: activitiesByStage,
          is_offset: assetToLoad.is_offset,
          misc: stageConfig,
        },
      ];
    }, []);
    mainData = [...mainData, ...assetData];
  }

  return {
    mainData,
    dataRange,
    mappedChemicals,
    abraStart,
    offsetPressures,
    customChannels,
    firstTimestamp: requestedFirstTimestamp,
    witsCollection,
    stagesData,
  };
};

export const isRecordInStage = (stageData, record, isAssetViewer = false) => {
  if (isAssetViewer) return true;
  return stageData.asset_id === record.asset_id && stageData.stage_number === record.stage_number;
};

export const handleFetchTask = async prevTaskResult => {
  const taskId = prevTaskResult.id;
  if (!taskId) return null;

  if (prevTaskResult.state !== RUNNING_STATE) {
    return prevTaskResult.state;
  }

  let taskResult;
  try {
    taskResult = await jsonApi.getTask(taskId);
  } catch (e) {
    console.error(e);
    taskResult = {};
  }

  return setTimeout(() => handleFetchTask(taskResult), 1000);
};

const getPredictionTimestamps = predictionRecord => {
  const breakdownTimestamp = get(head(get(predictionRecord, ['data', 'breakdown'])), ['timestamp']);
  const rampTimestamp = get(head(get(predictionRecord, ['data', 'target_ramp_rate'])), [
    'timestamp',
  ]);
  const isipTimestamp = get(last(get(predictionRecord, ['data', 'isip'])), ['timestamp']);
  const openWellheadPressureTimestamp = get(
    last(get(predictionRecord, ['data', 'opening_wellhead_pressure'])),
    ['timestamp']
  );
  const rateStartTimestamp = get(predictionRecord, ['data', 'main_pumping_start_timestamp']);
  const proppantInjectionTimestamp = get(predictionRecord, [
    'data',
    'proppant_injection_start_timestamp',
  ]);

  return {
    breakdownTimestamp,
    rampTimestamp,
    isipTimestamp,
    openWellheadPressureTimestamp,
    rateStartTimestamp,
    proppantInjectionTimestamp,
  };
};

export const getValidation = predictionRecord => {
  const {
    breakdownTimestamp,
    isipTimestamp,
    rampTimestamp,
    openWellheadPressureTimestamp,
    rateStartTimestamp,
    proppantInjectionTimestamp,
  } = getPredictionTimestamps(predictionRecord);

  let invalidMSG;
  if (
    min([
      rateStartTimestamp,
      isipTimestamp,
      breakdownTimestamp,
      proppantInjectionTimestamp,
      rampTimestamp,
    ]) !== rateStartTimestamp
  ) {
    invalidMSG =
      'Rate Start timestamp MUST be before Breakdown, Proppant Start, and ISIP timestamps';
  }

  if (openWellheadPressureTimestamp >= rateStartTimestamp) {
    invalidMSG = 'Opening Wellhead Pressure MUST be before Rate Start timestamp';
  }

  if (breakdownTimestamp <= rateStartTimestamp || breakdownTimestamp >= isipTimestamp) {
    invalidMSG = 'Breakdown MUST be after Rate Start and Before ISIP';
  }

  if (
    proppantInjectionTimestamp <= rateStartTimestamp ||
    proppantInjectionTimestamp >= isipTimestamp
  ) {
    invalidMSG = 'Proppant Start timestamp MUST be after Rate Start and Before ISIP';
  }

  if (rampTimestamp <= rateStartTimestamp || rampTimestamp >= breakdownTimestamp) {
    invalidMSG = 'Target Ramp Rate timestamp MUST be after Rate Start and before Breakdown';
  }

  if (
    max([rateStartTimestamp, isipTimestamp, breakdownTimestamp, proppantInjectionTimestamp]) !==
    isipTimestamp
  ) {
    invalidMSG = 'ISIP timestamp MUST be the last event';
  }

  return invalidMSG;
};

const getISIPWitsRecord = async (assetId, wits) => {
  const targetTimestamp = wits.at(-1).timestamp - SYNTHETIC_ISIP_TIMESTAMP;
  const queryJson = {
    aggregate: JSON.stringify([
      {
        $match: {
          asset_id: assetId,
          timestamp: { $gte: targetTimestamp },
        },
      },
      { $sort: { timestamp: 1 } },
      { $limit: 1 },
    ]),
  };

  const [record] = await jsonApi.getAppStorage(
    METADATA.provider,
    METADATA.collections.wits,
    assetId,
    queryJson
  );

  return { timestamp: record.data.timestamp, wellhead_pressure: record.data.wellhead_pressure };
};

const getFormattedRecord = async (predictionRecord, wits, assetId) => {
  // add ISIP event if it doesn't exist for 30seconds before stage ends
  const isip = predictionRecord.data.isip.length
    ? predictionRecord.data.isip
    : [await getISIPWitsRecord(assetId, wits)];

  return {
    ...predictionRecord,
    data: {
      ...predictionRecord.data,
      isip: [...isip],
    },
  };
};

export const updatePredictionsCollection = async (predictionRecord, assetId, stageNumber, wits) => {
  const formattedRecord = await getFormattedRecord(predictionRecord, wits, assetId);
  const invalidMSG = getValidation(formattedRecord);

  if (invalidMSG) {
    // eslint-disable-next-line no-console
    console.log(`Event validation result: ${invalidMSG}`);
    return null;
  }
  const {
    breakdownTimestamp,
    isipTimestamp,
    rateStartTimestamp,
    proppantInjectionTimestamp,
    openWellheadPressureTimestamp,
    rampTimestamp,
  } = getPredictionTimestamps(formattedRecord);

  try {
    await jsonApi.putAppStorage(
      METADATA.provider,
      METADATA.collections.predictions,
      formattedRecord._id,
      formattedRecord
    );
  } catch (e) {
    console.error(e);
  }
  const task = {
    provider: 'corva',
    app_key: 'corva.event_editor',
    asset_id: assetId,
    properties: {
      asset_id: assetId,
      stage_number: stageNumber,
      breakdown_timestamp: breakdownTimestamp,
      isip_timestamp: isipTimestamp,
      proppant_injection_start_timestamp: proppantInjectionTimestamp,
      rate_start_timestamp: rateStartTimestamp,
      opening_wellhead_pressure_timestamp: openWellheadPressureTimestamp,
      target_ramp_rate_timestamp: rampTimestamp,
    },
  };

  let result;
  try {
    result = await jsonApi.postTask({ task });
  } catch (e) {
    console.error(e);
    return null;
  }

  return handleFetchTask(result);
};

export const saveEvents = async mainData => {
  const apiCalls = mainData.map(stageData => {
    const { predictions, asset_id, stage_number, wits } = stageData;

    return updatePredictionsCollection(
      convertPredictionItemBack(predictions),
      asset_id,
      stage_number,
      wits
    );
  });
  const result = await Promise.all(apiCalls);

  const validStages = mainData
    .map(stageData => stageData.stage_number)
    .filter((_stageNumber, index) => result[index]);
  const inValidStages = mainData
    .map(stageData => stageData.stage_number)
    .filter((_stageNumber, index) => !result[index]);

  if (validStages.length) {
    showSuccessNotification(
      `Stages #${validStages.join(', ')} Events and activities successfully edited.`
    );
  }
  if (inValidStages.length) {
    showErrorNotification(
      `Stages #${inValidStages.join(', ')} Events and activities editing unsuccessful.`
    );
  }

  return !inValidStages.length;
};

// This function loads the wits(1sec) in a given time range
// BY Comparing time range with start and end timestamp from rough data,
// It skips the loading if the time range is out of stage time range.
const loadWitsInTimeRange = async (
  provider,
  collection,
  stageData,
  previousStageData,
  nextStageData,
  timeRange
) => {
  const {
    wits: currentWits,
    asset_id: assetId,
    stage_number: stageNumber,
    requestHistory,
  } = stageData;

  const previousStageDataEndTimestamp = previousStageData?.wits?.at(-1)?.timestamp || Infinity;
  const nextStageDataStartTimestamp = nextStageData?.wits?.at(0)?.timestamp || 0;
  const stageDataStartTimestamp = currentWits.at(0).timestamp;
  const stageDataEndTimestamp = currentWits.at(-1).timestamp;
  const formattedStageDataEndTimestamp = Math.max(
    stageDataEndTimestamp,
    nextStageDataStartTimestamp
  );
  const formattedStageDataStartTimestamp = Math.min(
    stageDataStartTimestamp,
    previousStageDataEndTimestamp
  );

  if (stageDataStartTimestamp > timeRange[1] || stageDataEndTimestamp < timeRange[0]) {
    return {
      requestedTimeRange: null,
      msg: 'out of range',
      fineWits: [],
    };
  }

  const requestStartTimestamp = Math.max(formattedStageDataStartTimestamp, timeRange[0]);
  const requestEndTimestamp = Math.min(formattedStageDataEndTimestamp, timeRange[1]);

  const foundRequestedTimeRange = (requestHistory || []).find(prevRequestedTimeRange => {
    return (
      requestStartTimestamp >= prevRequestedTimeRange[0] &&
      requestStartTimestamp <= prevRequestedTimeRange[1] &&
      requestEndTimestamp >= prevRequestedTimeRange[0] &&
      requestEndTimestamp <= prevRequestedTimeRange[1] &&
      collection === prevRequestedTimeRange[2]
    );
  });

  if (foundRequestedTimeRange) {
    return {
      requestedTimeRange: null,
      msg: 'already requested',
      fineWits: [],
    };
  }

  const requestedTimeRange = [requestStartTimestamp, requestEndTimestamp];

  const isWitsCollection = collection === METADATA.collections.wits;

  const queryJson = {
    asset_id: assetId,
    query: `{timestamp#gte#${requestStartTimestamp}}AND{timestamp#lte#${requestEndTimestamp}}`,
    sort: '{timestamp: 1}',
    fields: [
      'timestamp',
      'asset_id',
      'stage_number',
      isWitsCollection ? 'data' : 'data.median',
    ].join(','),
    limit: 10000,
  };

  try {
    const result = await jsonApi.getAppStorage(provider, collection, assetId, queryJson);
    const resultFormatted = isWitsCollection
      ? result
      : result.map(item => ({ ...item, data: item.data.median }));

    return {
      msg: 'ok',
      requestedTimeRange,
      fineWits: resultFormatted.filter(item => item.stage_number === stageNumber),
    };
  } catch (e) {
    return {
      requestedTimeRange,
      msg: 'network error',
      fineWits: [],
    };
  }
};

// This function loads the 1 sec wits for all stages for a given time range
// It effectively merges 1 sec wits to rough wits we already loaded.
// It also updates zoom history(fine loading history)
// So that it later zoom request doesn't need to load the same group of wits again.
export const loadDataInTimeRange = async (timeRanges, mainData, allSeriesTypes, collection) => {
  const { provider } = METADATA;
  const apiCalls = mainData.reduce((apiCallsResult, stageData, index) => {
    const timeRange = timeRanges[index];
    const previousStageData = mainData[index + 1] || null;
    const nextStageData = mainData[index - 1] || null;

    return apiCallsResult.concat(
      loadWitsInTimeRange(
        provider,
        collection,
        stageData,
        previousStageData,
        nextStageData,
        timeRange
      )
    );
  }, []);

  const results = await Promise.all(apiCalls);

  const stageIndices = [];
  const newData = results.map((result, stageIndex) => {
    const stageData = mainData[stageIndex];

    // Error came up when loading 1sec wits for the stage
    if (!results.msg === 'ok' || !result.fineWits.length) {
      return stageData;
    }

    stageIndices.push(stageIndex);

    const { fineWits, requestedTimeRange } = result;
    const { requestHistory, wits } = stageData;

    let newRequestHistory = [];
    if (requestHistory) {
      let intersected = false;
      requestHistory.forEach(prevRequestedTimeRange => {
        let modifiedRequestedTimeRange;
        if (
          requestedTimeRange[0] >= prevRequestedTimeRange[0] &&
          requestedTimeRange[0] <= prevRequestedTimeRange[1] &&
          requestedTimeRange[1] >= prevRequestedTimeRange[0] &&
          requestedTimeRange[1] <= prevRequestedTimeRange[1]
        ) {
          intersected = true;
          modifiedRequestedTimeRange = prevRequestedTimeRange;
        } else if (
          requestedTimeRange[0] >= prevRequestedTimeRange[0] &&
          requestedTimeRange[0] <= prevRequestedTimeRange[1]
        ) {
          modifiedRequestedTimeRange = [prevRequestedTimeRange[0], requestedTimeRange[1]];
          intersected = true;
        } else if (
          requestedTimeRange[1] >= prevRequestedTimeRange[0] &&
          requestedTimeRange[1] <= prevRequestedTimeRange[1]
        ) {
          modifiedRequestedTimeRange = [requestedTimeRange[0], prevRequestedTimeRange[1]];
          intersected = true;
        } else {
          modifiedRequestedTimeRange = prevRequestedTimeRange;
        }
        modifiedRequestedTimeRange[2] = collection;
        newRequestHistory.push(modifiedRequestedTimeRange);
      });

      if (!intersected) {
        newRequestHistory.push([...requestedTimeRange, collection]);
      }
    } else {
      newRequestHistory = [[...requestedTimeRange, collection]];
    }

    const witsBeforeRequestedTimeRange = wits.filter(
      witItem => witItem.timestamp < requestedTimeRange[0]
    );
    const witsAfterRequestedTimeRange = wits.filter(
      witItem => witItem.timestamp > requestedTimeRange[1]
    );
    const convertedFineWits = fineWits.map(witItem => convertWitItem(witItem, allSeriesTypes));

    const newWits = witsBeforeRequestedTimeRange
      .concat(convertedFineWits)
      .concat(witsAfterRequestedTimeRange);

    return {
      ...stageData,
      requestHistory: newRequestHistory,
      wits: newWits,
    };
  });

  return newData;
};
