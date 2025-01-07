import { render } from '@testing-library/react';
import Formula from '../Formula';

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
const initFormula = '2*[rop] + sin([rotaryTorque] + PI)';
const onSave = jest.fn();
const defaultProps = { suggestions, initFormula, onSave };

describe('Formula', () => {
  it('should render the span with the correct parsing text', () => {
    const { getByText } = render(<Formula {...defaultProps} />);
    const span = getByText('The formula is valid');
    expect(span).toBeInTheDocument();
  });

  it('should render the span with the incorrect parsing text', () => {
    const { getByText } = render(<Formula {...defaultProps} initFormula='2*[rop] + sin([rotaryTorque]+PI'/>);
    const span = getByText('The formula is not valid');
    expect(span).toBeInTheDocument();
  });
});
