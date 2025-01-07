import { useState } from 'react';
import PropTypes from 'prop-types';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const MaterialSelectFilled = props => {
  const [age, setAge] = useState('');

  const handleChange = event => {
    setAge(event.target.value);
  };

  return (
    <FormControl variant="filled">
      <InputLabel htmlFor="filled-age-simple">Age</InputLabel>
      <Select
        {...props}
        style={{ width: props.width }}
        value={age}
        onChange={handleChange}
        inputProps={{
          name: 'age',
          id: 'filled-age-simple',
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

MaterialSelectFilled.propTypes = {
  width: PropTypes.string,
  error: PropTypes.bool,
};

MaterialSelectFilled.defaultProps = {
  width: '120px',
  error: false,
};

export default {
  title: 'Components/Material Select',
  component: MaterialSelectFilled,
  parameters: {
    docs: {
      description: {
        component:
          '<div>Use MUI Select. More information <a href="https://material-ui.com/components/selects/">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9573%3A7954',
  },
};
