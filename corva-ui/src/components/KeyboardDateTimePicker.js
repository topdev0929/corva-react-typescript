import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { KeyboardDateTimePicker as MuiKeyboardDateTimePicker } from '@material-ui/pickers';

const DEFAULT_DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm';
const SUPPORTED_FORMATS = [
  'MM/DD/YYYY HH:mm',
  'M/D/YYYY HH:mm',
  'MM/DD/YYYY, HH:mm',
  'M/D/YYYY, HH:mm',
  'MMM DD, YYYY HH:mm',
  'MMM D, YYYY HH:mm',
  'MM/DD/YY HH:mm',
  'M/D/YY HH:mm'
];
const REFUSE_REGEXP = new RegExp('[^\\.\\ \\,\\[a-zA-Z0-9_]*$]+', 'gi');

const KeyboardDateTimePicker = props => {
  const { format, onChange, label, 'data-testid': PAGE_NAME } = props;

  const [dynamicFormat, setDynamicFormat] = useState(format);
  const [inputValue, setInputValue] = useState(null);

  const dateFormatter = str => {
    return str;
  };

  const handleDateChange = (date, newInputValue) => {
    const momentObj = moment(newInputValue, [...SUPPORTED_FORMATS, format], true);
    const isValidDate = momentObj.isValid();

    setDynamicFormat(prev => (isValidDate ? momentObj.creationData().format : prev));
    setInputValue(newInputValue);
    onChange(isValidDate ? momentObj : date, newInputValue);
  };

  return (
    <MuiKeyboardDateTimePicker
      rifmFormatter={dateFormatter}
      refuse={REFUSE_REGEXP}
      inputValue={inputValue}
      {...props}
      data-testid={`${PAGE_NAME}_${label}`}
      format={dynamicFormat}
      onChange={handleDateChange}
    />
  );
};

KeyboardDateTimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string,
  label: PropTypes.string,
  'data-testid': PropTypes.string,
};

KeyboardDateTimePicker.defaultProps = {
  format: DEFAULT_DATE_TIME_FORMAT,
  label: 'Date',
  'data-testid': 'KeyboardDateTimePicker',
};

export default KeyboardDateTimePicker;
