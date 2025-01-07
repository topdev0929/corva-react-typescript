/* eslint-disable react/prop-types */
import { useState } from 'react';
import { MenuItem, makeStyles, InputAdornment } from '@material-ui/core';
import { Dashboard as DashboardIcon } from '@material-ui/icons';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import SelectComponent from '~/components/Select';

const useStyles = makeStyles({
  container: {
    height: 100,
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#1D1D1D',
  },
});

export const Select = props => {
  const styles = useStyles();

  const [value, setValue] = useState(null);

  return (
    <>
      <div className={styles.container}>
        <SelectComponent
          label="Age"
          value={value}
          style={{ width: props.width }}
          onChange={event => setValue(event.target.value)}
          formHelperText={props.formHelperText}
          FormControlProps={{
            variant: props.variant,
          }}
          disabled={props.disabled}
          error={props.error}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </SelectComponent>
      </div>

      <div className={styles.container}>
        <div>Small variant for tables:</div>

        <SelectComponent
          value={value}
          style={{ width: props.width }}
          onChange={event => setValue(event.target.value)}
          disabled={props.disabled}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </SelectComponent>
      </div>
    </>
  );
};

export const SelectWithIcon = props => {
  const styles = useStyles();

  const [value, setValue] = useState(null);

  return (
    <div className={styles.container}>
      <SelectComponent
        label="Age"
        value={value}
        style={{ width: props.width }}
        onChange={event => setValue(event.target.value)}
        FormControlProps={{ variant: 'standard' }}
        disabled={props.disabled}
        error={props.error}
        startAdornment={
          <InputAdornment position="start">
            <DashboardIcon />
          </InputAdornment>
        }
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </SelectComponent>
    </div>
  );
};

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['standard', 'outlined', 'filled'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    formHelperText: {
      defaultValue: 'Some important text',
      control: 'text',
    },
    width: {
      control: 'number',
    },
  },
  args: {
    variant: 'standard',
    disabled: false,
    error: false,
    formHelperText: 'Some important text',
    width: 120,
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Select/index.js',
  },
};
