import { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Dialog, makeStyles, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import RadiusInput from './RadiusInput';
import SidetrackSwitch from './SidetrackSwitch';
import MultiSelect from './MultiSelect';
import ClearFiltersButton from './ClearFiltersButton';

import { FILTERS_LIST } from '../../constants';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    marginBottom: '24px',
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
  filterRow: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    alignContent: 'flex-start',
    gap: '24px',
  },
  paper: {
    background: theme.palette.background.b4,
    overflow: 'hidden',
  },
  dialogTitle: {
    padding: '14px 0',
    height: '60px',
    borderBottom: `1px solid ${theme.palette.background.b7}`,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    fontSize: '18px',
  },
  title: {
    fontSize: '20px',
  },
  dialogContent: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    alignContent: 'flex-start',
    height: '100%',
    paddingRight: '16px',
    justifyContent: 'space-between',
  },
}));

function Filter({
  radius,
  excludeSideTrack,
  filters,
  filtersOptions,
  isRadiusEditable,
  filtersHidden,
  onChangeFilters,
  onChangeRadius,
  onChangeSidetrack,
  onClearFilters,
  isTablet,
  isMobile,
  onToggleFilters,
}) {
  const classes = useStyles({ isMobile });
  const multiSelectSize = isTablet ? 200 : 150;
  const onClose = () => {
    onToggleFilters(false);
  };

  if (filtersHidden && isMobile && !isTablet) {
    return (
      <Dialog
        onBackdropClick={onClose}
        onEscapeKeyDown={onClose}
        fullScreen
        maxWidth="xs"
        fullWidth
        open
        classes={{ paper: classes.paper }}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div className={classes.titleWrapper}>
            <Typography className={classes.title}>Filter</Typography>
            <CloseIcon className={classes.closeIcon} onClick={onClose} />
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {FILTERS_LIST.map(({ key, title, renderValue }) => (
            <MultiSelect
              key={key}
              title={title}
              size={multiSelectSize}
              options={get(filtersOptions, key, [])}
              currentValues={get(filters, key, [])}
              renderValue={renderValue}
              onChange={newValues => onChangeFilters(key, newValues)}
            />
          ))}
          <RadiusInput
            radius={radius}
            editable={isRadiusEditable}
            onChange={onChangeRadius}
            isMobile={isMobile}
          />
          <SidetrackSwitch
            checked={excludeSideTrack}
            onChange={onChangeSidetrack}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (!filtersHidden && (!isMobile || isTablet)) {
    return (
      <div className={classes.container}>
        <div className={classes.filters}>
          <div className={classes.fileterSection}>
            <div className={classes.filterRow}>
              {FILTERS_LIST.map(({ key, title, renderValue }) => (
                <MultiSelect
                  key={key}
                  title={title}
                  size={multiSelectSize}
                  options={get(filtersOptions, key, [])}
                  currentValues={get(filters, key, [])}
                  renderValue={renderValue}
                  onChange={newValues => onChangeFilters(key, newValues)}
                />
              ))}
              <RadiusInput
                radius={radius}
                editable={isRadiusEditable}
                onChange={onChangeRadius}
                isTablet={isTablet}
              />
              <SidetrackSwitch
                checked={excludeSideTrack}
                onChange={onChangeSidetrack}
                isMobile={isMobile}
              />
              <ClearFiltersButton onClick={onClearFilters} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

Filter.propTypes = {
  subjectWell: PropTypes.shape({}),
  radius: PropTypes.number.isRequired,
  isRadiusEditable: PropTypes.bool.isRequired,
  excludeSideTrack: PropTypes.bool.isRequired,
  filters: PropTypes.shape({}).isRequired,
  filtersOptions: PropTypes.shape({}).isRequired,
  filtersHidden: PropTypes.bool.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  onChangeRadius: PropTypes.func.isRequired,
  onChangeSidetrack: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  subjectWell: null,
};

export default memo(Filter);
