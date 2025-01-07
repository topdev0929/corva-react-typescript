import { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';

import { StaticField } from '../shared';
import { useStyles } from '../sharedStyles';
import { CONTAINER_XS } from '../constants';

function DrillPipe({ component, columns }) {
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
        <StaticField label="# of Joints" value={component.number_of_joints} format="0" xs={xs} />
        <StaticField
          label="Component Length"
          unit="length"
          value={component.component_length}
          format="0.0"
          xs={xs}
        />
        <StaticField label="T.Weight" unit="mass" value={component.weight} xs={xs} />
        <StaticField label="Grade" value={component.grade} format={null} xs={xs} />
        <StaticField
          label="TJ OD"
          unit="shortLength"
          value={component.outer_diameter_tooljoint}
          xs={xs}
        />
        <StaticField
          label="TJ ID"
          unit="shortLength"
          value={component.inner_diameter_tooljoint}
          xs={xs}
        />
        <StaticField
          label="TJ Length Per Joint"
          unit="length"
          value={component.length_tooljoint}
          xs={xs}
        />
        <StaticField
          label="Connection Type"
          value={component.connection_type}
          format={null}
          xs={xs}
        />
        <StaticField label="Class" value={component.class} format={null} xs={xs} />
        <StaticField label="Material" value={component.material} format={null} xs={xs} />
      </Grid>
    </>
  );
}

DrillPipe.propTypes = {
  component: PropTypes.shape({
    family: PropTypes.string,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    component_length: PropTypes.number,
    length: PropTypes.number,
    name: PropTypes.string,
    number_of_joints: PropTypes.number,
    weight: PropTypes.number,
    connection_type: PropTypes.string,
    grade: PropTypes.string,
    class: PropTypes.string,
    material: PropTypes.string,
    outer_diameter_tooljoint: PropTypes.number,
    inner_diameter_tooljoint: PropTypes.number,
    length_tooljoint: PropTypes.number,
  }).isRequired,
  columns: PropTypes.number.isRequired,
};

export default memo(DrillPipe);
