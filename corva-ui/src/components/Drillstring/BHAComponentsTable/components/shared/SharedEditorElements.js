import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isMobileDetected } from '~/utils/mobileDetect';
import { COMPONENT_FAMILIES as DRILLSTRING_FAMILES } from '~/constants/drillstring';
import { COMPONENT_FAMILIES as CASING_BHA_FAMILES } from '~/constants/casing';
import { InputText } from './InputText';
import { SelectField } from './SelectField';
import { useStyles } from '../sharedStyles';

export function SharedEditorElements({ component, getError, onChange, isCasing }) {
  const classes = useStyles();
  const xs = isMobileDetected ? 6 : 2;

  const familes = useMemo(() => {
    return isCasing ? CASING_BHA_FAMILES : DRILLSTRING_FAMILES.drilling;
  });

  return (
    <>
      <SelectField
        type="family"
        options={familes}
        label="Component"
        value={component.family}
        error={getError('family')}
        xs={xs}
        onChangeField={onChange}
        className={classes.editorHeaderCell}
      />
      <InputText
        type="outer_diameter"
        label="OD"
        unit="shortLength"
        value={component.outer_diameter}
        error={getError('outer_diameter')}
        xs={xs}
        onChangeField={onChange}
        className={classes.editorHeaderCell}
      />
      <InputText
        type="inner_diameter"
        label="ID"
        unit="shortLength"
        value={component.inner_diameter}
        error={getError('inner_diameter')}
        xs={xs}
        onChangeField={onChange}
        className={classes.editorHeaderCell}
      />
      <InputText
        type="linear_weight"
        label="Linear Weight"
        unit="massPerLength"
        value={component.linear_weight}
        error={getError('linear_weight')}
        xs={xs}
        onChangeField={onChange}
        className={classes.editorHeaderCell}
      />
      <InputText
        type="length"
        label="Length"
        unit="length"
        value={component.length}
        error={getError('length')}
        xs={xs}
        onChangeField={onChange}
        className={classes.editorHeaderCell}
      />
      <div className={classes.editorGap} />
    </>
  );
}

SharedEditorElements.propTypes = {
  component: PropTypes.shape({
    family: PropTypes.string,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    length: PropTypes.number,
  }).isRequired,
  getError: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isCasing: PropTypes.bool,
};

SharedEditorElements.defaultProps = {
  isCasing: false,
};
