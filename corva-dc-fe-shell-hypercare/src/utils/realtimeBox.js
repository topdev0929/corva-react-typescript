import { sumBy, findLast } from 'lodash';

export const getAverages = (datas, channels) => {
  const traceKeys = channels.map(channel => channel.traceName);
  const allAggregation = traceKeys.reduce((res, key) => ({ ...res, [key]: 0 }), {});
  let recordCount = 0;

  if (!datas) {
    return allAggregation;
  }

  datas.forEach(data => {
    const { wits } = data;

    const totalValues = traceKeys.reduce((acc, key) => {
      const sum = sumBy(wits, item => item.data[key]);
      return { ...acc, [key]: sum };
    }, {});

    traceKeys.forEach(key => {
      allAggregation[key] += totalValues[key];
    });

    recordCount += wits.length || 0;
  });

  const result = traceKeys.reduce(
    (acc, key) => ({ ...acc, [key]: allAggregation[key] / recordCount }),
    {}
  );

  return result;
};

export function updateRealtimeValue(channel, data) {
  if (!data) {
    return channel;
  }

  let value;
  value = findLast(
    data,
    item =>
      item.data[channel.traceName] && (!channel.sensorId || item.data.sensorId === channel.sensorId)
  )?.data?.[channel.traceName];
  value = Number.isFinite(value)
    ? value.toFixed(Number.isFinite(channel.precision) ? channel.precision : 2)
    : '0.00';

  return {
    ...channel,
    value,
  };
}
