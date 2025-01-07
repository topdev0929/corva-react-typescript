import moment from 'moment';
import { OBJECTIVE_PERIOD_LIST } from '../constants';

export function getTimestampByPeriod(period, customFrom, customTo) {
  let start;
  let end = moment().unix();

  if (period === OBJECTIVE_PERIOD_LIST[1].value) {
    // '12h'
    start = moment().subtract(12, 'hours').unix();
  } else if (period === OBJECTIVE_PERIOD_LIST[2].value) {
    // '24h'
    start = moment().subtract(24, 'hours').unix();
  } else if (period === OBJECTIVE_PERIOD_LIST[3].value) {
    // '7d'
    start = moment().subtract(7, 'days').unix();
  } else if (period === OBJECTIVE_PERIOD_LIST[4].value) {
    // '1month'
    start = moment().subtract(1, 'month').unix();
  } else if (period === OBJECTIVE_PERIOD_LIST[5].value) {
    // 'custom'
    start = customFrom;
    end = customTo;
  } else {
    start = null;
    end = null;
  }

  return [start, end];
}
