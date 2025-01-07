// import { isNumber } from 'lodash';
// import { Map, List } from 'immutable';

// import { convertValue, getUnitDisplay } from '~/utils/convert';
// import { getSubData } from '~/selectors/subscriptions';

// const OPT_SUBSCRIPTION = {
//   provider: 'corva',
//   collection: 'drilling-efficiency.optimization',
// };

// const DEFAULT_DRM_VALUE = ['-', '-', '-'];
// const DEFAULT_HEATMAP_VALUE = ['-', '-', '-'];

// class HeatmapUtils {
//   constructor({ data }, zParam, yParam) {
//     this.data = data;
//     this.zParam = zParam;
//     this.isYWob = yParam === 'wob';
//   }

//   toRangeStringWithRounding = (num1, num2, defaultStr = null) => {
//     const fNum1 = (isNumber(num1)) ? num1.toFixed(0) : defaultStr;
//     const fNum2 = (isNumber(num2)) ? num2.toFixed(0) : defaultStr;
//     let rangeString = '';
//     if (fNum1 && fNum2) {
//       rangeString = `${fNum1} - ${fNum2}`;
//     } else if (fNum1) {
//       rangeString = fNum1;
//     } else if (fNum2) {
//       rangeString = fNum2;
//     }
//     return rangeString;
//   }

//   formatNumber(num, format = '0,00', defaultStr = '') {
//     return isNumber(num) ? num.formatNumeral(format) : defaultStr;
//   }

//   convertToPref = (formation) => {
//     const wobFrom = convertValue(formation.getIn(['from', 'wob']), 'force', 'klbf');
//     const wobTo = convertValue(formation.getIn(['to', 'wob']), 'force', 'klbf');
//     const wobRange = this.toRangeStringWithRounding(wobFrom, wobTo);

//     const rpmFrom = formation.getIn(['from', 'rpm']);
//     const rpmTo = formation.getIn(['to', 'rpm']);
//     const rpmRange = this.toRangeStringWithRounding(rpmFrom, rpmTo);

//     const mse = formation.get('mse')
//       ? convertValue(formation.get('mse'), 'msePressure', 'psi')
//       : '';

//     // NOTE: diff press doesn't have min, max range. It's single number
//     const diffPress = convertValue(formation.get('diff_press'), 'pressure', 'psi');
//     const dfFrom = diffPress * 0.9;
//     const dfTo = diffPress * 1.1;
//     const dfRange = this.toRangeStringWithRounding(dfFrom, dfTo);

//     const oRop = formation.get('rop');
//     const rop = isNumber(oRop) ? convertValue(oRop, 'velocity', 'ft/h') : oRop;

//     return {
//       id: formation.get('id'),
//       assetId: formation.get('asset_id'),
//       formationName: formation.get('formation_name'),
//       warning: formation.get('warning'),
//       wobFrom,
//       wobTo,
//       wobRange,
//       rpmFrom,
//       rpmTo,
//       rpmRange,
//       mse,
//       diffPress,
//       dfRange,
//       rop,
//     };
//   }

//   optSubscription = () => getSubData(this.data, OPT_SUBSCRIPTION).get('data', Map())

//   heatmapData = () => {
//     let sectionData = Map();

//     if (this.isYWob) {
//       sectionData = this.zParam === 'rop'
//         ? this.optSubscription().get('recommended_rotary', Map())
//         : this.optSubscription().get('recommended_mse', Map());
//     } else {
//       sectionData = this.zParam === 'rop'
//         ? this.optSubscription().get('recommended_rop_diff_axis', Map())
//         : this.optSubscription().get('recommended_mse_diff_axis', Map());
//     }

//     if (sectionData.isEmpty()) return DEFAULT_HEATMAP_VALUE;

//     const minWobOrDiffPress = this.isYWob
//       ? convertValue(sectionData.get('min_weight_on_bit'), 'force', 'klbf')
//       : convertValue(sectionData.get('min_diff_press', 'pressure', 'psi'));
//     const maxWobOrDiffPress = this.isYWob
//       ? convertValue(sectionData.get('max_weight_on_bit'), 'force', 'klbf')
//       : convertValue(sectionData.get('max_diff_press', 'pressure', 'psi'));

//     const minRpm = sectionData.get('min_rpm');
//     const maxRpm = sectionData.get('max_rpm');

//     const optRop = this.zParam === 'rop'
//       ? convertValue(sectionData.get('expected_rop'), 'velocity', 'ft/h')
//       : convertValue(sectionData.get('optimized_mse'), 'msePressure', 'psi');

//     return [
//       this.toRangeStringWithRounding(minWobOrDiffPress, maxWobOrDiffPress),
//       this.toRangeStringWithRounding(minRpm, maxRpm),
//       this.formatNumber(optRop),
//     ];
//   }

//   drmRecommendation = (formations, formationName) => {
//     if (formations.isEmpty()) return DEFAULT_DRM_VALUE;

//     const formationData = formations.find(item => item.get('formation_name') === formationName) || Map();

//     if (formationData.isEmpty()) return DEFAULT_DRM_VALUE;

//     const convertedFormationData = this.convertToPref(formationData);

//     return [
//       this.isYWob ? convertedFormationData.wobRange : convertedFormationData.dfRange,
//       convertedFormationData.rpmRange,
//       this.formatNumber(convertedFormationData[this.zParam]),
//     ];
//   }

