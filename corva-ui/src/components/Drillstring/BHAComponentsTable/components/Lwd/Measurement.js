import { Fragment, memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay } from '~/utils';
import { LWD_MEASUREMENT_TYPES } from '~/constants/drillstring';

import { InputText, SelectField, StaticField } from '../shared';
import { useStyles } from '../sharedStyles';

function Measurement({ data, errors, isEditing, onChange }) {
  const classes = useStyles({ isMobile: isMobileDetected, isEditing });
  const measurementErrors = errors || [];

  const handleAdd = () => {
    onChange([
      ...data,
      {
        type: null,
        name: null,
        distance: null,
      },
    ]);
  };

  const handleDelete = rowIndex => () => {
    onChange([...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)]);
  };

  const handleChangeField = rowIndex => (key, value) => {
    const newData = data.map((row, index) => {
      return index === rowIndex
        ? {
            ...row,
            [key]: value,
          }
        : row;
    });

    onChange(newData);
  };

  if (data.length === 0 && !isEditing) return null;

  /* eslint-disable react/no-array-index-key */
  return (
    <div className={classes.subGroup}>
      <div className={classNames(classes.subTitle, { [classes.subTitleEditing]: isEditing })}>
        LWD Measurements
        {isEditing && (
          <IconButton
            data-not-migrated-muiiconbutton
            className={classes.addButton}
            onClick={handleAdd}
          >
            <AddIcon className={classes.addIcon} color="primary" />
          </IconButton>
        )}
      </div>
      <Grid
        container
        spacing={2}
        className={classNames(classes.detailedView, {
          [classes.detailedViewMobile]: isMobileDetected,
          [classes.eidtorNozzleView]: isEditing,
        })}
      >
        {data.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {isEditing ? (
              <SelectField
                type="type"
                options={LWD_MEASUREMENT_TYPES}
                label="Measurement Type"
                value={row.type}
                error={measurementErrors[rowIndex] && measurementErrors[rowIndex].type}
                xs={3}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="Measurement Type" value={row.type} format={null} xs={4} />
            )}
            {isEditing ? (
              <InputText
                type="name"
                label="Measurement Name"
                value={row.name}
                error={measurementErrors[rowIndex] && measurementErrors[rowIndex].name}
                xs={3}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="Measurement Name" value={row.name} format={null} xs={4} />
            )}
            {isEditing ? (
              <InputText
                type="distance"
                label={`M. Point distance (${getUnitDisplay('length')})`}
                value={row.distance}
                error={measurementErrors[rowIndex] && measurementErrors[rowIndex].distance}
                xs={3}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField
                label="Measure Point distance to Bit"
                unit="length"
                value={row.distance}
                xs={4}
              />
            )}
            {isEditing && (
              <Grid item xs={3} className={{ [classes.cellInnerMobile]: isMobileDetected }}>
                <IconButton
                  data-not-migrated-muiiconbutton
                  className={classes.addButton}
                  onClick={handleDelete(rowIndex)}
                >
                  <DeleteIcon className={classes.addIcon} />
                </IconButton>
              </Grid>
            )}
          </Fragment>
        ))}
      </Grid>
    </div>
  );
}

Measurement.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.string,
      distance: PropTypes.number,
    })
  ),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.string,
      distance: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

Measurement.defaultProps = {
  data: [],
  errors: [],
  onChange: null,
};

export default memo(Measurement);
