import classNames from 'classnames';
import PropTypes from 'prop-types';

import { KeyboardDatePicker, KeyboardDatePickerProps } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core';
import { Event as EventIcon } from '@material-ui/icons';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants/dateTimeFormat';

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

interface DatePickerProps extends KeyboardDatePickerProps {
  className: string;
}

const DatePicker = ({ className, PopoverProps, ...otherProps }: DatePickerProps): JSX.Element => {
  const styles = useStyles();

  return (
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      keyboardIcon={<EventIcon />}
      format={DATE_FORMAT}
      placeholder={moment().format(DATE_FORMAT)}
      refuse={/[^(\w|\d)]+/gi}
      {...otherProps}
      PopoverProps={{
        className: classNames(styles.paper, PopoverProps.className),
        ...PopoverProps,
      }}
      className={classNames(styles.dateTimePickerInput, className)}
    />
  );
}

DatePicker.propTypes = {
  PopoverProps: PropTypes.shape({
    className: PropTypes.string,
  }),
  className: PropTypes.string,
};

DatePicker.defaultProps = {
  PopoverProps: {},
  className: '',
};

export default DatePicker;
