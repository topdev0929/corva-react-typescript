import { makeStyles } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { updateAxisStyles } from '../formations';

const useStyles = makeStyles({
  axisGrab: {
    cursor: 'grab',
  },
  axisCrosshair: {
    cursor: 'crosshair',
  },
});

export const useChartModifier = ({
  chart,
  chartOptions,
  isZoomEnabled,
  isMinHeightChart,
  handleChartSelection,
  onZoomChangeCallback,
  isAxesCoordinatesShown,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (isEmpty(chart)) {
      return;
    }

    const crosshairConfig = {
      zIndex: 1,
      color: '#ffffff',
      dashStyle: 'dash',
    };
    // eslint-disable-next-line no-param-reassign
    chart.plotBackground.element.style.cursor =
      isMinHeightChart || !isZoomEnabled ? 'grab' : 'crosshair';

    chart.series.forEach(seriesItem =>
      seriesItem.group.css({
        cursor: isMinHeightChart || !isZoomEnabled ? 'grab' : 'crosshair',
      })
    );

    chart.update({
      chart: {
        ...chartOptions,
        plotBackgroundColor: 'transparent',
        zoomType: isMinHeightChart || !isZoomEnabled ? 'none' : chartOptions.zoomType,
      },
      xAxis: {
        crosshair: isAxesCoordinatesShown ? crosshairConfig : null,
        className: isZoomEnabled ? classes.axisCrosshair : classes.axisGrab,
        events: {
          afterSetExtremes(e) {
            if (e.trigger === 'zoom' || e.trigger === 'navigator') {
              handleChartSelection();
            }
            if (chart.xAxis[0].userOptions.plotLines?.length) {
              updateAxisStyles({ chart });
            }
            onZoomChangeCallback(e);
          },
        },
      },
      yAxis: {
        crosshair: isAxesCoordinatesShown ? crosshairConfig : null,
        className: isZoomEnabled ? classes.axisCrosshair : classes.axisGrab,
        events: {
          afterSetExtremes(e) {
            if (e.trigger === 'zoom' || e.trigger === 'navigator') {
              handleChartSelection();
            }
            onZoomChangeCallback(e);
          },
        },
      },
      plotOptions: {
        series: {
          cursor: isMinHeightChart || !isZoomEnabled ? 'grab' : 'crosshair',
        },
      },
    });
  }, [isZoomEnabled, handleChartSelection, isAxesCoordinatesShown]);
};
