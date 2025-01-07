import lodash from 'lodash';
import fs from 'fs';
import { lightThemeVariables, darkThemeVariables } from '../src/config/theme/themeVariables.mjs';

const GENERATED_THEME_VARIABLES_OUTPUT_PATH = './src/styles/generatedThemesVariables.global.css';

function flattenObject(obj, prefix = '--', resultObj = {}) {
  Object.entries(obj).forEach(([key, value]) => {
    const kebabCasedKey = lodash.kebabCase(key);

    if (lodash.isPlainObject(value)) {
      flattenObject(value, `${prefix}${kebabCasedKey}-`, resultObj);
    } else {
      // eslint-disable-next-line no-param-reassign
      resultObj[`${prefix}${kebabCasedKey}`] = value;
    }
  });

  return resultObj;
}

function getCssVariablesFromKeyValueMap(keyValueMap) {
  return Object.entries(keyValueMap).reduce((accum, [key, value]) => {
    return `${accum}${key}:${value};`;
  }, '');
}

function getCssThemesVariables(configs) {
  return configs.reduce((accum, { themeSelector, themeVariables }) => {
    const flattenedThemeObj = flattenObject(themeVariables);
    const cssVariablesString = getCssVariablesFromKeyValueMap(flattenedThemeObj);

    return `${accum}${themeSelector}{${cssVariablesString}}`;
  }, '');
}

const cssThemesVariables = getCssThemesVariables([
  {
    themeSelector: '[data-corva-theme-light]',
    themeVariables: lightThemeVariables,
  },
  {
    themeSelector: '[data-corva-theme-dark]',
    themeVariables: darkThemeVariables,
  },
]);

fs.writeFileSync(
  GENERATED_THEME_VARIABLES_OUTPUT_PATH,
  `/* This file was fully generated via the the script that uses our MUI theme variables object as a source */
${cssThemesVariables}`
);
