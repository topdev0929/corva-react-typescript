import { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons/';

const ToggleFiltersButton = ({ filtersHidden, onToggleFilters }) => {
  return (
    <div>
      <Button
        endIcon={filtersHidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        onClick={onToggleFilters}
      >
        Filters
      </Button>
    </div>
  );
};

ToggleFiltersButton.propTypes = {
  filtersHidden: PropTypes.bool.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
};

export default memo(ToggleFiltersButton);
