import { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Table, makeStyles } from '@material-ui/core';
import { LoadingIndicator } from '~/components';

import { useFetchWellhubWells } from '../../effects';
import OffsetWellTableHead from '../shared/OffsetWellTableHead';
import OffsetWellTableRows from '../shared/OffsetWellTableRows';
import { WELL_NAME_KEY } from '../../constants';

const useStyles = makeStyles({
  wellhubContainer: {
    flex: 1,
    marginTop: ({ isTablet, isMobile }) => (!isTablet && isMobile ? '12px' : '24px'),
    overflow: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
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

function WellHubView({ open, subjectWellId, setSelectedOffsetWells, isTablet, isMobile }) {
  const classes = useStyles({ isTablet, isMobile });

  const offsetWells = useFetchWellhubWells(subjectWellId);

  // NOTE: Create table data to display
  const [headCells, rows] = useMemo(() => {
    if (!offsetWells) return [null, null];

    // Create header cells data
    const headCells = [];
    headCells.push({
      id: 'All Wells',
      numeric: true,
      label: `Entire Well (${offsetWells.length})`,
    });

    // Create table rows data
    const rows = [];
    offsetWells.forEach(well => {
      const rowItem = headCells.reduce(
        (result, cell) => {
          return { ...result, [cell.id]: 1 };
        },
        { id: well.id, name: well.name }
      );
      if (rowItem) rows.push(rowItem);
    });

    // Insert Well Names column
    headCells.unshift({ id: WELL_NAME_KEY, numeric: false, label: `Well Names (${rows.length})` });

    return [headCells, rows];
  }, [offsetWells]);

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

  const isLoading = !offsetWells;

  return (
    <div className={classNames(classes.wellhubContainer, { [classes.containerHidden]: !open })}>
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
            lastSortDisable
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

WellHubView.propTypes = {
  open: PropTypes.bool.isRequired,
  subjectWellId: PropTypes.number.isRequired,
  setSelectedOffsetWells: PropTypes.func.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default memo(WellHubView);
