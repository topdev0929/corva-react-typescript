import moment from 'moment';
import { round } from 'lodash';

import iconInfo from '../../assets/icon-info.svg';
import { EVENT_ID_SEPARATOR, TOOLTIP_DATE_FORMAT, TEXT_GRAY } from '../../constants';

const TOOLTIP_CONTENT_OFFSET = 65;
const TOOLTIP_SERIES_ITEM_HEIGHT = 17;

const TOOLTIP_CLASSES = {
  root: 'tpChartTooltip',
  title: 'tpChartTooltip__title',
  content: 'tpChartTooltip__content',
  contentColumns: 'columns',
  seriesItem: 'tpChartTooltip__series-item',
  seriesItemHeader: 'tpChartTooltip__series-header',
  marker: 'tpChartTooltip__marker',
  seriesLimitMessage: 'tpChartTooltip__series-limit-message',
};

// seriesCount - total number of selected channels
// gridHeight - chart height
// assetsCount - number of asset in the tooltip (mostly used for overlay mode)
const getSeriesTooltipLayoutConfig = (seriesCount, gridHeight, assetsCount) => {
  const availableSpaceHeight = gridHeight - TOOLTIP_CONTENT_OFFSET;
  // number of selected channels * height of 1 row in tooltip * number of assets + channel title
  const seriesContainerHeight = seriesCount * TOOLTIP_SERIES_ITEM_HEIGHT * (assetsCount + 1);
  const className =
    seriesContainerHeight > availableSpaceHeight ? TOOLTIP_CLASSES.contentColumns : '';
  const columnsCount = className ? 2 : 1;

  return {
    className,
    totalSeriesCount: seriesCount,
    displayedSeriesCount:
      Math.floor(availableSpaceHeight / (TOOLTIP_SERIES_ITEM_HEIGHT * (assetsCount + 1))) *
      columnsCount,
  };
};

