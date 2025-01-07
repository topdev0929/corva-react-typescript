import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';

import { useStyles } from '../sharedStyles';
import { InputText, CancelButton, SaveButton, SharedEditorElements } from '../shared';
import PressureLoss from '../PressureLoss';
import { CONTAINER_XS } from '../constants';

function Pdm({ component, error, onChange, onCancel, onSave, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const xs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / columns;

  const getError = key => error && error[key];

  const handleChangePressureLoss = newPressureLoss => {
    onChange('off_bottom_pressure_loss', newPressureLoss);
  };

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
            type="rpg"
            label="Revolution Per Gallon"
            unit="revolutionPerVolume"
            value={component.rpg}
            error={getError('rpg')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="stages"
            label="# of stages"
            value={component.stages}
            error={getError('stages')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="number_rotor_lobes"
            label="`# of rotor lobes"
            value={component.number_rotor_lobes}
            error={getError('number_rotor_lobes')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="number_stator_lobes"
            label="# of stator lobes"
            value={component.number_stator_lobes}
            error={getError('number_stator_lobes')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="bend_range"
            label="Bend Range"
            value={component.bend_range}
            error={getError('bend_range')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="max_weight_on_bit"
            label="Max WOB"
            unit="force"
            value={component.max_weight_on_bit}
            error={getError('max_weight_on_bit')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="model"
            label="Model"
            value={component.model}
            error={getError('model')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="bit_to_bend"
            label="Bit to Bend"
            unit="length"
            value={component.bit_to_bend}
            error={getError('bit_to_bend')}
            xs={xs}
            onChangeField={onChange}
          />

          <Grid item xs={CONTAINER_XS}>
            <span className={classes.additionalTitle}>Standard Flow Range</span>
          </Grid>

          <InputText
            type="min_standard_flowrate"
            label="Min"
            unit="volumeFlowRate"
            value={component.min_standard_flowrate}
            error={getError('min_standard_flowrate')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="max_standard_flowrate"
            label="Max"
            unit="volumeFlowRate"
            value={component.max_standard_flowrate}
            error={getError('max_standard_flowrate')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="max_operating_differential_pressure"
            label="Max Operating Diff Pressure"
            unit="pressure"
            value={component.max_operating_differential_pressure}
            error={getError('max_operating_differential_pressure')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="torque_at_max_operating_differential_pressure"
            label="Torque at Max Operating Diff Pressure"
            unit="torque"
            value={component.torque_at_max_operating_differential_pressure}
            error={getError('torque_at_max_operating_differential_pressure')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="flow_loss_percentage"
            label="'% Leakage Flow Loss"
            value={component.flow_loss_percentage}
            error={getError('flow_loss_percentage')}
            xs={xs}
            onChangeField={onChange}
          />
          <PressureLoss
            isEditing
            title="Off Bottom Pressure Loss"
            data={component.off_bottom_pressure_loss}
            errors={getError('off_bottom_pressure_loss')}
            onChange={handleChangePressureLoss}
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

Pdm.propTypes = {
  component: PropTypes.shape({
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
  }).isRequired,
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

Pdm.defaultProps = {
  error: null,
};

export default memo(Pdm);
