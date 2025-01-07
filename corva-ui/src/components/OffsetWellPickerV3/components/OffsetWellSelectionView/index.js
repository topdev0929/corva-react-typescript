import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get, union } from 'lodash';
import { Table, makeStyles } from '@material-ui/core';
import { LoadingIndicator } from '~/components';

import { useWells, useFetchBicWellsData } from '../../effects';
import {
  DEFAULT_WELL_SECTIONS,
  FILTER_BASEDON_TYPE,
  ALL_KEY,
  WELL_NAME_KEY,
} from '../../constants';
import OffsetWellTableHead from '../shared/OffsetWellTableHead';
import OffsetWellTableRows from '../shared/OffsetWellTableRows';

const useStyles = makeStyles({
  offsetwellContainer: {
    position: 'relative',
    flex: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
    display: 'inline-block',
  },
  containerHidden: {
    display: 'none',
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '550px',
  },
});

function OffsetWellSelectionView({
  open,
  companyId,
  subjectWellId,
  filterBasedOn,
  setSectionOptions,
  selectedSection,
  setSelectedOffsetWells,
  isTablet,
  isMobile,
}) {
  const classes = useStyles({ isTablet, isMobile });
  const wells = useWells(companyId);
  const bicData = useFetchBicWellsData(subjectWellId);
  const [wellSections, setWellSections] = useState([]);

  const getSectionName = useCallback(section => {
    if (section.name === 'well') return 'Entire Well';
    else if (section.filterMode === 'section') return `${section.name}`;
    return `${section.name} in`;
  }, []);

  // NOTE: Create offset well sections wells data
  useEffect(() => {
    if (!wells) return;

    const getWellName = (wells, wellId) => {
      const well = wells.find(item => item.id === wellId);
      return get(well, WELL_NAME_KEY) || '-';
    };

    let advancedWellSections;
    if (!bicData || !bicData.filters || !bicData.result) {
      advancedWellSections = DEFAULT_WELL_SECTIONS;
    } else {
      const filteredTabs = bicData?.filters?.filterTabs || [];
      const filterMode = bicData?.filters?.filterMode;
      advancedWellSections = filteredTabs.map(area => {
        return {
          id: area.value,
          name: area.value,
          filterMode,
          wells:
            bicData.result[area.value]
              ?.filter(id => wells.find(well => well.id === id))
              .map(item => {
                const id = typeof item === 'object' ? item.id : item;
                return {
                  id,
                  name: getWellName(wells, id),
                };
              }) || [],
        };
      });
    }

    setWellSections(advancedWellSections);

    // Create section options
    const options = [{ id: ALL_KEY, name: 'All' }];
    advancedWellSections.forEach(section => {
      options.push({ id: section.id, name: getSectionName(section) });
    });
    setSectionOptions(options);
  }, [wells, bicData]);

  // NOTE: Create table data to display
  const [headCells, rows] = useMemo(() => {
    // Get all wells
    const unsortedWells = wellSections.reduce((result, section) => {
      return union(result, section.wells);
    }, []);
    const allWells = unsortedWells.reduce((result, well) => {
      if (!result.find(item => item.id === well.id))
        return [...result, { id: well.id, name: well.name }];
      return result;
    }, []);

    // Create header cells data
    const headCells = [];
    const filteredWellSections = wellSections.filter(
      section => selectedSection === ALL_KEY || selectedSection === section.id
    );
    if (filterBasedOn === FILTER_BASEDON_TYPE.entireWell) {
      headCells.push({
        id: 'All Wells',
        numeric: true,
        label: `All Wells (${allWells.length})`,
      });
    } else {
      filteredWellSections.forEach(section => {
        headCells.push({
          id: section.name,
          numeric: true,
          label: `${getSectionName(section)} (${section.wells.length})`,
        });
      });
    }

    // Create table rows data
    const rows = [];
    allWells.forEach(well => {
      const rowItem = headCells.reduce(
        (result, cell) => {
          if (filterBasedOn === FILTER_BASEDON_TYPE.entireWell) return { ...result, [cell.id]: 1 };

          const matchedSection = filteredWellSections.find(section => section.name === cell.id);
          if (matchedSection.wells.find(item => well.name === item.name))
            return { ...result, [cell.id]: 1 };

          if (selectedSection === ALL_KEY) return { ...result, [cell.id]: 0 };
          return null;
        },
        { id: well.id, name: well.name }
      );
      if (rowItem) rows.push(rowItem);
    });

    // Insert Well Names column
    headCells.unshift({ id: WELL_NAME_KEY, numeric: false, label: `Well Names (${rows.length})` });

    return [headCells, rows];
  }, [wellSections, selectedSection]);

  // NOTE: Update offset wells
  useEffect(() => {
    if (!open) return;

    const newOffsetWells = rows.map(row => ({ id: row.id }));
    setSelectedOffsetWells(newOffsetWells);
  }, [open, rows]);

  // NOTE: Talbe sort
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(WELL_NAME_KEY);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isLoading = !wells;
  return (
    <div className={classNames(classes.offsetwellContainer, { [classes.containerHidden]: !open })}>
      {isLoading ? (
        <div className={classes.loadingWrapper}>
          <LoadingIndicator fullscreen={false} />
        </div>
      ) : (
        <Table size="small" style={{ borderCollapse: 'separate' }}>
          <OffsetWellTableHead
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            isTablet={isTablet}
            isMobile={isMobile}
            rowNum={rows.length}
          />
          <OffsetWellTableRows
            rows={rows}
            headCells={headCells.slice(1)}
            order={order}
            orderBy={orderBy}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        </Table>
      )}
    </div>
  );
}

OffsetWellSelectionView.propTypes = {
  open: PropTypes.bool.isRequired,
  companyId: PropTypes.number.isRequired,
  subjectWellId: PropTypes.number.isRequired,
  filterBasedOn: PropTypes.string.isRequired,
  setSectionOptions: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedSection: PropTypes.any.isRequired,
  setSelectedOffsetWells: PropTypes.func.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default memo(OffsetWellSelectionView);
