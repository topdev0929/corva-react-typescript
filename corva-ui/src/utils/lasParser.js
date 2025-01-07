const VERSION_CONF_STR = 'VERS.';
const WRAP_CONF_STR = 'WRAP.';
const DELIMITER_CONF_STR = 'DLM';

const VERSION_SECTION_BEGINNING = '~version';
const COLUMNS_LINE_BEGINNING = '~curve';
const DATA_LINE_BEGINNING = '~a';

export default class LasParser {
  constructor() {
    this.config = {
      version: null,
      wrap: null,
      delimiter: null,
    };
  }

  getConfiguration = lines => {
    let version = null;
    let wrap = null;
    let delimiter = null;
    let flag = false;

    lines.forEach(line => {
      // NOTE: Detect the beginning of version section
      if (line.toLowerCase().startsWith(VERSION_SECTION_BEGINNING)) {
        flag = true;
        return;
      }

      // NOTE: Detect the beginning of other sections
      if (line.toLowerCase().startsWith('~')) {
        flag = false;
        return;
      }

      if (flag) {
        const configurationLine = line.split(' ').filter(Boolean);

        // NOTE: When parsing delimiter line, `value` will be '.' (DLM .  -> LAS 3.0 format)
        const [key, value, dlmValue] = configurationLine;

        switch (key) {
          case VERSION_CONF_STR:
            version = value;
            break;
          case WRAP_CONF_STR:
            wrap = value;
            break;
          case DELIMITER_CONF_STR:
            delimiter = dlmValue;
            break;
          default:
            break;
        }
      }

      this.config = {
        version,
        wrap,
        delimiter,
      };
    });
  };

  parseHeaders = file => {
    const lines = file.split('\n');

    this.getConfiguration(lines);

    let flag = false;

    return lines.reduce((accHeaders, line) => {
      if (line.toLowerCase().startsWith(COLUMNS_LINE_BEGINNING)) {
        flag = true;
        return accHeaders;
      }

      if (line.startsWith('~')) {
        flag = false;
      }

      if (flag && !line.startsWith('#') && !line.startsWith('\r')) {
        const clearedLine = line.split(' ').filter(Boolean);
        if (!clearedLine) {
          return accHeaders;
        }

        return accHeaders.push(clearedLine[0]);
      }

      return accHeaders;
    }, []);
  };

  parseData = (file, parsedHeaders, keysForParsing) => {
    const lines = file.split('\n');

    let flag = false;

    return lines.reduce((accData, line) => {
      if (line.toLowerCase().startsWith(DATA_LINE_BEGINNING)) {
        flag = true;
        return accData;
      }

      if (line.startsWith('~')) {
        flag = false;
      }

      if (flag) {
        // NOTE: Delimiters can be comma, space and tab.
        const headers = line.split(/[\t\s,]/).filter(Boolean);
        const dataPiece = headers.reduce((acc, item, index) => {
          const key = parsedHeaders[index];
          const parsingKeyItem = keysForParsing.find(keyItem => keyItem.parsingKey === key);

          if (parsingKeyItem) {
            const parsingKey = parsingKeyItem.innerKey;
            return {
              ...acc,
              [parsingKey]: parseFloat(item, 2),
            };
          }

          return acc;
        }, {});

        return dataPiece.isEmpty() ? accData : accData.push(dataPiece);
      }

      return accData;
    }, []);
  };
}
