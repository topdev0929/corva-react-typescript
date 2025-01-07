import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';

import { KeyboardDateTimePicker } from '@corva/ui/components';

import { isValueInRange } from '../../../utils/time';

const useStyles = makeStyles(theme => ({
  datePickerContainer: { marginBottom: 16 },
  helperText: {
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '2px',
    color: theme.palette.error.main,
  },
}));

const CUSTOM_TIME_VALIDATION_ERRORS = {
  invalidFormat: 'Invalid Date Format',
  outOfRange: isPadMode => `Out of ${isPadMode ? 'Pad' : 'Well'} Activity`,
  invalidRange: 'Invalid range',
};

function CustomTimePicker(props) {
  const classes = useStyles();
  const { customTimeSetting, assetTimeLimits, isPadMode, onSettingChange } = props;
  const [customTimeValidationErrors, setCustomTimeValidationErrors] = useState({
    start: null,
    end: null,
  });
  const [timeSettings, setTimeSettings] = useState(customTimeSetting);

  useEffect(() => {
    if (assetTimeLimits.firstTimestamp && assetTimeLimits.lastTimestamp) {
      const errors = {
        start: getTimeValidationErrorMessage('start', timeSettings.start, assetTimeLimits),
        end: getTimeValidationErrorMessage('end', timeSettings.end, assetTimeLimits),
      };
      setCustomTimeValidationErrors(errors);
    }
  }, [timeSettings, assetTimeLimits]);

  const getTimeValidationErrorMessage = (key, value) => {
    if (value === null) return null;

    if (!moment.unix(value).isValid()) {
      return CUSTOM_TIME_VALIDATION_ERRORS.invalidFormat;
    }

    if (!isValueInRange(assetTimeLimits, value)) {
      return CUSTOM_TIME_VALIDATION_ERRORS.outOfRange(isPadMode);
    }

    const timeSettingCopy = { ...timeSettings, [key]: value };
    const { start, end } = timeSettingCopy;

    if (start && end && start >= end) {
      return CUSTOM_TIME_VALIDATION_ERRORS.invalidRange;
    }
    return null;
  };

  const handleCustomTimeChange = (key, value) => {
    const unixValue = value?.unix() ?? null;
    const timeSettingCopy = { ...timeSettings, [key]: unixValue };
    setTimeSettings(timeSettingCopy);

    if (value === null || moment.unix(value).isValid()) {
      onSettingChange('customTimeSetting', timeSettingCopy);
    }
  };

  return (
    <>
      <div className={classes.datePickerContainer}>
        <KeyboardDateTimePicker
          variant="inline"
          label="Start"
          value={timeSettings.start ? moment.unix(timeSettings.start) : null}
          onChange={value => handleCustomTimeChange('start', value)}
          error={!!customTimeValidationErrors.start}
          invalidDateMessage=""
          minDateMessage=""
          maxDateMessage=""
        />
        <FormHelperText className={classes.helperText}>
          {customTimeValidationErrors.start}
        </FormHelperText>
      </div>
      <div className={classes.datePickerContainer}>
        <KeyboardDateTimePicker
          variant="inline"
          label="End"
          value={timeSettings.end ? moment.unix(timeSettings.end) : null}
          onChange={value => handleCustomTimeChange('end', value)}
          error={!!customTimeValidationErrors.end}
          invalidDateMessage=""
          minDateMessage=""
          maxDateMessage=""
        />
        <FormHelperText className={classes.helperText}>
          {customTimeValidationErrors.end}
        </FormHelperText>
      </div>
    </>
  );
}

CustomTimePicker.propTypes = {
  customTimeSetting: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  assetTimeLimits: PropTypes.shape({
    firstTimestamp: PropTypes.number,
    lastTimestamp: PropTypes.number,
  }).isRequired,
  isPadMode: PropTypes.bool.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default CustomTimePicker;
