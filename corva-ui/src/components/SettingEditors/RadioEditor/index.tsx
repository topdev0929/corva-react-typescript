import PropTypes from 'prop-types';

import { Radio, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';

type RadioEditorProps = PropTypes.InferProps<typeof radioEditorPropTypes>;

const RadioEditor = ({ options, currentValue, defaultValue, onChange }: RadioEditorProps): JSX.Element => {
  const selectedValue = currentValue === undefined ? defaultValue : currentValue;
  return (
    <FormControl component="fieldset" margin="dense" fullWidth>
      <RadioGroup aria-label="position" name="radio_editor" row>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            onChange={() => onChange(value)}
            control={<Radio color="primary" checked={value === selectedValue} />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const radioEditorPropTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }))
    .isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
}

RadioEditor.propTypes = radioEditorPropTypes;

RadioEditor.defaultProps = {
  currentValue: undefined,
};

export default RadioEditor;

// A Higher-Order Component that allows setting up an editor component
export const radioEditorForDefinitions = (options, defaultValue) => props => (
  <RadioEditor {...props} defaultValue={defaultValue} options={options} />
);
