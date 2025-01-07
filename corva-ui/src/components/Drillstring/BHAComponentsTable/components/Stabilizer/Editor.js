import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';
import { COMPONENT_MATERIALS } from '~/constants/drillstring';

import { useStyles } from '../sharedStyles';
import { InputText, SelectField, CancelButton, SaveButton, SharedEditorElements } from '../shared';
import { CONTAINER_XS } from '../constants';

function Stabilizer({ component, error, onChange, onCancel, onSave, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const xs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / columns;

  const getError = key => error && error[key];

  return (
    <Grid container spacing={0} className={classes.editorContainer}>
      {!isMobileDetected && (
        <Grid item className={classes.editorComponentSize}>
          <ComponentIcon component={component} />
        </Grid>
      )}
      <Grid item className={classes.eidtorContentContainer}>
        <Grid container spacing={2}>
          <SharedEditorElements component={component} getError={getError} onChange={onChange} />

          <InputText
            type="name"
            label="Name"
            value={component.name}
            error={getError('name')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="weight"
            label="T.Weight"
            unit="mass"
            value={component.weight}
            error={getError('weight')}
            disabled
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="gauge_od"
            label="Gauge OD"
            unit="shortLength"
            value={component.gauge_od}
            error={getError('gauge_od')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="gauge_length"
            label="Gauge Length"
            unit="shortLength"
            value={component.gauge_length}
            error={getError('gauge_length')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="no_of_blades"
            label="# of Blades"
            value={component.no_of_blades}
            error={getError('no_of_blades')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="blade_width"
            label="Blade Width"
            unit="shortLength"
            value={component.blade_width}
            error={getError('blade_width')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="connection_type"
            label="Connection Type"
            value={component.connection_type}
            error={getError('connection_type')}
            xs={xs}
            onChangeField={onChange}
          />
          <SelectField
            type="material"
            options={COMPONENT_MATERIALS}
            label="Material"
            value={component.material}
            error={getError('material')}
            xs={xs}
            onChangeField={onChange}
          />
        </Grid>
      </Grid>
      {!isMobileDetected && (
        <Grid item className={classes.eidtorActionGroup}>
          <CancelButton handleCancel={onCancel} />
          <SaveButton handleSave={onSave} disabled={!isEmpty(error)} />
        </Grid>
      )}
    </Grid>
  );
}

Stabilizer.propTypes = {
  component: PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
    connection_type: PropTypes.string,
    material: PropTypes.string,
    gauge_od: PropTypes.number,
    gauge_length: PropTypes.number,
    blade_width: PropTypes.number,
    no_of_blades: PropTypes.number,
  }).isRequired,
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

Stabilizer.defaultProps = {
  error: null,
};

export default memo(Stabilizer);
