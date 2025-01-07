import { useEffect, useState } from 'react';

export const useChartTypeSwitch = ({ chart }) => {
  const initChartType = chart?.userOptions.chart.type;
  const [chartType, setChartType] = useState(null);

  const handleChartTypeChange = newChartType => {
    setChartType(newChartType);
    chart.update({
      chart: {
        type: newChartType,
      },
    });
  };

  useEffect(() => {
    if (!chartType) {
      setChartType(initChartType);
    }
  }, [initChartType]);

  return { chartType, handleChartTypeChange };
};
