import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { SortDirection } from 'react-virtualized';
import { ColumnType } from '../constants';

const sortFunction = (array, sortBy, sortDirection) => {
  const newArray = [...array];
  const isLastActiveSort = sortBy === ColumnType.lastActive;
  newArray.sort((a, b) => {
    if (!a[sortBy] && (a[sortBy] !== 0 || isLastActiveSort)) return 1;
    if (!b[sortBy] && (b[sortBy] !== 0 || isLastActiveSort)) return -1;
    if (sortDirection === SortDirection.ASC) return a[sortBy] - b[sortBy];
    return b[sortBy] - a[sortBy];
  });
  return newArray;
};

export function useSortedWells(
  subjectWell,
  expandedWells,
  selectedWells,
  setIsTableLoading,
  isLoading
) {
  const [sortBy, setSortBy] = useState(ColumnType.distance);
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const [sortedWells, setSortedWells] = useState(null);

  // NOTE: Sort wells
  useEffect(() => {
    if (!expandedWells || isLoading) return;
    // NOTE: Sort selected wells
    const topWellIds = selectedWells.map(({ id }) => id);
    const restSelectedWells = selectedWells.filter(well => well.id !== subjectWell?.id);
    const sortedSelectedWells = sortFunction(restSelectedWells, sortBy, sortDirection);

    // NOTE: Sort unselected wells
    const restWells = expandedWells.filter(well => !topWellIds.includes(well.id));
    const sortedWells = sortFunction(restWells, sortBy, sortDirection);
    // NOTE: Subject well + selected wells + unselected wells
    const combinedWells = (!isEmpty(subjectWell) ? [subjectWell] : [])
      .concat(sortedSelectedWells)
      .concat(sortedWells);

    // NOTE: Add checked field
    const checkedWells = combinedWells.map(well => {
      if (selectedWells.find(item => item.id === well.id)) {
        return { ...well, checked: true };
      } else {
        return { ...well, checked: false };
      }
    });

    setSortedWells(checkedWells);
    setIsTableLoading(false);
  }, [expandedWells, sortBy, sortDirection, subjectWell, selectedWells, isLoading]);

  return [sortBy, setSortBy, sortDirection, setSortDirection, sortedWells];
}
