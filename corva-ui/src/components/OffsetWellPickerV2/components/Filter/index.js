import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { isNativeDetected, isMobileDetected } from '~/utils/mobileDetect';

import SubjectWellSearch from './SubjectWellSearch';
import RadiusInput from './RadiusInput';
import SidetrackSwitch from './SidetrackSwitch';
import NonEngineeredWellsSwitch from './NonEngineeredWellsSwitch';
import ToggleFiltersButton from './ToggleFiltersButton';
import ToggleMapButton from './ToggleMapButton';
import SingleSelect from './SingleSelect';
import MultiSelect from './MultiSelect';
import ClearFiltersButton from './ClearFiltersButton';

import { FILTERS_LIST } from '../../constants';

const PAGE_NAME = 'Filter';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fileterSection: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subjectWellWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

const isMobile = isNativeDetected || isMobileDetected;

function Filter({
  companyId,
  companies,
  canViewCompanies,
  wells,
  subjectWell,
  radius,
  excludeSideTrack,
  excludeNonEngineeredWells,
  filters,
  filtersOptions,
  mapHidden,
  isRadiusEditable,
  onChangeCompany,
  onSetSubjectWell,
  onChangeFilters,
  onChangeRadius,
  onChangeSidetrack,
  onChangeNonEngineeredWells,
  onClearFilters,
  onToggleMap,
}) {
  const [filtersHidden, setFiltersHidden] = useState(isMobile);

  const classes = useStyles({ isMobile });

  const handleToggleFilters = () => {
    setFiltersHidden(prev => !prev);
  };

  return (
    <div>
      {isMobile && (
        <ToggleFiltersButton filtersHidden={filtersHidden} onToggleFilters={handleToggleFilters} />
      )}
      {!filtersHidden && (
        <div className={classes.container}>
          <ToggleMapButton mapHidden={mapHidden} onToggleMap={onToggleMap} />
          <div className={classes.filters}>
            <div className={classes.fileterSection}>
              {canViewCompanies && (
                <SingleSelect
                  data-testid={`${PAGE_NAME}_companyDropdown`}
                  key="company"
                  label="Company"
                  items={companies}
                  currentValue={companyId}
                  onChange={e => onChangeCompany(e.target.value)}
                />
              )}
              {FILTERS_LIST.map(({ key, title, size, renderValue }) => (
                <MultiSelect
                  key={key}
                  title={title}
                  size={size}
                  options={get(filtersOptions, key, [])}
                  currentValues={get(filters, key, [])}
                  renderValue={renderValue}
                  onChange={newValues => onChangeFilters(key, newValues)}
                />
              ))}
              <div className={classes.subjectWellWrapper}>
                <SubjectWellSearch
                  wells={wells}
                  subjectWell={subjectWell}
                  onChange={onSetSubjectWell}
                />
                <RadiusInput
                  radius={radius}
                  editable={isRadiusEditable}
                  onChange={onChangeRadius}
                />
                <SidetrackSwitch initialChecked={excludeSideTrack} onChange={onChangeSidetrack} />
                <NonEngineeredWellsSwitch
                  value={excludeNonEngineeredWells}
                  onChange={onChangeNonEngineeredWells}
                />
                <ClearFiltersButton onClick={onClearFilters} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Filter.propTypes = {
  canViewCompanies: PropTypes.bool.isRequired,
  companies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subjectWell: PropTypes.shape({}),
  companyId: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  isRadiusEditable: PropTypes.bool.isRequired,
  excludeSideTrack: PropTypes.bool.isRequired,
  excludeNonEngineeredWells: PropTypes.bool.isRequired,
  filters: PropTypes.shape({}).isRequired,
  filtersOptions: PropTypes.shape({}).isRequired,
  mapHidden: PropTypes.bool.isRequired,
  onChangeCompany: PropTypes.func.isRequired,
  onSetSubjectWell: PropTypes.func.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  onChangeRadius: PropTypes.func.isRequired,
  onChangeSidetrack: PropTypes.func.isRequired,
  onChangeNonEngineeredWells: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleMap: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  subjectWell: null,
};

export default memo(Filter);
