import PropTypes from 'prop-types';
import {
  Grid,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Tooltip,
} from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay } from '~/utils';
import { useStyles } from '../sharedStyles';

export function SelectField({
  type,
  options,
  label,
  unit,
  value,
  error,
  disabled,
  onChangeField,
  xs,
  className,
}) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const helperText = error || ' ';
  const hasError = !!error;
  const labelWithUnit = unit ? `${label} (${getUnitDisplay(unit)})` : label;

  return (
    <Grid
      item
      xs={xs}
      className={{ [classes.cellInnerMobile]: isMobileDetected }}
      classes={{ 'grid-xs-2': className }}
    >
      <FormControl fullWidth error={hasError} disabled={disabled}>
        {label && (
          <Tooltip title={labelWithUnit}>
            <InputLabel className={classes.inputLabel}>{labelWithUnit}</InputLabel>
          </Tooltip>
        )}
        <Select
          value={value || ''}
          onChange={e => {
            onChangeField(type, e.target.value);
          }}
        >
          {options.map(({ name, type }) => (
            <MenuItem key={type} value={type}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <Tooltip title={error || ''}>
            <FormHelperText className={classes.inputLabel}>{helperText}</FormHelperText>
          </Tooltip>
        )}
      </FormControl>
    </Grid>
  );
}

SelectField.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any.isRequired,
  error: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChangeField: PropTypes.func.isRequired,
  xs: PropTypes.number.isRequired,
  className: PropTypes.string,
};

SelectField.defaultProps = {
  unit: null,
  disabled: false,
  className: null,
};
