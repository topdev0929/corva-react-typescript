import PropTypes from 'prop-types';
import { Grid, Input, FormControl, FormHelperText, InputLabel, Tooltip } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay } from '~/utils';
import { useStyles } from '../sharedStyles';

export function InputText({
  type,
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
  const formattedValue = value === 0 ? value : value || '';
  const inputTypeFormat =
    type === 'name' || type === 'connection_type' || type === 'model' ? 'text' : 'number';
  const labelWithUnit = unit ? `${label} (${getUnitDisplay(unit)})` : label;

  return (
    <Grid
      item
      xs={xs}
      className={{ [classes.cellInnerMobile]: isMobileDetected }}
      classes={{ 'grid-xs-2': className }}
    >
      <Tooltip title={labelWithUnit}>
        <FormControl fullWidth error={hasError} disabled={disabled}>
          <InputLabel className={classes.inputLabel}>{labelWithUnit}</InputLabel>
          <Input
            type={inputTypeFormat}
            value={formattedValue}
            onChange={e => {
              onChangeField(type, e.target.value);
            }}
          />
          {error && (
            <Tooltip title={error || ''}>
              <FormHelperText className={classes.inputLabel}>{helperText}</FormHelperText>
            </Tooltip>
          )}
        </FormControl>
      </Tooltip>
    </Grid>
  );
}

InputText.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  error: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChangeField: PropTypes.func.isRequired,
  xs: PropTypes.number.isRequired,
  className: PropTypes.string,
};

InputText.defaultProps = {
  unit: null,
  value: null,
  disabled: false,
  className: null,
};
