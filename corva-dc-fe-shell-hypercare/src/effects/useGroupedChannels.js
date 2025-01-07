import { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import { convertToValue } from '~/utils/dataUtils';

export function useGroupedChannels(channels) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!channels) return;

    let yAxes = {};
    let yAxisIndex = 0;

    channels.forEach((channel, idx) => {
      const minValue = channel.isAutoScale ? channel.traceMin : channel.minValue;
      const maxValue = channel.isAutoScale ? channel.traceMax : channel.maxValue;
      const srcMin = convertToValue(minValue, channel.unitType, null, channel.unit);
      const srcMax = convertToValue(maxValue, channel.unitType, null, channel.unit);
      const source = srcMax - srcMin;
      const condition = source / 5;
      let isUpdating = false;
      let axisIndex = yAxisIndex;

      Object.values(yAxes)
        .flat()
        .forEach(channelIndex => {
          const item = channels[channelIndex];
          const minValue = item.isAutoScale ? item.traceMin : item.minValue;
          const maxValue = item.isAutoScale ? item.traceMax : item.maxValue;
          const targetMin = convertToValue(minValue, item.unitType, null, item.unit);
          const targetMax = convertToValue(maxValue, item.unitType, null, item.unit);
          const target = targetMax - targetMin;
          if (
            item.unit === channel.unit &&
            item.sidePosition === channel.sidePosition &&
            channel.isAutoScale &&
            item.isAutoScale &&
            (!target ||
              (Math.abs(target - source) < condition && Math.abs(targetMax - srcMax) < condition))
          ) {
            isUpdating = true;
            axisIndex = Object.keys(yAxes).find(i => yAxes[i].includes(channelIndex));
          }
        });

      if (!isUpdating) {
        yAxes = {
          ...yAxes,
          [axisIndex]: [idx],
        };
        yAxisIndex += 1;
      } else {
        yAxes = {
          ...yAxes,
          [axisIndex]: yAxes[axisIndex].concat(idx),
        };
      }
    });

    const newChannels = channels.map((channel, idx) => {
      const yAxisIndex = Object.keys(yAxes).find(i => yAxes[i].includes(idx)) ?? 0;
      const yAxisGrouped = yAxes[yAxisIndex][0] === idx;

      return {
        ...channel,
        yAxisIndex: Number(yAxisIndex),
        yAxisGrouped,
      };
    });

    setData(sortBy(newChannels, 'yAxisIndex'));
  }, [channels]);

  return data;
}