const tooltipOptions = (xAxis, gridHeight, show, isAssetViewer) => ({
  trigger: 'axis',
  confine: true,
  axisPointer: {
    type: 'none',
  },
  backgroundColor: 'rgba(59, 59, 59, 0.9)',
  borderWidth: 0,
  textStyle: {
    color: '#fff',
    fontSize: 11,
  },
  extraCssText: 'max-height: 100%; overflow: hidden; padding: 16px 10px 32px; z-index: 1',
  alwaysShowContent: false,
  formatter: function tooltipFormatter(params) {
    if (!show) return null;

    // event tooltip
    if (!Array.isArray(params)) {
      const { seriesId, seriesName, data } = params;

      const meta = seriesId.split(EVENT_ID_SEPARATOR);
      const stageNumber = meta[2];
      const eventName = meta[4];
      const precision = meta[5];
      const dataItems = data[2] || [];

      const xValue =
        xAxis.type === 'time'
          ? moment.unix(data[0]).format('MM/DD/YYYY kk:mm:ss')
          : round(data[0], 2);

      const yValue = Number.isFinite(data[1]) ? round(data[1], precision) : data[1];

      return `
        <div class="${TOOLTIP_CLASSES.root}">
          <div class="${TOOLTIP_CLASSES.seriesItem}"><span>Event:</span> ${eventName} </div>
          <div class="${TOOLTIP_CLASSES.seriesItem}"><span>${seriesName}:</span> ${yValue} </div>
          ${dataItems
            .map(
              ([name, value]) =>
                `<div class="${TOOLTIP_CLASSES.seriesItem}"><span>${name}:</span> ${value} </div>`
            )
            .join('')}
          <div class="${TOOLTIP_CLASSES.seriesItem}"><span>Stage:</span> ${stageNumber} </div>
          <div class="${TOOLTIP_CLASSES.seriesItem}"><span>Time: </span> ${xValue} </div>
          <div>
            Click <i>edit</i> to enable drag & drop.
          </div>
        </div>
      `;
    }

    const seriesGrouped = {};
    const seriesNames = [];
    const seriesUnits = [];
    const seriesColors = {};
    let timeValue;

    params.forEach(seriesItem => {
      const { seriesId, seriesName, data, axisValue } = seriesItem;
      if (!data || !seriesName) {
        return;
      }
      const meta = seriesId.split('--');

      const info = {
        assetName: meta[1],
        stageNumber: meta[2],
        data,
        isAbra: seriesName.startsWith('ABRA'),
      };

      seriesColors[seriesName] = meta[5];

      if (seriesGrouped[seriesName]) {
        seriesGrouped[seriesName].push(info);
      } else {
        timeValue =
          xAxis.type === 'time'
            ? moment.unix(axisValue).format(TOOLTIP_DATE_FORMAT)
            : round(axisValue, 2);
        seriesGrouped[seriesName] = [info];
        seriesNames.push(seriesName);
        seriesUnits.push(meta[4]);
      }
    });

    const { className, totalSeriesCount, displayedSeriesCount } = getSeriesTooltipLayoutConfig(
      seriesNames.length,
      gridHeight,
      Object.values(seriesGrouped)[0].length
    );

    const tooltipTitle = `${timeValue}`;
    const tooltipContent = seriesNames
      .slice(0, displayedSeriesCount)
      .map((seriesName, index) => {
        const unit = seriesUnits[index];
        const seriesColor = seriesColors[seriesName];

        const marker = `<span class="${TOOLTIP_CLASSES.marker}" style="background: ${seriesColor}"></span>`;
        const seriesHeader = `<div class="${
          TOOLTIP_CLASSES.seriesItemHeader
        }"> ${marker} ${seriesName}${unit ? ` (${unit})` : ''}</div>`;
        const seriesBody = seriesGrouped[seriesName]
          .map(({ assetName = '', stageNumber, data, isAbra }) => {
            const stageLabel = assetName ? ` | Stage ${stageNumber}:` : `Stage ${stageNumber}:`;
            const assetStageLabel = isAssetViewer ? assetName : `${assetName}${stageLabel}`;

            return `<div class="${TOOLTIP_CLASSES.seriesItem}"><span>${
              isAbra ? 'Pressure: ' : assetStageLabel
            }</span> ${data[1]} </div>`;
          })
          .join('');

        return `<div class="${TOOLTIP_CLASSES.seriesItem}"> ${seriesHeader} ${seriesBody}</div>`;
      })
      .join('');

    let seriesLimitMessage = '';
    if (totalSeriesCount > displayedSeriesCount) {
      seriesLimitMessage = `<span class="${TOOLTIP_CLASSES.seriesLimitMessage}">
        <img src="${iconInfo}"/>${displayedSeriesCount}/${totalSeriesCount} channels displayed, reduce selection
      </span>`;
    }

    return `
      <div class="${TOOLTIP_CLASSES.root}">
        <div class="${TOOLTIP_CLASSES.title}"> ${tooltipTitle} </div>
        <div class="${TOOLTIP_CLASSES.content} ${className}">${tooltipContent} </div>
        ${seriesLimitMessage}
      </div>
    `;
  },
});

export const getTooltipGraphicBadge = (hidden, mobile) => {
  return {
    id: 'tooltipOffBadge',
    elements: [
      {
        type: 'group',
        draggable: true,
        left: 'center',
        width: hidden ? 0 : 95,
        top: mobile ? '27%' : 37,
        children: [
          {
            type: 'rect',
            z: 100,
            invisible: hidden,
            left: 'center',
            top: 'middle',
            shape: {
              width: 95,
              height: 32,
              r: 4,
            },
            style: {
              fill: '#191919',
              opacity: 0.8,
            },
          },
          {
            type: 'text',
            invisible: hidden,
            z: 100,
            left: 'center',
            top: 'middle',
            style: {
              fill: TEXT_GRAY,
              fontSize: 14,
              text: 'Tooltip is off',
            },
          },
        ],
      },
    ],
  };
};

export default tooltipOptions;
