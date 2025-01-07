/* eslint-disable react/prop-types */

import { InputAdornment, TextField } from '@material-ui/core';

export const InputText = props => {
  return (
    <>
      <TextField
        label="Empty Textfield"
        style={{ width: 200 }}
        type="text"
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="Start Adornment"
        style={{ width: 200 }}
        type="text"
        InputProps={{ startAdornment: <InputAdornment position="start">Kg</InputAdornment> }}
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="End Adornment"
        style={{ width: 200 }}
        type="text"
        InputProps={{ endAdornment: <InputAdornment position="end">Kg</InputAdornment> }}
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="Dense"
        style={{ width: 200 }}
        type="text"
        margin="dense"
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="With default value"
        defaultValue="default value"
        style={{ width: 200 }}
        type="text"
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        disabled
        label="Disabled"
        style={{ width: 200 }}
        type="text"
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        error
        helperText="Error text"
        label="With Error and helper text"
        style={{ width: 200 }}
        type="text"
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="With Placeholder"
        placeholder="Placeholder"
        style={{ width: 200 }}
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        error
        helperText="Error text"
        label="Error with adornment"
        style={{ width: 200 }}
        type="text"
        InputProps={{ endAdornment: <InputAdornment position="end">Kg</InputAdornment> }}
        {...props.muiTextFieldProps}
      />

      <br />
      <br />
      <TextField
        label="Dense with adornment"
        style={{ width: 200 }}
        type="text"
        margin="dense"
        InputProps={{ endAdornment: <InputAdornment position="end">Kg</InputAdornment> }}
        {...props.muiTextFieldProps}
      />
    </>
  );
};

export default {
  title: 'Components/TextField',
  component: InputText,
  parameters: {
    docs: {
      description: {
        component:
          '<div>Use MUI Inputs and TextFields. More information <a href="https://material-ui.com/api/input/">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9573%3A7777',
  },
  argTypes: {
    muiTextFieldProps: {
      name: '...muiTextFieldProps',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
};
