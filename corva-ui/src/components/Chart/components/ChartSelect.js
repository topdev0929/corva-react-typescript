import classNames from 'classnames';
import { Select as MuiSelect, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  selectContainer: {
    color: palette.primary.contrastText,
    width: 180,
    background: palette.background.b6,
    borderRadius: 4,
    height: 30,
    marginRight: 4,
    '& .MuiSelect-icon': {
      fill: palette.primary.text6,
    },
    '& .MuiSelect-iconOpen': {
      fill: palette.primary.main,
    },
    '&:hover': {
      background: palette.background.b7,
      '& .MuiSelect-icon': {
        fill: palette.primary.contrastText,
      },
    },
    '&:active': {
      background: palette.background.b7,
    },
  },
  selectRoot: {
    fontSize: 14,
    paddingLeft: 12,
    backgroundColor: 'transparent',
    '&:active': {
      backgroundColor: 'transparent',
    },
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  menuPaper: {
    marginTop: 4,
  },
}));

const ChartSelect = ({ className, classes, value, onChange, options, ...otherProps }) => {
  const styles = useStyles();

  return (
    <MuiSelect
      className={classNames(styles.selectContainer, className)}
      value={value}
      classes={{ root: styles.selectRoot, ...classes }}
      onChange={onChange}
      disableUnderline
      MenuProps={{
        classes: {
          paper: styles.menuPaper,
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
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

export default ChartSelect;
