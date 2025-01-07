import { memo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { BHAComponentIcon as ComponentIcon } from '~/components';
import { COMPONENT_FAMILIES, BIT_TYPES } from '~/constants/drillstring';

import { InputText, SelectField, CancelButton, SaveButton } from '../shared';
import { useStyles } from '../sharedStyles';
import NozzleSize from '../NozzleSize';
import { CONTAINER_XS } from '../constants';

function Bit({ component, error, onChange, onCancel, onSave, columns }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const xs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / columns;
  const headXs = isMobileDetected ? CONTAINER_XS / 2 : CONTAINER_XS / 6;

  const getError = key => error && error[key];

  const handleChangeNozzleSize = newNozzleSize => {
    onChange('nozzle_sizes', newNozzleSize);
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
          <SelectField
            type="family"
            options={COMPONENT_FAMILIES.drilling}
            label="Component"
            value={component.family}
            error={getError('family')}
            xs={headXs}
            onChangeField={onChange}
            className={classes.editorHeaderCell}
          />
          <InputText
            type="name"
            label="Name"
            value={component.name}
            error={getError('name')}
            xs={headXs}
            onChangeField={onChange}
            className={classes.editorHeaderCell}
          />
          <SelectField
            type="bit_type"
            options={BIT_TYPES}
            label="Bit Type"
            value={component.bit_type}
            error={getError('bit_type')}
            xs={headXs}
            onChangeField={onChange}
            className={classes.editorHeaderCell}
          />
          <InputText
            type="size"
            label="Bit Size"
            unit="shortLength"
            value={component.size}
            error={getError('size')}
            xs={headXs}
            onChangeField={onChange}
            className={classes.editorHeaderCell}
          />
          <InputText
            type="length"
            label="Length"
            unit="length"
            value={component.length}
            error={getError('length')}
            xs={headXs}
            onChangeField={onChange}
            className={classes.editorHeaderCell}
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
            type="tfa"
            label="TFA"
            value={component.tfa}
            error={getError('tfa')}
            xs={xs}
            onChangeField={onChange}
          />

          <NozzleSize
            isEditing
            data={component.nozzle_sizes}
            errors={getError('nozzle_sizes')}
            onChange={handleChangeNozzleSize}
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
  error: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
};

Bit.defaultProps = {
  error: null,
};

export default memo(Bit);
