/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox as CheckboxComponent,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import classNames from 'classnames';

const StyledFormControl = withStyles({
  root: ({ direction }) => ({
    ...(direction === 'horizontal' ? { display: 'flex', flexDirection: 'row' } : {}),
  }),
})(FormControl);
const useStyles = makeStyles({
  small: {
    height: 20,
    '& .MuiFormControlLabel-label': {
      marginLeft: '-1px',
      marginRight: 1,
      fontSize: '14px !important',
    },
  },
  medium: {
    height: 24,
    '& .MuiFormControlLabel-label': {
      marginLeft: 3,
    },
  },
  small_normal: {
    marginBottom: 16,
  },
  small_dense: {
    marginBottom: 8,
  },
  medium_normal: {
    marginBottom: 24,
  },
  medium_dense: {
    marginBottom: 16,
  },
  small_horizontal: {
    marginRight: 16,
  },
  medium_horizontal: {
    marginRight: 24,
  },
});

const options = Array.from({ length: 5 }, (_, idx) => `Label ${idx}`);
const initialState = options.reduce((obj, label) => ({ ...obj, [label]: false }), {});

export const Checkbox = props => {
  const { size, spacing, direction } = props;
  const styles = useStyles();

  const formControlLableClassnames = classNames(
    styles[size],
    styles[`${size}_${spacing}`],
    styles[`${size}_${direction}`]
  );

  return (
    <StyledFormControl direction={props.direction}>
      {options.map(label => (
        <FormControlLabel
          className={formControlLableClassnames}
          size={props.size}
          spacing={props.spacing}
          direction={props.direction}
          key={label}
          control={
            <CheckboxComponent
              size={props.size}
              disabled={props.disabled}
              indeterminate={props.indeterminate}
            />
          }
          label={label}
        />
      ))}
    </StyledFormControl>
  );
};

export const WithParentCheckbox = props => {
  const [checked, setChecked] = useState(initialState);
  const { size, spacing } = props;
  const styles = useStyles();

  const formControlLabelClassnames = classNames(styles[size], styles[`${size}_${spacing}`]);

  const formControlLabelProps = {
    className: formControlLabelClassnames,
    size: props.size,
    spacing: props.spacing,
  };

  const checkedList = Object.keys(checked);
  const checkboxListChecked = checkedList.every(key => checked[key]);
  const indeterminate = checkedList.some(key => checked[key]) && !checkboxListChecked;

  return (
    <StyledFormControl>
      <FormControlLabel
        {...formControlLabelProps}
        label="Parent checkbox"
        control={
          <CheckboxComponent
            onChange={() => {
              setChecked(
                options.reduce((obj, label) => ({ ...obj, [label]: !checkboxListChecked }), {})
              );
            }}
            checked={checkboxListChecked}
            indeterminate={indeterminate}
            size={props.size}
            disabled={props.disabled}
          />
        }
      />
      {options.map(label => {
        return (
          <FormControlLabel
            {...formControlLabelProps}
            style={{ paddingLeft: '20px' }}
            key={label}
            label={label}
            control={
              <CheckboxComponent
                onChange={() => setChecked({ ...checked, [label]: !checked[label] })}
                checked={checked[label]}
                size={props.size}
                disabled={props.disabled}
              />
            }
          />
        );
      })}
    </StyledFormControl>
  );
};

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    spacing: {
      control: 'inline-radio',
      options: ['normal', 'dense'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'normal' },
      },
    },
    direction: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'vertical' },
      },
    },
    indeterminate: {
      type: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
  },
  args: {
    disabled: false,
    direction: 'vertical',
    indeterminate: false,
    spacing: 'normal',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        component:
          '<div>We use styled MUI checkbox components. See details in the story code block and <a href="https://v4.mui.com/components/checkboxes/#checkbox">MUI documentation</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19105%3A59492',
  },
};
