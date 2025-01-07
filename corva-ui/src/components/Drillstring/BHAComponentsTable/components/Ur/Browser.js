import { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';

import { StaticField } from '../shared';
import { useStyles } from '../sharedStyles';
import { UR_ACTIVATION_LOGIC_KEYS, UR_ACTIVATION_LOGIC_TYPES, CONTAINER_XS } from '../constants';

function UnderReamer({ component, columns }) {
  const classes = useStyles();
  const xs = CONTAINER_XS / columns;

  return (
    <>
      <Grid
        container
        spacing={2}
        className={classNames(classes.detailedView, {
          [classes.detailedViewMobile]: isMobileDetected,
        })}
      >
        <StaticField label="Name" value={component.name} format={null} xs={xs} />
        <StaticField label="T.Weight" unit="mass" value={component.weight} xs={xs} />
        <StaticField
          label="Connection Type"
          value={component.connection_type}
          format={null}
          xs={xs}
        />
        <StaticField label="Material" value={component.material} format={null} xs={xs} />

        <Grid item xs={CONTAINER_XS}>
          <span className={classes.additionalTitle}>Under Reamer Configuration</span>
        </Grid>

        <StaticField
          label="Max OD (Opened)"
          unit="shortLength"
          value={component.ur_opened_od}
          xs={xs}
        />
        <StaticField
          label="Gauge Length"
          unit="shortLength"
          value={component.gauge_length}
          xs={xs}
        />
        <StaticField label="# of Blades" value={component.no_of_blades} xs={xs} />
        <StaticField label="Blade Width" unit="shortLength" value={component.blade_width} xs={xs} />
        <StaticField
          label="Reamer to Bit Distance"
          unit="length"
          value={component.ur_to_bit}
          xs={xs}
        />
        <StaticField label="Flow Rate" unit="volumeFlowRate" value={component.flow_rate} xs={xs} />
        <StaticField label="TFA" value={component.tfa} xs={xs} />
        <StaticField
          label="Activation Logic"
          value={
            UR_ACTIVATION_LOGIC_TYPES.find(item => item.type === component.activation_logic)?.name
          }
          format={null}
          xs={xs}
        />
        {component.activation_logic === UR_ACTIVATION_LOGIC_KEYS.DEPTH_ACTIVATION && (
          <StaticField
            label="Activation Depth"
            unit="length"
            value={component.ur_opened_depth}
            xs={xs}
          />
        )}
      </Grid>
    </>
  );
}

UnderReamer.propTypes = {
  component: PropTypes.shape({
    family: PropTypes.string,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    length: PropTypes.number,
    name: PropTypes.string,
    weight: PropTypes.number,
    connection_type: PropTypes.string,
    material: PropTypes.string,
    ur_opened_od: PropTypes.number,
    gauge_length: PropTypes.number,
    no_of_blades: PropTypes.number,
    blade_width: PropTypes.number,
    ur_to_bit: PropTypes.number,
    flow_rate: PropTypes.number,
    tfa: PropTypes.number,
    activation_logic: PropTypes.string,
    ur_opened_depth: PropTypes.number,
  }).isRequired,
  columns: PropTypes.number.isRequired,
};

export default memo(UnderReamer);
