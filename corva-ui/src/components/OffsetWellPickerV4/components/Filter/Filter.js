import { useState } from 'react';
import PropTypes from 'prop-types';
import { omit, startCase, isEmpty } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { Divider, FormControlLabel, Switch, ListItemText } from '@material-ui/core';
import { DateTimePicker } from '~/components';
import { RadiusInput } from './RadiusInput';
import { MultiSelect } from './MultiSelect';
import { WellSection } from './WellSection';
import { PeriodSelect } from './PeriodSelect';
import { FilterType, OBJECTIVE_PERIOD_LIST, StatusOptions } from '../../constants';
import styles from './Filter.module.css';

const PAGE_NAME = 'Filter';

export const Filter = ({
  isHidden,
  isWDUser,
  filterOptions,
  wellSections,
  filters,
  selectedWellSection,
  subjectWell,
  onChangeFilters,
  onChangeBicWells,
}) => {
  const [errors, setErrors] = useState({});

  const handleChangeFilter = (type, value) => {
    if (type === FilterType.sideTracks) {
      onChangeFilters({ ...filters, [FilterType.sideTracks]: value });
    } else {
      onChangeFilters(value ? { ...filters, [type]: value } : omit({ ...filters }, [type]));
    }
  };
  const handleCustomDateChange = key => dateString => {
    const newDate = moment(dateString);
    if (!newDate.isValid()) {
      return;
    }
    const timestamp = newDate.unix();

    let isInvalidDate = false;
    if (key === 'timeRangeFrom') {
      isInvalidDate = timestamp >= filters[FilterType.timeRangeTo];
    } else if (key === 'timeRangeTo') {
      isInvalidDate = timestamp <= filters[FilterType.timeRangeFrom];
    }

    if (isInvalidDate) {
      setErrors({
        [key]: true,
      });
    } else {
      setErrors({});
    }

    onChangeFilters({ ...filters, [key]: timestamp });
  };

  return (
    <div className={classNames(styles.filterContainer, { [styles.hidden]: isHidden })}>
      <Divider className={styles.divideLine} />
      <div className={styles.filterGroup}>
        <MultiSelect
          label="Status"
          options={StatusOptions.map(item => item.value)}
          currentValues={filters[FilterType.status]}
          ValueComponent={({ value }) => (
            <div className={styles.statusItem}>
              <div
                className={styles.statusIcon}
                style={{ background: StatusOptions.find(item => item.value === value)?.color }}
              />
              {startCase(value)}
            </div>
          )}
          ListMenuItem={({ value }) => (
            <div className={styles.statusItem}>
              <div
                className={styles.statusIcon}
                style={{ background: StatusOptions.find(item => item.value === value)?.color }}
              />
              <ListItemText primary={startCase(value)} />
            </div>
          )}
          onChange={value => handleChangeFilter(FilterType.status, value)}
        />
        {filterOptions.map(({ value, label, options }) => (
          <MultiSelect
            label={label}
            options={options}
            currentValues={filters[value]}
            ListMenuItem={({ value }) => <ListItemText primary={value} />}
            onChange={filterValue => handleChangeFilter(value, filterValue)}
          />
        ))}
        <RadiusInput
          data-testid={`${PAGE_NAME}_radiusInput`}
          radius={filters[FilterType.radius]}
          editable={!!subjectWell}
          onChange={value => handleChangeFilter(FilterType.radius, value)}
        />
        <PeriodSelect
          label="Last Active"
          currentValue={filters[FilterType.period] || 'all'}
          options={OBJECTIVE_PERIOD_LIST}
          className={styles.companySelect}
          onChange={value => handleChangeFilter(FilterType.period, value)}
        />
        {filters[FilterType.period] === 'custom' && (
          <>
            <div className={styles.filterItem}>
              <DateTimePicker
                variant="inline"
                label="Date From"
                format="MM/DD/YY HH:mm"
                value={filters[FilterType.timeRangeFrom] * 1000 || null}
                onChange={handleCustomDateChange('timeRangeFrom')}
                error={errors.timeRangeFrom}
              />
            </div>
            <div className={styles.filterItem}>
              <DateTimePicker
                variant="inline"
                label="Date To"
                format="MM/DD/YY HH:mm"
                value={filters[FilterType.timeRangeTo] * 1000 || null}
                onChange={handleCustomDateChange('timeRangeTo')}
                error={errors.timeRangeTo}
              />
            </div>
          </>
        )}
        <FormControlLabel
          control={
            <Switch
              data-testid={`${PAGE_NAME}_ExcludeSidetracks`}
              size="small"
              color="primary"
              checked={filters[FilterType.sideTracks] || false}
              onChange={event => handleChangeFilter(FilterType.sideTracks, event.target.checked)}
            />
          }
          label="Exclude Sidetracks"
          classes={{ label: styles.sidetrack }}
        />
        {isWDUser && !isEmpty(wellSections) && (
          <WellSection
            selectedValue={selectedWellSection}
            wellSections={wellSections}
            onChange={onChangeBicWells}
          />
        )}
      </div>
    </div>
  );
};

Filter.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  isWDUser: PropTypes.bool.isRequired,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  wellSections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filters: PropTypes.shape({}).isRequired,
  selectedWellSection: PropTypes.string.isRequired,
  subjectWell: PropTypes.shape({}).isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  onChangeBicWells: PropTypes.func.isRequired,
};
