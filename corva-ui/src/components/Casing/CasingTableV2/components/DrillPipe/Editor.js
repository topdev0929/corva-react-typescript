import { memo, useMemo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { CasingComponentIcon as ComponentIcon } from '~/components';
import {
  COMPONENT_GRADES,
  COMPONENT_CLASSES,
  COMPONENT_MATERIALS,
  OD_ID_DEP_LIST,
} from '~/constants/casing';

import {
  InputText,
  SelectField,
  CancelButton,
  SaveButton,
  SharedEditorElements,
} from '~/components/Drillstring/BHAComponentsTable/components/shared';
import { Suggestions } from '~/components/Drillstring/BHAComponentsTable/components/Suggestions';
import { useStyles } from '~/components/Drillstring/BHAComponentsTable/components/sharedStyles';
import { CONTAINER_XS, OD_ID_DEP_COLUMNS } from '../constants';

function DrillPipe({ component, error, onChange, onCancel, onSave, onUseSuggestion, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const xs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / columns;

  const getError = key => error && error[key];

  const filteredSuggestions = useMemo(() => {
    const suggestionsToUse = OD_ID_DEP_LIST;
    return !component.outer_diameter
      ? []
      : suggestionsToUse.filter(
          item => item.outer_diameter === parseFloat(component.outer_diameter)
        );
  }, [component.outer_diameter]);

  return (
    <Grid container spacing={0} className={classes.editorContainer}>
      {!isMobileDetected && (
        <Grid item className={classes.editorComponentSize}>
          <ComponentIcon component={component} />
        </Grid>
      )}
      <Grid item className={classes.eidtorContentContainer}>
        <Grid container spacing={2}>
          <SharedEditorElements
            component={component}
            getError={getError}
            onChange={onChange}
            isCasing
          />

          {filteredSuggestions.length > 0 && (
            <Suggestions
              data={filteredSuggestions}
              allData={OD_ID_DEP_LIST}
              columns={OD_ID_DEP_COLUMNS}
              displayKeys={['outer_diameter', 'inner_diameter']}
              descriptionKeys={[
                'outer_diameter',
                'inner_diameter',
                'linear_weight',
                'number_of_joints',
                'component_length',
              ]}
              onSelect={onUseSuggestion}
              isCasing
            />
          )}

          <InputText
            type="name"
            label="Name"
            value={component.name}
            error={getError('name')}
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
          <SelectField
            type="grade"
            options={COMPONENT_GRADES}
            label="Grade"
            value={component.grade}
            error={getError('grade')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="outer_diameter_tooljoint"
            label="TJ OD"
            unit="shortLength"
            value={component.outer_diameter_tooljoint}
            error={getError('outer_diameter_tooljoint')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="inner_diameter_tooljoint"
            label="TJ ID"
            unit="shortLength"
            value={component.inner_diameter_tooljoint}
            error={getError('inner_diameter_tooljoint')}
            xs={xs}
            onChangeField={onChange}
          />
          <InputText
            type="length_tooljoint"
            label="TJ Length Per Joint"
            unit="length"
            value={component.length_tooljoint}
            error={getError('length_tooljoint')}
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
            type="class"
            options={COMPONENT_CLASSES}
            label="Class"
            value={component.class}
            error={getError('class')}
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

DrillPipe.propTypes = {
  component: PropTypes.shape({
    outer_diameter: PropTypes.number,
    component_length: PropTypes.number,
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
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUseSuggestion: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

DrillPipe.defaultProps = {
  error: null,
};

export default memo(DrillPipe);
