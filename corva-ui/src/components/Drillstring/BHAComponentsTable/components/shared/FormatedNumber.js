import PropTypes from 'prop-types';

export function FormatedNumber({ value, format, placeholder }) {
  const parsedValue = parseFloat(value);
  if (Number.isFinite(parsedValue)) {
    return <span>{parsedValue.formatNumeral(format)}</span>;
  }

  return <span>{placeholder}</span>;
}

FormatedNumber.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  format: PropTypes.string,
  placeholder: PropTypes.string,
};

FormatedNumber.defaultProps = {
  value: null,
  format: '0.00',
  placeholder: '—',
};
