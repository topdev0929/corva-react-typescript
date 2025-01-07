import { Select as MuiSelect, MenuItem, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles(({ palette }) => ({
  selectContainer: {
    color: palette.primary.contrastText,
    background: 'transparen !important',
    '& .MuiSelect-icon': {
      fill: palette.primary.text6,
    },
    '&:hover': {
      '& .MuiSelect-icon': {
        fill: palette.primary.contrastText,
      },
    },
    '&:active': {
      '& .MuiSelect-icon': {
        fill: palette.primary.main,
      },
    },
  },
  selectRoot: {
    fontSize: 16,
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  unit: {
    fontSize: 12,
    lineHeight: 0,
    color: palette.primary.text7,
  },
}));

const AxisDropdown = ({ className, classes, value, onChange, unit, options, ...otherProps }) => {
  const styles = useStyles();

  return (
    <MuiSelect
      className={classNames(styles.selectContainer, className)}
      value={value}
      classes={{ root: styles.selectRoot, ...classes }}
      onChange={onChange}
      disableUnderline
      renderValue={value => {
        return (
          <>
            {value}
            {unit && <span className={styles.unit}>({unit})</span>}
          </>
        );
      }}
      {...otherProps}
    >
      {options?.map(({ label, value }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default AxisDropdown;
