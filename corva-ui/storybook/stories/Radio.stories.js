import { useState } from 'react';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';

export const StandaloneRadio = () => {
  const [value, setValue] = useState('male');
  const handleChange = e => setValue(e.target.value);

  return (
    <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
      <div>REGULAR</div>
      <div>
        <Radio value="male" checked={value === 'male'} onChange={handleChange} />
        <Radio value="female" checked={value === 'female'} onChange={handleChange} />
        <Radio value="other" checked={value === 'other'} onChange={handleChange} />
        <Radio value="disabled" disabled />
        <Radio value="disabled-checked" disabled checked />
      </div>
      <div>SMALL</div>
      <div>
        <Radio className="small" value="male" checked={value === 'male'} onChange={handleChange} />
        <Radio
          className="small"
          value="female"
          checked={value === 'female'}
          onChange={handleChange}
        />
        <Radio
          className="small"
          value="other"
          checked={value === 'other'}
          onChange={handleChange}
        />
        <Radio className="small" value="disabled" disabled />
        <Radio className="small" value="disabled-checked" disabled checked />
      </div>
    </div>
  );
};

export const RadioFormControl = () => {
  const [value, setValue] = useState('male');
  const onChange = e => setValue(e.target.value);

  return (
    <>
      <div>REGULAR</div>

      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div>SMALL</div>
      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange}>
            <FormControlLabel className="small" value="female" control={<Radio />} label="Female" />
            <FormControlLabel className="small" value="male" control={<Radio />} label="Male" />
            <FormControlLabel className="small" value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              className="small"
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              className="small"
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </>
  );
};

export const DenseRadioForm = () => {
  const [value, setValue] = useState('male');
  const onChange = e => setValue(e.target.value);

  return (
    <>
      <div>REGULAR</div>

      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange}>
            <FormControlLabel className="dense" value="female" control={<Radio />} label="Female" />
            <FormControlLabel className="dense" value="male" control={<Radio />} label="Male" />
            <FormControlLabel className="dense" value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              className="dense"
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              className="dense"
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div>SMALL</div>
      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange}>
            <FormControlLabel
              className="small dense"
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel
              className="small dense"
              value="male"
              control={<Radio />}
              label="Male"
            />
            <FormControlLabel
              className="small dense"
              value="other"
              control={<Radio />}
              label="Other"
            />
            <FormControlLabel
              className="small dense"
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              className="small dense"
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </>
  );
};

export const HorizontalRadioForm = () => {
  const [value, setValue] = useState('male');
  const onChange = e => setValue(e.target.value);

  return (
    <>
      <div>REGULAR</div>

      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange} row>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div>SMALL</div>
      <div style={{ width: '100%', backgroundColor: '#464646', padding: 16 }}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup name="gender1" value={value} onChange={onChange} row>
            <FormControlLabel className="small" value="female" control={<Radio />} label="Female" />
            <FormControlLabel className="small" value="male" control={<Radio />} label="Male" />
            <FormControlLabel className="small" value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              className="small"
              value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
            <FormControlLabel
              className="small"
              value="male"
              disabled
              control={<Radio checked />}
              label="(Disabled checked option)"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </>
  );
};

export default {
  title: 'Components/Radio',
  component: StandaloneRadio,
  argTypes: {
    muiButtonProps: {
      name: '...muiRadioProps',
      description:
        '<a href="https://v4.mui.com/api/radio/#radio-api" target="_blank">MUI Radio API</a>',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: '<div>We use MUI Radio component with our theme</div>',
      },
    },
    controls: {
      hideNoControlsWarning: true,
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9699%3A1638',
  },
};
