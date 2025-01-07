import moment from 'moment';

import { DATE_RANGE_FILTERS_BY_KEYS } from '~/constants/alerts';

const getStartTimeByRelativeRange = (range, millisecondsFormat = false) => {
  let startTime = null;

  switch (range) {
    case DATE_RANGE_FILTERS_BY_KEYS.last12hours.value:
      startTime = moment().subtract(12, 'hours');
      break;
    case DATE_RANGE_FILTERS_BY_KEYS.last24hours.value:
      startTime = moment().subtract(1, 'days');
      break;
    case DATE_RANGE_FILTERS_BY_KEYS.last7days.value:
      startTime = moment().subtract(7, 'days');
      break;
    case DATE_RANGE_FILTERS_BY_KEYS.lastMonth.value:
      startTime = moment().subtract(1, 'month');
      break;
    default:
      return null;
  }

  return millisecondsFormat ? startTime.valueOf() : startTime.unix();
};

export { getStartTimeByRelativeRange };
