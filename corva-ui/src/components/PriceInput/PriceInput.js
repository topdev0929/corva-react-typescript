import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';
import NumberFormatCustom from './FormattedNumber';

const PriceInput = props => {
  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        inputComponent: NumberFormatCustom,
      }}
    />
  );
};

PriceInput.propTypes = {
  InputProps: PropTypes.shape({}),
};

PriceInput.defaultProps = {
  InputProps: {},
};

export default PriceInput;
