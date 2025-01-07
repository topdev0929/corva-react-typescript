import { useState } from 'react';
import { makeStyles, MenuItem } from '@material-ui/core';
import { SelectFilterBy as SelectFilterByComponent } from '../SelectFilterBy';

const useStyles = makeStyles(theme => ({
  container: {
    height: 100,
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#1D1D1D',
  },
  emptySelected: { color: theme.palette.primary.text6 },
  select: { width: ({ width }) => width }
}));

export const SelectFilterBy = props => {
  const classes = useStyles({ width: props.width });

  const [value, setValue] = useState('');

  return (
    <div className={classes.container}>
      <SelectFilterByComponent
        className={classes.select}
        disabled={props.disabled}
        error={props.error}
        label="Filter by Metric Type"
        onChange={event => setValue(event.target.value)}
        value={value}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </SelectFilterByComponent>
    </div>
  );
};

SelectFilterBy.storyName = 'Select Filter By';

export default {
  title: 'Components/Select',
  component: SelectFilterBy,
  argTypes: {
    disabled: {
      control: {
        defaultValue: false,
        type: 'boolean',
      },
    },
    error: {
      control: {
        defaultValue: false,
        type: 'boolean',
      },
    },
    width: {
      defaultValue: 200,
      control: {
        type: 'number',
      },
    },
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Select/SelectFilterBy.js',
  },
};
