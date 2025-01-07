import { memo, useMemo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { CasingComponentIcon as ComponentIcon } from '~/components';
import { COMPONENT_GRADES, OD_ID_DEP_LIST } from '~/constants/casing';

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

function CasingJoints({ component, error, onChange, onCancel, onSave, onUseSuggestion, columns }) {
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
            type="inside_mud_density"
            label="Inside Mud Density"
            unit="density"
            value={component.inside_mud_density}
            error={getError('inside_mud_density')}
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
            type="connection_type"
            label="Connection Type"
            value={component.connection_type}
            error={getError('connection_type')}
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

CasingJoints.propTypes = {
  component: PropTypes.shape({
    outer_diameter: PropTypes.number,
    component_length: PropTypes.number,
    name: PropTypes.string,
    weight: PropTypes.number,
    number_of_joints: PropTypes.number,
    inside_mud_density: PropTypes.number,
    connection_type: PropTypes.string,
    grade: PropTypes.string,
  }).isRequired,
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUseSuggestion: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

CasingJoints.defaultProps = {
  error: null,
};

export default memo(CasingJoints);
