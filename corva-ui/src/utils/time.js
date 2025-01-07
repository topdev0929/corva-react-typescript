import moment from 'moment-timezone';
// import { currentUserSelector } from '~/selectors/login';

/**
 * Format timestamp according to timezone
 * If no timezone provided - use company timezone
 * @param  {Number} timestamp - Timestamp in seconds
 * @param  {String} format    - 'moment' format
 * @param  {String} tz        - 'moment' timezone
 * @return {String}           - Formatted date
 */

// export const formatTimestampUsingTimezone = (timestamp, format, tz = null) => {
//   if (tz) return moment.unix(timestamp).tz(tz).format(format);

//   const currentUser = currentUserSelector(window.reduxStore.getState());
//   const timezone = currentUser.getIn(['company', 'time_zone']);
//   return moment.unix(timestamp).tz(timezone).format(format);
// };

export const formatTimestamp = (timestamp, format) => moment.unix(timestamp).format(format);

/**
 * Format timestamp to 'last data update' format
 * @param  {Number}  timestamp          - Timestamp in seconds
 * @param  {Boolean} useCompanyTimezone - Use user's company timezone otherwise browser (by default)
 * @return {String}                     - Formatted date
 */
// [TODO: Looks like this file was moved and some parts were commmented to make it work]
// export const formatLastDataUpdate = (timestamp, useCompanyTimezone) => {
export const formatLastDataUpdate = timestamp => {
  const lastDataUpdateFormat = 'M/D/YYYY h:mm a';
  return formatTimestamp(timestamp, lastDataUpdateFormat);

  // return useCompanyTimezone
  //   ? formatTimestampUsingTimezone(timestamp, lastDataUpdateFormat)
  //   : formatTimestamp(timestamp, lastDataUpdateFormat);
};

/**
 * Get milliseconds from start of given day
 * @param mmt {moment.js}
 * @returns {number}   - Integer
 */
export const getDurationFromDayStart = mmt =>
  mmt - mmt.clone().hour(0).minute(0).second(0).millisecond(0);

/**
 * Extract day time from given timestamps
 * Day time is time from 6am to 18pm
 * @param start {number}
 * @param end {number}
 * @returns {number}                       - daytime seconds
 */
export const getDayTimeDuration = (start, end) => {
  const startDate = moment.unix(start);
  const endDate = moment.unix(end);

  const sixHours = moment.duration(6, 'hours');
  const twelweHours = moment.duration(12, 'hours');
  const eighteenHours = moment.duration(18, 'hours');

  const endDateDayStart = endDate - getDurationFromDayStart(endDate);
  const startDateDayStart = startDate - getDurationFromDayStart(startDate);
  // NOTE: Days between two dates
  const daysCount = moment.duration(endDateDayStart - startDateDayStart).asDays() + 1;

  // NOTE: Calculate day time of every day
  let result = daysCount * twelweHours;

  // NOTE: Subtract redundant time due to start date
  if (startDate.hours() > 17) {
    result -= twelweHours;
  } else if (startDate.hours() >= 6) {
    result -= getDurationFromDayStart(startDate) - sixHours;
  }

  // NOTE: Subtract redundant time due to end date
  if (endDate.hours() <= 5) {
    result -= twelweHours;
  } else if (endDate.hours() < 18) {
    result -= eighteenHours - getDurationFromDayStart(endDate);
  }

  // NOTE: Convert to seconds
  return Math.round(result / 1000);
};
