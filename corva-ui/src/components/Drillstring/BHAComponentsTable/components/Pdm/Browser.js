import { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';

import { StaticField } from '../shared';
import { useStyles } from '../sharedStyles';
import PressureLoss from '../PressureLoss';
import { CONTAINER_XS } from '../constants';

function Pdm({ component, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
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
        <StaticField
          label="Revolution Per Gallon"
          unit="revolutionPerVolume"
          value={component.rpg}
          xs={xs}
        />
        <StaticField label="T.Weight" unit="mass" value={component.weight} xs={xs} />
        <StaticField label="# of stages" value={component.stages} xs={xs} />
        <StaticField
          label="# of rotor lobes"
          value={component.number_rotor_lobes}
          format="0.0"
          xs={xs}
        />
        <StaticField
          label="# of stator lobes"
          value={component.number_stator_lobes}
          format="0.0"
          xs={xs}
        />
        <StaticField label="Bend Range" value={component.bend_range} xs={xs} />
        <StaticField label="Max WOB" unit="force" value={component.max_weight_on_bit} xs={xs} />
        <StaticField label="Make" value={component.make} format={null} xs={xs} />
        <StaticField label="Model" value={component.model} format={null} xs={xs} />
        <StaticField label="Bit to Bend" unit="length" value={component.bit_to_bend} xs={xs} />

        <Grid item xs={CONTAINER_XS}>
          <span className={classes.additionalTitle}>Standard Flow Range</span>
        </Grid>

        <StaticField
          label="Min"
          unit="volumeFlowRate"
          value={component.min_standard_flowrate}
          xs={xs}
        />
        <StaticField
          label="Max"
          unit="volumeFlowRate"
          value={component.max_standard_flowrate}
          xs={xs}
        />
        <StaticField
          label="Max Operating Diff Pressure"
          unit="pressure"
          value={component.max_operating_differential_pressure}
          xs={xs}
        />
        <StaticField
          label="Torque at Max Operating Diff Pressure"
          unit="torque"
          value={component.torque_at_max_operating_differential_pressure}
          xs={xs}
        />
        <StaticField
          label="% Leakage Flow Loss"
          value={component.flow_loss_percentage}
          format="0.0"
          xs={xs}
        />
      </Grid>

      <PressureLoss
        isEditing={false}
        title="Off Bottom Pressure Loss"
        data={component.off_bottom_pressure_loss || []}
      />
    </>
  );
}

Pdm.propTypes = {
  component: PropTypes.shape({
    family: PropTypes.string,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    length: PropTypes.number,
    name: PropTypes.string,
    weight: PropTypes.number,
    off_bottom_pressure_loss: PropTypes.arrayOf(PropTypes.shape({})),
    rpg: PropTypes.number,
    stages: PropTypes.number,
    number_rotor_lobes: PropTypes.number,
    number_stator_lobes: PropTypes.number,
    bend_range: PropTypes.number,
    max_weight_on_bit: PropTypes.number,
    model: PropTypes.string,
    bit_to_bend: PropTypes.number,
    min_standard_flowrate: PropTypes.number,
    max_standard_flowrate: PropTypes.number,
    max_operating_differential_pressure: PropTypes.number,
    torque_at_max_operating_differential_pressure: PropTypes.number,
    flow_loss_percentage: PropTypes.number,
    make: PropTypes.string,
  }).isRequired,
  columns: PropTypes.number.isRequired,
};

export default memo(Pdm);
