import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import DatePicker from '~/components/DatePicker';

export const DatePickerControl = ({ label, className, format }) => {
  const [date, setDate] = useState();

  const handleDateChange = newDate => {
    setDate(newDate);
  };

  return (
    <>
      <h4>
        This component was created as styled MUI Date Picker (v3.2.10). You can use MUI conponent
        properties. For more information, please, follow the oficial{' '}
        <a href="https://material-ui-pickers.dev/">documentation</a>.
      </h4>
      <div>
        <h3>Date Picker</h3>
        <DatePicker
          label={label}
          value={date}
          onChange={handleDateChange}
          className={className}
          format={format}
          placeholder={moment().format(format)}
        />
      </div>
    </>
  );
};

DatePickerControl.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  format: PropTypes.oneOf(['MMM DD', 'MM/DD/YY']),
};

DatePickerControl.defaultProps = {
  label: 'From',
  className: 'some-class-name',
  format: 'MMM DD',
};

export default {
  title: 'Components/Pickers',
  component: DatePickerControl,
  parameters: {
    docs: {
      description: {
        component:
          '<div>This component was created as styled MUI Date Picker (v3.2.10). You can use MUI conponent properties. For more information, please, follow the oficial <a href="https://material-ui-pickers.dev/">documentation</a>.</div>',
      },
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DatePicker/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=10221%3A54',
  },
};
