import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';

import { KeyboardDateTimePicker, KeyboardDateTimePickerProps } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core';
import { Event as EventIcon } from '@material-ui/icons';
import { DATE_TIME_FORMAT } from '../../constants/dateTimeFormat';

const useStyles = makeStyles(theme => ({
  dateTimePickerInput: {
    width: '100%',
    paddingBottom: 8,
    '& .MuiFormLabel-root.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiInput-root.Mui-focused  .MuiIconButton-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiIconButton-root': {
      marginRight: -7,
      padding: 7,
    },
    '& .MuiSvgIcon-root': {
      fill: `${theme.palette.primary.text6} !important`,
    }
  },
  paper: {
    marginTop: 8,
  },
}));

function DateTimePicker({ className, PopoverProps, format, ...otherProps }: KeyboardDateTimePickerProps): JSX.Element {
  const styles = useStyles();

  return (
    <KeyboardDateTimePicker
      dateRangeIcon={<EventIcon />}
      keyboardIcon={<EventIcon />}
      format={format}
      refuse={/[^(\w|\d)]+/gi}
      placeholder={moment().format(format)}
      {...otherProps}
      PopoverProps={{ className: styles.paper, ...PopoverProps }}
      className={classNames(styles.dateTimePickerInput, className)}
    />
  );
}

DateTimePicker.propTypes = {
  className: PropTypes.string,
  PopoverProps: PropTypes.shape({
    className: PropTypes.string,
  }),
  format: PropTypes.string,
};

DateTimePicker.defaultProps = {
  className: '',
  PopoverProps: {},
  format: DATE_TIME_FORMAT,
};

export default DateTimePicker;
