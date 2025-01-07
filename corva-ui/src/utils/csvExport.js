import FileSaver from 'file-saver';

export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  FileSaver.saveAs(blob, filename);
}

function findTitle(firstTitles, currentline, j) {
  const titles = Object.keys(firstTitles);
  let result;
  titles.forEach((item) => {
    if (currentline[j].toLowerCase().indexOf(item) !== -1) {
      result = firstTitles[item];
    }
  });
  return result;
}

export function convertCsvToJson(csv, firstTitles, secondTitles, effectiveDepth, endDepth) {
  try {
    const lines = csv.split(/[\r\n]+/);
    const array = [];
    let i;
    let j;
    let k;
    const rowNumber = lines.length;
    let columnNumber = 0;

    for (i = 0; i < lines.length; i += 1) {
      const currentline = lines[i].split(',');
      array[i] = [];
      for (j = 0; j < currentline.length; j += 1) {
        let value;
        if (i === 0) {
          value = findTitle(firstTitles, currentline, j);
          columnNumber += 1;
        } else if (i === 1) {
          value = secondTitles[currentline[j]];
        } else {
          value = parseFloat(currentline[j]);
        }
        array[i][j] = value;
      }
    }

    const objLength = 2;
    const result = {};
    let points = [];
    let off = 0;

    const headers = lines[0].split(',');
    for (i = 0; i < columnNumber / objLength; i += 1) {
      points = [];

      for (j = 2; j < rowNumber; j += 1) {
        const obj = {};
        for (k = 0; k < objLength; k += 1) {
          obj[array[1][(i * objLength) + k]] = array[j][(i * objLength) + k];
        }
        points.push(obj);
      }

      const dataLine = {
        openhole_friction_factor: off,
        casing_friction_factor: off,
        points,
        title: headers[i * objLength],
      };
      off += 1;

      const linesArray = [];
      linesArray.push(dataLine);
      const serieName = array[0][i * objLength] ? array[0][i * objLength] : 'pick_up';

      if (!result[serieName]) {
        result[serieName] = [];
      }
      result[serieName].push(dataLine);
    }

    if (Object.keys(result).length === 0) {
      return null;
    }

    const dataObject = {
      data: {
        curves: result,
      },
      effective_depth: effectiveDepth,
      end_depth: endDepth,
    };
    return dataObject;
  } catch (err) {
    return null;
  }
}

function writeResults(array, titles, titlesArray, prefix) {
  let result = '';
  for (let i = 0; i < array.length; i += 1) {
    if (titles[titlesArray[i]]) {
      result += prefix + titles[titlesArray[i]];
    } else {
      result += titlesArray[i];
    }
    result += i < array.length - 1 ? ',' : '';
  }

  if (array.length > 0) {
    result += '\n';
  }
  for (let i = 0; i < array.length; i += 1) {
    result += array[i];
    result += i < array.length - 1 ? ',' : '';
  }
  return result;
}

/* eslint-disable no-param-reassign */
export function convertJsonToCsv(obj, titles, markers, prefix) {
  let array = [];
  let titlesArray = [];
  let result = '';
  let addPrefix = '';
  if (!prefix) {
    prefix = '';
  }

  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return processArray(obj, titles, markers, prefix); // eslint-disable-line no-use-before-define
  }

  const keys = Object.keys(obj);

  keys.forEach((key) => {
    if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
      result += writeResults(array, titles, titlesArray, prefix);
      array = [];
      titlesArray = [];

      if (result[result.length - 1] !== '\n') {
        result += '\n';
      }
      addPrefix = (markers && markers[key]) ? `${markers[key]} ` : '';
      result += convertJsonToCsv(obj[key], titles, markers, prefix + addPrefix);
    } else if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      result += writeResults(array, titles, titlesArray, prefix);
      array = [];
      titlesArray = [];

      if (result.length > 0 && result[result.length - 1] !== '\n') {
        result += '\n';
      }
      addPrefix = (markers && markers[key]) ? `${markers[key]} ` : '';
      result += convertJsonToCsv(obj[key], titles, markers, prefix + addPrefix);
    } else if (obj[key] && obj[key].toString().length > 0) {
      array.push(obj[key]);
      titlesArray.push(key);
    }
  });

  if (result[result.length - 1] !== '\n') {
    result += '\n';
  }
  result += writeResults(array, titles, titlesArray, prefix);
  return result;
}
/* eslint-enable no-param-reassign */

export function concatCsv(list) {
  return list.reduce((acc, { title, csv }) => {
    return `${acc}\n${title}${csv}`;
  }, '');
}

function processArray(obj, titles, markers, prefix) {
  if (!obj || obj.length === 0) {
    return '';
  }
  let result = '';
  const keys = Object.keys(obj[0]);
  const columns = keys.length;
  let columnsNew = columns;
  const newTitles = [];
  let internalArray = false;

  for (let i = 0; i < obj.length; i += 1) {
    for (let j = 0; j < columns; j += 1) {
      if (Object.prototype.toString.call(obj[i][keys[j]]) === '[object Array]') {
        columnsNew = j;
      }
    }
  }

  if (titles) {
    for (let i = 0; i < columnsNew; i += 1) {
      if (titles[keys[i]]) {
        newTitles[i] = prefix + titles[keys[i]];
      } else {
        newTitles[i] = keys[i];
      }
    }
  }

  if (result[result.length - 1] !== '\n') {
    result += '\n';
  }
  for (let i = 0; i < obj.length; i += 1) {
    if (!i || internalArray) {
      for (let k = 0; k < columnsNew; k += 1) {
        if (titles) {
          result += newTitles[k];
        }
        result += k < columnsNew - 1 ? ',' : '';
      }
      result += '\n';
    }

    for (let j = 0; j < columns; j += 1) {
      if (Object.prototype.toString.call(obj[i][keys[j]]) === '[object Array]') {
        internalArray = true;
        const addPrefix = (markers && markers[keys[j]]) ? `${markers[keys[j]]} ` : '';
        result += `\n${convertJsonToCsv(obj[i][keys[j]], titles, markers, prefix + addPrefix)}`;
      } else {
        if (obj[i][keys[j]] || obj[i][keys[j]] === 0) {
          result += obj[i][keys[j]];
        }
        result += j < columns - 1 ? ',' : '';
      }
    }
    result += '\n';
  }
  return result;
}
