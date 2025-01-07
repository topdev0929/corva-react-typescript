import { Formula as FormulaComponent } from '~/components/Formula';

export const Formula = props => <FormulaComponent {...props} />;
Formula.storyName = 'Formula';

export default {
  title: 'Components/Formula',
  component: FormulaComponent,
  argTypes: {
    suggestions: {
      defaultValue: [
        { key: 'rop', label: 'ROP', unit: 'ft/h', type: 'Sensor Trace(WITSML)' },
        { key: 'rpm', label: 'RPM', type: 'Sensor Trace(WITSML)' },
        { key: 'rict', label: 'Rict', type: 'Sensor Trace(WITSML)' },
        { key: 'rotaryTorque', label: 'Rotary Torque', unit: 'ft-klbf', type: 'Corva Trace' },
        { key: 'rspd', label: 'Rspd', unit: 'ft', type: 'Corva Trace' },
        { key: 'spm', label: 'SPM', unit: 'ft', type: 'Corva Trace' },
        {
          key: 'standpipePressure',
          label: 'Standpipe Pressure',
          unit: 'psi',
          type: 'Roadmap Trace',
        },
        { key: 'state', label: 'State', type: 'Roadmap Trace' },
        { key: 'tda', label: 'Tda', unit: 'ft', type: 'Roadmap Trace' },
        { key: 'time', label: 'Time', unit: 'h', type: 'Trace App' },
        { key: 'wob', label: 'Weight on Bit', unit: 'klbf', type: 'Trace App' },
        { key: 'tvd', label: 'True Vertical Depth', unit: 'ft', type: 'Dev Center Collection' },
        { key: 'spd', label: 'SPD', unit: 'ft', type: 'Dev Center Collection' },
      ],
    },
    initFormula: {
      defaultValue: '2*[rop] + sin([rotaryTorque] + PI)',
      control: {
        type: 'string',
      },
    },
    onSave: {
      defaultValue: () => null,
    },
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Formula/Formula.js',
    designLink:
      'https://www.figma.com/file/itdGcE7hIlVKUKtQCWyvL4/Traces?type=design&node-id=9320-489804',
  },
};
