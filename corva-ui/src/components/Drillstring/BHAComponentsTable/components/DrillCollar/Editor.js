import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';
import { DC_SUB_CATEGORIES, COMPONENT_MATERIALS } from '~/constants/drillstring';

import { InputText, SelectField, CancelButton, SaveButton, SharedEditorElements } from '../shared';
import { useStyles } from '../sharedStyles';
import { CONTAINER_XS } from '../constants';

function DrillCollar({ component, error, onChange, onCancel, onSave, columns }) {
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
          <SelectField
            type="sub_category"
            options={DC_SUB_CATEGORIES}
            label="Sub Category"
            value={component.sub_category}
            error={getError('sub_category')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="number_of_joints"
            label="# of Joints"
            value={component.number_of_joints}
            error={getError('number_of_joints')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="component_length"
            label="Component Length"
            unit="length"
            value={component.component_length}
            error={getError('component_length')}
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

DrillCollar.propTypes = {
  component: PropTypes.shape({
    sub_category: PropTypes.string,
    component_length: PropTypes.number,
    name: PropTypes.string,
    number_of_joints: PropTypes.number,
    weight: PropTypes.number,
    connection_type: PropTypes.string,
    material: PropTypes.string,
  }).isRequired,
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

DrillCollar.defaultProps = {
  error: null,
};

export default memo(DrillCollar);
