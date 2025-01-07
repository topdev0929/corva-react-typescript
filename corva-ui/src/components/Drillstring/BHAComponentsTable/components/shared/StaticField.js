import PropTypes from 'prop-types';
import { Grid, Tooltip } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay } from '~/utils';
import { FormatedNumber } from './FormatedNumber';
import { useStyles } from '../sharedStyles';
import { CONTAINER_XS } from '../constants';

export function StaticField({ label, unit, value, format, placeholder, xs }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const labelWithUnit = unit ? `${label} (${getUnitDisplay(unit)})` : label;
  const xsValue = isMobileDetected ? CONTAINER_XS : xs;

  return (
    <Grid item xs={xsValue} className={{ [classes.cellInnerMobile]: isMobileDetected }}>
      <Tooltip title={labelWithUnit}>
        <div className={classes.cellLabel}>{labelWithUnit}</div>
      </Tooltip>
      <div className={classes.cellValue}>
        {format ? (
          <FormatedNumber value={value} format={format} placeholder={placeholder} />
        ) : (
          value || placeholder
        )}
      </div>
    </Grid>
  );
}

StaticField.propTypes = {
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  format: PropTypes.string,
  placeholder: PropTypes.string,
  xs: PropTypes.number.isRequired,
};

StaticField.defaultProps = {
  unit: null,
  value: null,
  format: '0.00',
  placeholder: '—',
};
