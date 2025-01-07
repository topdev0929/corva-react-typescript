import { useState } from 'react';
import PropTypes from 'prop-types';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const MaterialSelectOutlined = props => {
  const [age, setAge] = useState('');

  const handleChange = event => {
    setAge(event.target.value);
  };

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
      <Select
        {...props}
        style={{ width: props.width }}
        value={age}
        onChange={handleChange}
        label="Age"
        inputProps={{
          name: 'age',
          id: 'outlined-age-native-simple',
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

MaterialSelectOutlined.propTypes = {
  width: PropTypes.string,
  error: PropTypes.bool,
};

MaterialSelectOutlined.defaultProps = {
  width: '120px',
  error: false,
};

export default {
  title: 'Components/Material Select',
  component: MaterialSelectOutlined,
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
