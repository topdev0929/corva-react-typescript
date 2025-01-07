import { useEffect, useMemo, useState } from 'react';
import { jsonApi } from '@corva/ui/clients';
import { METADATA } from '@/meta';
import { convertAbraItem } from '@/utils/conversionUtils';

const loadAbraData = async (abraWells, firstTimestamp, lastTimestamp = undefined) => {
  let data = [];
  try {
    let query = ``;
    if (firstTimestamp) {
      query = `{timestamp#gte#${firstTimestamp}}`;
    }
    if (lastTimestamp) {
      query = `${query}AND{timestamp#lte#${lastTimestamp}}`;
    }
    const records = await Promise.all(
      abraWells.map(({ assetId }) => {
        return jsonApi.getAppStorage(METADATA.provider, METADATA.collections.abra, assetId, {
          query,
          sort: '{timestamp: -1}',
          limit: 0,
        });
      })
    );
    data = abraWells.map((asset, index) => {
      return {
        ...asset,
        data: records[index].filter((_, index) => index % 10 === 0).map(convertAbraItem),
      };
    });
  } catch (e) {
    console.error(e);
  }

  return data;
};

const useLazyAbra = ({
  wells,
  channels,
  dataSetting,
  appDataSetting,
  abraStart,
  onAppSettingChange,
  offsetPressures,
  abraSubData,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [data, setData] = useState([]);

  const abraToLoad = useMemo(
    () => wells.filter(({ key }) => (dataSetting?.selectedOffsetPressure || []).includes(key)),
    [wells, dataSetting?.selectedOffsetPressure?.join()]
  );

  const selectedOffsetPressures = dataSetting.selectedOffsetPressure;
  const visibleOffsetPressures = appDataSetting.selectedOffsetPressure;
  const differs = selectedOffsetPressures.length === visibleOffsetPressures.length;

  useEffect(() => {
    const channelNames = Object.keys(channels) || [];
    if (
      isFinished ||
      !wells.length ||
      !channelNames.length ||
      selectedOffsetPressures.length === visibleOffsetPressures.length
    ) {
      return;
    }

    const newChannels = [...visibleOffsetPressures];
    let isAdded = false;
    channelNames.forEach(channel => {
      if (
        selectedOffsetPressures.includes(channel) &&
        !visibleOffsetPressures.includes(channel) &&
        offsetPressures.some(pressure => pressure.key === channel)
      ) {
        newChannels.push(channel);
        isAdded = true;
      }
    });
    if (isAdded) {
      const newDataSetting = {
        ...appDataSetting,
        selectedOffsetPressure: newChannels,
      };
      setIsFinished(true);
      onAppSettingChange('dataSetting', newDataSetting, false);
    }
  }, [channels, wells, differs, offsetPressures]);

  useEffect(() => {
    if (!abraStart) {
      return;
    }

    loadAbraData(abraToLoad, abraStart).then(data => {
      setData(data);
    });
  }, [abraStart, abraToLoad]);

  useEffect(() => {
    if (!abraSubData) return;

    setData(data =>
      data.map(abraType => {
        if (abraType.assetId !== abraSubData.assetId) {
          return abraType;
        }

        return {
          ...abraType,
          data: [abraSubData, ...abraType.data],
        };
      })
    );
  }, [abraSubData]);

  return data;
};

export default useLazyAbra;
