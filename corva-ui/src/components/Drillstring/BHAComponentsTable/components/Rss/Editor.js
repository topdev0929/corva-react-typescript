import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';
import { COMPONENT_MATERIALS } from '~/constants/drillstring';

import { useStyles } from '../sharedStyles';
import { InputText, SelectField, CancelButton, SaveButton, SharedEditorElements } from '../shared';
import PressureLoss from '../PressureLoss';
import { CONTAINER_XS } from '../constants';

function Rss({ component, error, onChange, onCancel, onSave, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const xs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / columns;

  const getError = key => error && error[key];

  const handleChangePressureLoss = newPressureLoss => {
    onChange('pressure_loss', newPressureLoss);
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
          <InputText
            type="flow_loss_percentage"
            label="% Actuator Flow Loss"
            value={component.flow_loss_percentage}
            error={getError('flow_loss_percentage')}
            xs={xs}
            onChangeField={onChange}
          />

          <PressureLoss
            isEditing
            data={component.pressure_loss}
            errors={getError('pressure_loss')}
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

Rss.propTypes = {
  component: PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
    connection_type: PropTypes.string,
    material: PropTypes.string,
    pressure_loss: PropTypes.arrayOf(PropTypes.shape({})),
    flow_loss_percentage: PropTypes.number,
  }).isRequired,
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

Rss.defaultProps = {
  error: null,
};

export default memo(Rss);
