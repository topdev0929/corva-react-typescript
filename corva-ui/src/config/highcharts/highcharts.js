/* eslint-disable */
// TODO: all the plugins should be checked, legacy code
/**
 * NOTE: Highchart has a bug for pie chart in v8.1.2
 *       issue link:  https://github.com/highcharts/highcharts/issues/13710
 *       workaround:
 *          import Highcharts from 'highcharts';
 *          window.Highcharts = Highcharts;
 */

import Highcharts from 'highcharts';

import highchartsMore from 'highcharts/highcharts-more';

import HighchartsMulticolorSeries from 'highcharts-multicolor-series';
import addSolidGauge from 'highcharts/modules/solid-gauge';
import addHeatmap from 'highcharts/modules/heatmap';
import addBoost from 'highcharts/modules/boost';
import addExporting from 'highcharts/modules/exporting';
import addXrange from 'highcharts/modules/xrange';
import addDumbbell from 'highcharts/modules/dumbbell';
import addPatternFill from 'highcharts/modules/pattern-fill';

import addContour from './highcharts-contour';

export function initHighcharts() {
  window.Highcharts = Highcharts;

  HighchartsMulticolorSeries(Highcharts);
  // NOTE: Highcharts patching. It should be done in one place before any chart in rendered
  // in order to avoid conflicts
  highchartsMore(Highcharts);
  addSolidGauge(Highcharts); // https://www.highcharts.com/docs/chart-and-series-types/angular-gauges
  addHeatmap(Highcharts); // https://www.highcharts.com/docs/chart-and-series-types/heatmap
  addBoost(Highcharts); // https://www.highcharts.com/docs/advanced-chart-features/boost-module
  addExporting(Highcharts); // https://www.highcharts.com/docs/export-module/export-module-overview
  addXrange(Highcharts); // https://www.highcharts.com/docs/advanced-chart-features/boost-module
  addDumbbell(Highcharts);
  addPatternFill(Highcharts);
  addContour(Highcharts);

  /**
   * Adjust default highcharts effects globally for better use in our apps
   *
   * 1. Stop animation for inactive series
   *    ref: https://api.highcharts.com/highcharts/plotOptions.series.states.inactive.enabled
   *
   */
  Highcharts.setOptions({
    plotOptions: {
      series: {
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
    },
  });
}
