import { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';

import { StaticField } from '../shared';
import { useStyles } from '../sharedStyles';
import NozzleSize from '../NozzleSize';
import { CONTAINER_XS } from '../constants';

function Bit({ component, columns }) {
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
        <StaticField label="Bit Type" value={component.bit_type} format={null} xs={xs} />
        <StaticField label="T.Weight" unit="mass" value={component.weight} xs={xs} />
        <StaticField label="TFA" value={component.tfa} xs={xs} />
      </Grid>

      <NozzleSize isEditing={false} data={component.nozzle_sizes} />
    </>
  );
}

Bit.propTypes = {
  component: PropTypes.shape({
    family: PropTypes.string,
    bit_type: PropTypes.string,
    size: PropTypes.number,
    length: PropTypes.number,
    name: PropTypes.string,
    weight: PropTypes.number,
    tfa: PropTypes.number,
    nozzle_sizes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  columns: PropTypes.number.isRequired,
};

export default memo(Bit);
