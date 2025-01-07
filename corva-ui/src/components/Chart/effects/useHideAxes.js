import { useState } from 'react';

export const useHideAxes = ({ chart, onChartStylesChange }) => {
  const [isHiddenAxes, setIsHiddenAxes] = useState(false);

  const handleAxesHide = () => {
    setIsHiddenAxes(!isHiddenAxes);
    chart.update({
      xAxis: {
        title: {
          enabled: isHiddenAxes,
        },
        labels: {
          enabled: isHiddenAxes,
        },
      },
      yAxis: {
        title: {
          enabled: isHiddenAxes,
        },
        labels: {
          enabled: isHiddenAxes,
        },
      },
    });

    onChartStylesChange({ marginBottom: chart.marginBottom });
  };

  return { isHiddenAxes, handleAxesHide };
};
