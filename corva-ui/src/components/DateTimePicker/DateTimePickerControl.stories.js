import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import DateTimePicker from '~/components/DateTimePicker';

export const DateTimePickerControl = ({ label, className, format }) => {
  const [dateTime, setDateTime] = useState();

  const handleDateTimeChange = newDateTime => {
    setDateTime(newDateTime);
  };

  return (
    <>
      <h4>
        This component was created as styled MUI Date Picker (v3.2.10). You can use MUI conponent
        properties. For more information, please, follow the oficial{' '}
        <a href="https://material-ui-pickers.dev/">documentation</a>.
      </h4>
      <div>
        <h3>Date Time Picker</h3>
        <DateTimePicker
          label={label}
          value={dateTime}
          onChange={handleDateTimeChange}
          className={className}
          format={format}
          placeholder={moment().format(format)}
        />
      </div>
    </>
  );
};

DateTimePickerControl.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  format: PropTypes.oneOf(['MMM DD, hh:mm a', 'MM/DD/YY, hh:mm a']),
};

DateTimePickerControl.defaultProps = {
  label: 'From',
  className: 'some-class-name',
  format: 'MMM DD, hh:mm a',
};

export default {
  title: 'Components/Pickers',
  component: DateTimePickerControl,
  parameters: {
    docs: {
      description: {
        component:
          '<div>This component was created as styled MUI Date Picker (v3.2.10). You can use MUI conponent properties. For more information, please, follow the oficial <a href="https://material-ui-pickers.dev/">documentation</a>.</div>',
      },
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DateTimePicker/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=10221%3A54',
  },
};
