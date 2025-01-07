import { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';

import { StaticField } from '~/components/Drillstring/BHAComponentsTable/components/shared';
import { useStyles } from '~/components/Drillstring/BHAComponentsTable/components/sharedStyles';
import { CONTAINER_XS } from '../constants';

function CasingJoints({ component, columns }) {
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
          value={component.component_length}
          format="0.0"
          xs={xs}
        />
        <StaticField label="T.Weight" unit="mass" value={component.weight} xs={xs} />
        <StaticField
          label="Inside Mud Density"
          unit="density"
          value={component.inside_mud_density}
          format="0.0"
          xs={xs}
        />
        <StaticField label="Grade" value={component.grade} format={null} xs={xs} />
        <StaticField
          label="Connection Type"
          value={component.connection_type}
          format={null}
          xs={xs}
        />
      </Grid>
    </>
  );
}

CasingJoints.propTypes = {
  component: PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
    component_length: PropTypes.number,
    number_of_joints: PropTypes.number,
    connection_type: PropTypes.string,
    inside_mud_density: PropTypes.number,
    grade: PropTypes.string,
  }).isRequired,
  columns: PropTypes.number.isRequired,
};

export default memo(CasingJoints);
