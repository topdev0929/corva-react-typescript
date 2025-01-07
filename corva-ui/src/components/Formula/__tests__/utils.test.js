import {
  convertStringToHtml,
  convertHtmlToString,
  convertStringToEditorValue,
  convertEditorValueToString,
} from '~/components/Formula/utils';

const suggestions = [
  { key: 'rop', label: 'ROP', unit: 'ft/h', type: 'Sensor Trace(WITSML)' },
  { key: 'rpm', label: 'RPM', type: 'Sensor Trace(WITSML)' },
  { key: 'rict', label: 'Rict', type: 'Sensor Trace(WITSML)' },
  { key: 'rotaryTorque', label: 'Rotary Torque', unit: 'ft-klbf', type: 'Corva Trace' },
  { key: 'rspd', label: 'Rspd', unit: 'ft', type: 'Corva Trace' },
  { key: 'spm', label: 'SPM', unit: 'ft', type: 'Corva Trace' },
  { key: 'standpipePressure', label: 'Standpipe Pressure', unit: 'psi', type: 'Roadmap Trace' },
  { key: 'state', label: 'State', type: 'Roadmap Trace' },
  { key: 'tda', label: 'Tda', unit: 'ft', type: 'Roadmap Trace' },
  { key: 'time', label: 'Time', unit: 'h', type: 'Trace App' },
  { key: 'wob', label: 'Weight on Bit', unit: 'klbf', type: 'Trace App' },
  { key: 'tvd', label: 'True Vertical Depth', unit: 'ft', type: 'Dev Center Collection' },
  { key: 'spd', label: 'SPD', unit: 'ft', type: 'Dev Center Collection' },
];
const value = 'test';

describe('utils', () => {
  it('should return correct value (convertStringToHtml)', () => {
    expect(convertStringToHtml(value)).toEqual(`<p>${value}</p>`);
  });

  it('should return correct value (convertHtmlToString)', () => {
    expect(convertHtmlToString(`<p>${value}</p>`)).toEqual(value);
  });

  it('should return correct value (convertStringToEditorValue)', () => {
    expect(convertStringToEditorValue(value, suggestions)).toEqual(`<p>${value}</p>`);
  });

  it('should return correct value (convertEditorValueToString)', () => {
    expect(convertEditorValueToString(`<p>${value}</p>`, suggestions)).toEqual(value);
  });

  it('should return correct value (convertStringToHtml and convertHtmlToString)', () => {
    expect(convertHtmlToString(convertStringToHtml(value))).toEqual(value);
  });

  it('should return correct value (convertStringToEditorValue and convertEditorValueToString)', () => {
    expect(
      convertEditorValueToString(convertStringToEditorValue(value, suggestions), suggestions)
    ).toEqual(value);
  });
});