//   static getMinMaxFromRangeString(value) {
//     const splitedValue = String(value).split('-');
//     return splitedValue.length < 2
//       ? [0, 0]
//       : splitedValue;
//   }

//   getTableHeight = (heatmapSetting, drmSetting) => {
//     const isToShowHeatmap = heatmapSetting.get('showHeatmap');
//     const isToShowDRM = drmSetting.get('showDRM');

//     let tableHeight = 0;
//     if (isToShowHeatmap || isToShowDRM) {
//       tableHeight = 105;
//       if (isToShowHeatmap && isToShowDRM) {
//         tableHeight = 140;
//       }
//     }

//     return tableHeight;
//   }

//   getChartStyles = (props, xAxis, yAxis, drmData) => {
//     const {
//       heatmapRecommendationSetting: heatmapSetting,
//       drmRecommendationSetting: drmSetting,
//     } = props;

//     const heatmapData = this.heatmapData();
//     const [minWobOfHeatmap, maxWobOfHeatmap] = HeatmapUtils.getMinMaxFromRangeString(heatmapData[0]);
//     const [minRpmOfHeatmap, maxRpmOfHeatmap] = HeatmapUtils.getMinMaxFromRangeString(heatmapData[1]);
//     const [minWobOfDRM, maxWobOfDRM] = HeatmapUtils.getMinMaxFromRangeString(drmData[0]);
//     const [minRpmOfDRM, maxRpmOfDRM] = HeatmapUtils.getMinMaxFromRangeString(drmData[1]);

//     const unitX = 100 / List(xAxis.categories).maxBy();
//     const unitY = 100 / List(yAxis.categories).maxBy();

//     const left = [
//       minRpmOfHeatmap * unitX,
//       minRpmOfDRM * unitX,
//     ];
//     const bottom = [
//       minWobOfHeatmap * unitY,
//       minWobOfDRM * unitY,
//     ];
//     const width = [
//       (maxRpmOfHeatmap - minRpmOfHeatmap) * unitX,
//       (maxRpmOfDRM - minRpmOfDRM) * unitX,
//     ];
//     const height = [
//       (maxWobOfHeatmap - minWobOfHeatmap) * unitY,
//       (maxWobOfDRM - minWobOfDRM) * unitY,
//     ];
//     const borderColor = [
//       heatmapSetting.get('color', '#FF6ECE'),
//       drmSetting.get('color', '#38BBE9'),
//     ];

//     const showSetting = [
//       heatmapSetting.get('showHeatmap'),
//       drmSetting.get('showDRM'),
//     ];
//     const displaySetting = showSetting.map((showOrHide, i) =>
//       showOrHide && (
//         (left[i] > 0 && bottom[i] > 0 && width[i] > 0 && height[i] > 0) &&
//         left[i] + width[i] < 100 &&
//         bottom[i] + height[i] < 100
//       ));

//     return displaySetting.map((isToShow, i) => ({
//       position: 'absolute',
//       left: `${left[i]}%`,
//       bottom: `${bottom[i]}%`,
//       width: `${width[i]}%`,
//       height: `${height[i]}%`,
//       border: `2px dashed ${borderColor[i]}`,
//       pointerEvents: 'none',
//       display: isToShow ? 'block' : 'none',
//     }));
//   }

//   getTableData = (actualData, formations, formationName, miniTableView, props) => {
//     const {
//       heatmapRecommendationSetting: heatmapSetting,
//       drmRecommendationSetting: drmSetting,
//     } = props;

//     const drmData = this.drmRecommendation(formations, formationName);

//     const tableTitles = [
//       'Mode',
//       this.isYWob ? `WOB, ${getUnitDisplay('force')}` : `Diff Press, ${getUnitDisplay('pressure')}`,
//       'RPM',
//       this.zParam === 'rop'
//         ? `ROP, ${getUnitDisplay('velocity')}`
//         : `MSE, ${getUnitDisplay('msePressure')}`,
//     ];

//     const heatmapCells = [miniTableView ? 'Heatmap' : 'Heatmap Recommendation', ...this.heatmapData()];
//     const drmCells = [miniTableView ? 'Roadmap' : 'Roadmap Recommendation', ...drmData];

//     const tableBody = [
//       [heatmapSetting.get('showHeatmap'), heatmapCells],
//       [drmSetting.get('showDRM'), drmCells],
//     ].reduce((result, [isToShow, mapData]) => result.concat(isToShow ? [mapData] : []), [actualData]);

//     return { tableTitles, tableBody };
//   }

//   getColorOfCircleIcon = (row, column, valueRange, actualData) => {
//     if (row === 0) return 'transparent';

//     const [min, max] = String(valueRange).split('-').map(str => Number(str));

//     if (!min && !max) return 'transparent';

//     const actualValue = Number(actualData[column]);
//     const closedValue = Math.abs(min - actualValue) > Math.abs(max - actualValue)
//       ? max
//       : min;
//     const deltaPercent = Math.abs((actualValue - closedValue) / actualValue) * 100;

//     if (deltaPercent < 30 && deltaPercent >= 10) {
//       return '#ffff00';
//     } else if (deltaPercent < 10) {
//       return '#00ff00';
//     }
//     return '#ff0000';
//   };
// }

// export default HeatmapUtils;
