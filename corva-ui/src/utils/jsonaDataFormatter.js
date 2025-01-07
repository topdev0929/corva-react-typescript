import Jsona, { SwitchCaseJsonMapper } from 'jsona';

export const jsonaDataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({ switchChar: '_' }),
});
