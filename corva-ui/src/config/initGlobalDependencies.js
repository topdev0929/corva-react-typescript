import { initHighcharts } from '~/config/highcharts';
import { initializeSocketClient } from '~/clients/subscriptions';
import './extendNative.js';

initHighcharts();
initializeSocketClient();
