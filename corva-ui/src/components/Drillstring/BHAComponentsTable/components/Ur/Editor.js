import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';
import { COMPONENT_MATERIALS } from '~/constants/drillstring';
import { UR_ACTIVATION_LOGIC_TYPES, UR_ACTIVATION_LOGIC_KEYS, CONTAINER_XS } from '../constants';

import { useStyles } from '../sharedStyles';
import { InputText, SelectField, CancelButton, SaveButton, SharedEditorElements } from '../shared';

function UnderReamer({ component, error, onChange, onCancel, onSave, columns }) {
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

          <Grid item xs={CONTAINER_XS}>
            <span className={classes.additionalTitle}>Under Reamer Configuration</span>
          </Grid>

          <InputText
            type="ur_opened_od"
            label="Max OD (Opened)"
            unit="shortLength"
            value={component.ur_opened_od}
            error={getError('ur_opened_od')}
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
            type="ur_to_bit"
            label="Reamer to Bit Distance"
            unit="length"
            value={component.ur_to_bit}
            error={getError('ur_to_bit')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="flow_rate"
            label="Flow Rate"
            unit="volumeFlowRate"
            value={component.flow_rate}
            error={getError('flow_rate')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="tfa"
            label="TFA"
            value={component.tfa}
            error={getError('tfa')}
            xs={xs}
            onChangeField={onChange}
          />
          <SelectField
            type="activation_logic"
            options={UR_ACTIVATION_LOGIC_TYPES}
            label="Activation Logic"
            value={component.activation_logic}
            error={getError('activation_logic')}
            xs={xs}
            onChangeField={onChange}
          />
          {component.activation_logic === UR_ACTIVATION_LOGIC_KEYS.DEPTH_ACTIVATION && (
            <InputText
              type="ur_opened_depth"
              label="Activation Depth"
              unit="length"
              value={component.ur_opened_depth}
              error={getError('ur_opened_depth')}
              xs={xs}
              onChangeField={(type, value) => onChange(type, +value)}
            />
          )}
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

UnderReamer.propTypes = {
  component: PropTypes.shape({
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
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

UnderReamer.defaultProps = {
  error: null,
};

export default memo(UnderReamer);
