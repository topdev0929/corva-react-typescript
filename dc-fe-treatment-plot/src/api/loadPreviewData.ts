import { groupBy } from 'lodash';
import { getAppStorage } from '@corva/ui/clients/jsonApi';

import { METADATA } from '../meta';
import { GroupedWitsData } from '@/types/Data';

const prepareResponseData = (response): GroupedWitsData[] => {
  return response.reduce((accumulator, responseItem) => {
    const groupedData = groupBy(responseItem, 'stage_number');
    const data = Object.entries(groupedData).map(([stageNumber, witsData]) => ({
      stageNumber: +stageNumber,
      assetId: witsData[0]?.asset_id,
      wits: witsData.map(witsItem => ({
        timestamp: witsItem.timestamp,
        ...witsItem.data.median,
      })),
    }));

    return accumulator.concat(data);
  }, []);
};

export const loadWitsData = async (assetIds: number[]): Promise<GroupedWitsData[]> => {
  const queryJson = {
    fields: ['timestamp', 'asset_id', 'stage_number', 'data.median.wellhead_pressure'].join(','),
    limit: 10000,
  };
  try {
    const apiCalls = assetIds.map(id =>
      getAppStorage(METADATA.provider, METADATA.collections.wits1m, id, queryJson)
    );

    const response = await Promise.all(apiCalls);

    return prepareResponseData(response);
  } catch (error) {
    console.error(error);
    return [];
  }
};
