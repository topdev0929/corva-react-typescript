import { FormControl, InputLabel, makeStyles, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
    height: height => height,
  },
  inputLabel: {
    color: theme.palette.primary.text6,
    fontSize: '14px',
    letterSpacing: '0.8px',
  },
  select: {
    background: theme.palette.background.b7,
    '&::before': {
      borderBottom: 'none !important',
    },
    '&::after': {
      borderBottom: 'none !important',
    },
  },
  selectedItem: {
    display: 'flex',
    alignItems: 'center',
  },
  iconOpen: {
    color: theme.palette.primary.main,
  },
  paper: {
    marginTop: height => height + 10,
  },
  disabled: {
    color: theme.palette.primary.text8,
  },
}));

const CustomSelect = ({ label, height, children, ...props }) => {
  const classes = useStyles(height);
  return (
    <FormControl variant="filled" className={classes.formControl} fullWidth>
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
      <Select
        className={classes.select}
        classes={{
          select: classes.selectedItem,
          iconOpen: classes.iconOpen,
          disabled: classes.disabled,
        }}
        {...props}
        MenuProps={{
          ...(props?.MenuProps || {}),
          classes: {
            ...(props?.MenuProps?.classes || {}),
            paper: classnames(classes.paper, props?.MenuProps?.classes?.paper),
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  children: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  height: PropTypes.number,
  MenuProps: PropTypes.shape(),
};

CustomSelect.defaultProps = {
  height: 56,
  MenuProps: {},
};

export default CustomSelect;
