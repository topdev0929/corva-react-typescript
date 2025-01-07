import { Fragment, memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay, getUnitPreference } from '~/utils';

import { InputText, StaticField } from '../shared';
import { useStyles } from '../sharedStyles';

function NozzleSize({ data, errors, isEditing, onChange }) {
  const classes = useStyles({ isMobile: isMobileDetected });
  const nozzleSizeErrors = errors || [];

  const shortLengthPrefUnit = getUnitPreference('shortLength');
  const nozzleSizeUnitDisplay =
    shortLengthPrefUnit === 'in'
      ? `${getUnitDisplay('shortLength')}/32`
      : `${getUnitDisplay('shortLength')}`;

  const handleAdd = () => {
    onChange([
      ...data,
      {
        size: null,
        count: null,
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
        Nozzle Sizes
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
                type="count"
                label="# of this size"
                value={row.count}
                error={nozzleSizeErrors[rowIndex] && nozzleSizeErrors[rowIndex].count}
                xs={isMobileDetected ? 5 : 4}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="# of this size" value={row.count} xs={6} />
            )}
            {isEditing ? (
              <InputText
                type="size"
                label={`Nozzle Size (${nozzleSizeUnitDisplay})`}
                value={row.size}
                error={nozzleSizeErrors[rowIndex] && nozzleSizeErrors[rowIndex].size}
                xs={isMobileDetected ? 5 : 4}
                onChangeField={handleChangeField(rowIndex)}
              />
            ) : (
              <StaticField label="Nozzle Size" unit="shortLength" value={row.size} xs={6} />
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

NozzleSize.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      size: PropTypes.number,
    })
  ),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.string,
      size: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

NozzleSize.defaultProps = {
  data: [],
  errors: [],
  onChange: null,
};

export default memo(NozzleSize);
