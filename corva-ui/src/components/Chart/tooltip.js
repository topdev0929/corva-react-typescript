import moment from 'moment';

const CONTRAST_TEXT_COLOR = '#ffffff';

const getTooltipRow = point =>
  `<div style="display: flex; align-items: center; padding: 4px 0;">
  <div style="background-color:${
    point.color
  }; width: 8px; height: 8px; margin-right: 8px; border-radius: 4px;"></div>
      <div style="font-size: 12px; line-height: 14px; letter-spacing: 0.4px;">
      <span style="color: ${CONTRAST_TEXT_COLOR}">
         ${point.series.name}: 
        </span> 
        <span style="color: ${CONTRAST_TEXT_COLOR}">
          ${Number(point.y).toFixed(2)}
        </span> 
        <span style="color: ${CONTRAST_TEXT_COLOR}; opacity: 0.7;">ft</span>
      </div>
  </div>`;

const getTooltipDate = date =>
  `<div style="font-size: 12px; line-height: 12px; letter-spacing: 0.4px; color: ${CONTRAST_TEXT_COLOR}; margin-top: 4px;">
      Date: ${date}
    </div>`;

export function tooltipFormatter() {
  return `<div style="border-radius: 4px; padding: 8px;"> 
    ${this.points.reduce((acc, point, pointIndex, points) => {
      const row = getTooltipRow(point);

      const dateRow = getTooltipDate(moment().format('D MMM, YYYY'));

      if (pointIndex === points.length - 1) {
        return `${acc} ${row} ${dateRow}`;
      }
      return `${acc} ${row}`;
    }, ``)}
 </div>`;
}
