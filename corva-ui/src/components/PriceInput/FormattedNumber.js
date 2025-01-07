import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
      allowNegative={false}
      allowLeadingZeros={false}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  decimalScale: PropTypes.number,
};

NumberFormatCustom.defaultProps = {
  decimalScale: 2,
};

export default NumberFormatCustom;
