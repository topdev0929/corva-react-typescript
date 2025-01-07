import FileSaver from 'file-saver';
import chroma from 'chroma-js';

import round from 'lodash/round';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';

/**
 * TODO: html2canvas - is used in order to take snapshots for DOM elements.
 * It must be removed after moving snapshot functionality to the back-end
 */
import html2canvas from 'html2canvas';

import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

import { SUPPORTED_DRILLING_OPERATIONS, DEFAULT_DRILLING_OPERATION_TYPE } from '~/constants/apps';

const grey500 = grey['500'];
const red500 = red['500'];
const yellow500 = yellow['500'];
const blue500 = blue['500'];
const green500 = green['500'];

const utils = {
  formatValuePrecision(value) {
    if (!Number.isFinite(value)) return value;

    const displayMorePrecise = value < 100 && value > -100;
    return displayMorePrecise ? value.formatNumeral('0,0.00') : value.formatNumeral('0,0.0');
  },

  downloadPDF(filename, pdfBlob) {
    const pdf = new File([pdfBlob], `${filename}.pdf`, {
      type: 'application/pdf;charset=utf-8',
    });
    FileSaver.saveAs(pdf);
  },

  /**
   * Unescape line break '\n' symbols. Summary and description of App may contain escaped
   * single '\\n' or multiple '\\n\\n...' line break symbols.
   * @param  {String} - String to unescape
   * @return {String} - Unescaped string
   */
  unescapeLineBreaks(string = '') {
    return string.replace(/\\n/g, '\n');
  },

  /**
   * Convert dataURL to Blob object.
   * @param dataURL {String} - dataURL string to convert
   * @returns {Blob} - result Blob object
   */
  dataURLtoBlob(dataURL) {
    const byteString = window.atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  },

  /**
   * Timer for code banchmarks
   * @param  {String} name - bame of timer
   * @return {Object}      - object with timer stop method
   */
  banchmarkTimer(name) {
    const start = new Date();
    return {
      stop() {
        const end = new Date();
        const time = end.getTime() - start.getTime();
        console.info('Timer:', name, 'finished in', time, 'ms'); // eslint-disable-line no-console
      },
    };
  },

  /**
   * Get percent value
   * @param  {number} value - target value
   * @param  {number} sum   - base value
   * @return {number}       - percentage
   */
  convertToPercent(value, sum) {
    return value && Number.isFinite(sum) && sum !== 0
      ? Math.round(((value * 100) / sum) * 100) / 100
      : 0;
  },

  /**
   * Gets average by each column in CSV
   * @param  {String} csv - CSV
   * @return {Array}      - first element is headers, second element is averages
   */
  getAverageByColumnsForCSV(csv) {
    const lines = csv.split('\n');

    const headers = lines[0].split(',');
    const initAverages = lines[1].split(',').map(string => [this.parseNumberFromString(string)]);
    const linesFrequency = this.getLinesFrequency(lines.length);

    lines.shift(); // NOTE: Remove CSV headers

    const averages = lines
      .reduce((averagesAccum, line, index) => {
        if (index % linesFrequency === 0) {
          // NOTE: every 'linesFrequency' line
          const numbers = line.split(',').map(this.parseNumberFromString);

          return averagesAccum.map((averagesArr, i) => {
            const number = +numbers[i];
            return isNumber(number) && !isNaN(number) && number > 0
              ? [...averagesArr, number]
              : averagesArr;
          });
        }
        return averagesAccum;
      }, initAverages)
      .map(averagesArr => {
        const sum = averagesArr.reduce((a, b) => a + b);
        return sum / averagesArr.length;
      });

    const maxDigitsAfterComa = 5;

    return averages.map((average, index) => ({
      header: headers[index],
      value: round(average, maxDigitsAfterComa),
    }));
  },

  /**
   * Parse number from string, if not number - returns 0
   * @param  {String} string - string that may contain number
   * @return {[type]}        - parsed number or 0
   */
  parseNumberFromString(string) {
    const number = +string;
    return isNaN(number) ? 0 : number;
  },

  /**
   * Get lines friquency to get from CSV
   * Helps to get from 1000 to 9999 lines from CSV to preven complex calculations
   * @param  {Number} linesAmount - lines amount in CSV
   * @return {Number}             - fines frequency
   */
  getLinesFrequency(linesAmount) {
    const linesFrequency = 1;
    const linesAmountString = `${linesAmount}`;
    const maxDigits = 4; // NOTE: linesAmount <= 9999

    if (linesAmountString.length <= maxDigits) {
      return linesFrequency;
    }
    const amountOfDigitsAfterThird = linesAmountString.slice(maxDigits).length;
    const numberWithSameAmountOfZeroes = 10 ** amountOfDigitsAfterThird;
    return linesFrequency * numberWithSameAmountOfZeroes;
  },

  /**
   * Transform given string to a color (RGB)
   * @param  {string} str
   * @returns {string}
   */
  getColorFromString(str) {
    return this.intToRGB(this.hashCode(str));
  },

  /**
   * Transform given number to a color (RGB)
   * @param i
   * @returns {string}
   * @private
   */
  intToRGB(i) {
    const c = (i & 0x00ffffff) // eslint-disable-line no-bitwise
      .toString(16)
      .toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  },

  /**
   * Transform given string to a hash code
   * @param str
   * @returns {number}
   * @private
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
    }
    return hash;
  },

  /**
   * Optimize event handler via throttling
   * @param obj            - event emitter (must have addEventListener method)
   * @param type           - event type
   * @param callback       - event handler
   * @param ctx            - context for event handler execution
   * @returns {function()} - unsubscribe function
   */
  throttledEventListener(obj, type, callback, ctx) {
    let running = false;

    const func = function eventListener() {
      if (running) return;
      running = true;
      window.requestAnimationFrame(() => {
        callback.call(ctx);
        running = false;
      });
    };

    obj.addEventListener(type, func);

    return () => {
      obj.removeEventListener(type, func);
    };
  },

  /**
   * Get a snapshot for any DOM element on the page
   * @param elemId {string} - dom element id
   * @returns {string}      - data URL for snapshot
   */
  async getSnapshotForElement(elemId) {
    const elem = window.document.getElementById(elemId);
    if (!elem) return null;

    const { clientHeight: height, clientWidth: width } = elem;
    const canvas = await html2canvas(elem, { height, width, logging: false });
    return canvas.toDataURL();
  },

  getAssetStatusColor(status) {
    if (status === 'active') {
      return green500;
    } else if (status === 'complete') {
      return blue500;
    } else if (status === 'paused') {
      return yellow500;
    } else if (status === 'idle' || status === 'unknown') {
      return grey500;
    }
    return red500;
  },

  /**
   * Finds closest to value in array of numbers
   * Source: https://stackoverflow.com/a/19277804/8337033
   * @param  {array}  array - array to find closest to value
   * @param  {number} value - value to which find closest in array
   * @return {number}       - closest to value in array
   */
  closest(array, value) {
    return array.reduce((currentClosest, arrayItem) =>
      Math.abs(arrayItem - value) < Math.abs(currentClosest - value) ? arrayItem : currentClosest
    );
  },

  mathMax(a, b) {
    if (!Number.isFinite(a)) {
      return b;
    } else if (!Number.isFinite(b)) {
      return a;
    }
    return Math.max(a, b);
  },

  mathMin(a, b) {
    if (!Number.isFinite(a)) {
      return b;
    } else if (!Number.isFinite(b)) {
      return a;
    }
    return Math.min(a, b);
  },

  /**
   * Gets operation by operation type
   * @param  {number|null}      operationType - operation type
   * @return {object|undefined} operation - operation
   */
  getOperationByType(operationType) {
    return Object.values(SUPPORTED_DRILLING_OPERATIONS).find(
      ({ value }) => value === operationType || DEFAULT_DRILLING_OPERATION_TYPE
    );
  },

  getUserFullName(user) {
    return user ? `${user.first_name} ${user.last_name}` : '';
  },

  getNameInitials(name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.substr(0, 1))
      .join('');
  },

  getS3BucketName() {
    return process.env.REACT_APP_ENVIRONMENT === 'development' ||
      process.env.REACT_APP_ENVIRONMENT === 'qa'
      ? 'corva-files-qa'
      : 'corva-files';
  },

  getS3FileUrl(bucket, fileName) {
    return `https://${bucket}.s3.amazonaws.com/${fileName}`;
  },

  getFileNameWithExtensionFromPath(path = '') {
    return path.split('?')[0].replace(/^.*[\\/]/, '');
  },

  hexToRgbA(hex, alpha = 1) {
    const rgba = chroma(hex).rgba();
    rgba[rgba.length - 1] = alpha;
    return `rgba(${rgba.join(',')})`;
  },

  truncateString(str, limit) {
    return str.length > limit ? `${str.substr(0, limit - 1)}&hellip;` : str;
  },

  /**
   * Copies text to clipboard
   * @param  {string}      text - text to copy
   * @return {undefined}
   */
  copyToClipboard(text) {
    // NOTE: it doesn't work if page is served from insecure origin like http://app.local.corva.ai
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');

    selection.removeAllRanges();
    document.body.removeChild(textarea);
  },
};

/**
 * Enable that for "HTML to image" service
 */
window.getSnapshotForElement = utils.getSnapshotForElement;

export default utils;
