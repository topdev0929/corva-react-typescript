import mean from 'lodash/mean';

function getAverageValues(data) {
  const { xValues, yValues } = data.reduce(
    (accumulator, [xValue, yValue]) => ({
      xValues: accumulator.xValues.concat(xValue),
      yValues: accumulator.yValues.concat(yValue),
    }),
    {
      xValues: [],
      yValues: [],
    }
  );
  return [mean(xValues), mean(yValues)];
}

// NOTE: This function is created for smoothing echarts series,
// which have the following structure of data arg:
// [ [X,Y], [X1,Y1], ... [Xn,Yn] ]
export function smoothenSerie(data, step) {
  if (!data.length) return data;

  // NOTE: Get first x-axis value of the first point
  const [firstXValue] = data[0];

  const { normalizedData } = data.reduce(
    (accumulator, [xValue], index) => {
      const valueGap = xValue - accumulator.valueToCompare;

      if (valueGap < step) return accumulator;

      const averageValues = getAverageValues(data.slice(accumulator.valueToCompareIndex, index));
      return {
        normalizedData: accumulator.normalizedData.concat([averageValues]),
        valueToCompare: xValue,
        valueToCompareIndex: index,
      };
    },
    {
      normalizedData: [],
      valueToCompare: firstXValue,
      valueToCompareIndex: 0,
    }
  );

  return normalizedData;
}
