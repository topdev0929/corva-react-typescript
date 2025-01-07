import { Fragment, memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { isMobileDetected } from '~/utils/mobileDetect';

import { InputText, StaticField } from '../shared';
import { useStyles } from '../sharedStyles';

function PressureLoss({ data, title, errors, isEditing, onChange }) {
  const classes = useStyles({ isMobile: isMobileDetected, isEditing });
  const pressureLossErrors = errors || [];

  const handleAdd = () => {
    onChange([
      ...data,
      {
        flow_rate: null,
        pressure_loss: null,
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
        {title}
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
              <InputText
                type="flow_rate"
                label="Flow Rate"
                unit="volumeFlowRate"
                value={row.flow_rate}
                error={pressureLossErrors[rowIndex] && pressureLossErrors[rowIndex].flow_rate}
                xs={isMobileDetected ? 5 : 4}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="Flow Rate" unit="volumeFlowRate" value={row.flow_rate} xs={6} />
            )}

            {isEditing ? (
              <InputText
                type="pressure_loss"
                label="Pressure Loss"
                unit="pressure"
                value={row.pressure_loss}
                error={pressureLossErrors[rowIndex] && pressureLossErrors[rowIndex].pressure_loss}
                xs={isMobileDetected ? 5 : 4}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="Pressure Loss" unit="pressure" value={row.pressure_loss} xs={6} />
            )}

            {isEditing && (
              <Grid
                item
                xs={isMobileDetected ? 2 : 4}
                className={{ [classes.cellInnerMobile]: isMobileDetected }}
              >
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

PressureLoss.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      flow_rate: PropTypes.number,
      pressure_loss: PropTypes.number,
    })
  ),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      flow_rate: PropTypes.string,
      pressure_loss: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

PressureLoss.defaultProps = {
  title: 'Pressure Loss',
  data: [],
  errors: [],
  onChange: null,
};

export default memo(PressureLoss);
