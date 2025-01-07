import { useState, memo, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { LoadingIndicator } from '~/components';
import { AdvancedSearch } from './AdvancedSearch';
import OffsetWellsTableHead from './OffsetWellsTableHead';
import OffsetWellsTableRow from './OffsetWellsTableRow';
import {
  EXPANED_WELLNAME_WIDTH,
  METRICS_LIST,
  ROW_HEIGHT,
  TableColumns,
  ViewType,
} from '../../constants';
import styles from './OffsetWellsTable.module.css';
import { getIsImperial } from '../../utils/unitSystem';

const FLYING_DURATION = 200;
const DIFF_WELLNAME_WIDTH = 58;

const getWellsForAnimation = (wells, moveRowCount, oldPosition, newPosition) => {
  const newWells = wells.map((well, index) => {
    const isMoveRow =
      (oldPosition < index && index <= newPosition) ||
      (newPosition <= index && index < oldPosition);

    if (index === oldPosition) {
      return { ...well, moveTo: moveRowCount };
    } else if (isMoveRow) {
      return {
        ...well,
        moveTo: oldPosition < newPosition ? -1 : 1,
        delayTime: Math.abs(index - oldPosition),
      };
    }
    return well;
  });
  return newWells;
};

const getParametersForAnimation = (wells, newCheckedWellId, updatedWells, contentRef) => {
  const oldPosition = wells.findIndex(well => newCheckedWellId === well.id);
  let newPosition = updatedWells.findIndex(well => newCheckedWellId === well.id);
  if (newPosition === -1) newPosition = updatedWells.length;
  const showRowNumber = Math.round((contentRef.current?.clientHeight - 145) / ROW_HEIGHT + 1);
  const diffPosition = newPosition - oldPosition;
  if (Math.abs(diffPosition) > showRowNumber) {
    newPosition = oldPosition + showRowNumber * Math.sign(diffPosition);
  }

  const moveRowCount = newPosition - oldPosition;
  const newFlyDuration = (Math.abs(moveRowCount) * 0.4 + 2) * FLYING_DURATION;
  const newEmptyRowIndex = Math.min(oldPosition, newPosition);
  const newEmptyRowSize = (Math.abs(moveRowCount) + 1) * ROW_HEIGHT;

  return [
    oldPosition,
    newPosition,
    moveRowCount,
    newFlyDuration,
    newEmptyRowIndex,
    newEmptyRowSize,
  ];
};

const OffsetWellsTable = ({
  open,
  isTableLoading,
  companyId,
  subjectWellId,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  columnsWithDict,
  wells: updatedWells,
  metricsKeys,
  setMetricsKeys,
  handleChanageOffsetWell,
  handleChangeAllOffsetWells,
  handleAddRemoveAssets,
  isWellNameExpand,
  setIsWellNameExpand,
  isHscrollMoved,
  onHideAdvancedSearch,
  isViewOnly,
  isLastWell,
  contentRef,
  isLimitedOffsetwells,
  maxOffsetwellNumber,
  wellSections,
  setActiveWellId,
  viewType,
  isWDUser,
}) => {
  const [wells, setWells] = useState([]);
  const [newCheckedWellId, setNewCheckedWellId] = useState(null);
  const [emptyRowIndex, setEmptyRowIndex] = useState(0);
  const [emptyRowSize, setEmptyRowSize] = useState(0);
  const headTableRef = useRef();
  const bodyTableRef = useRef();
  const flyDurationRef = useRef();

  useEffect(() => {
    if (!newCheckedWellId) {
      setWells(updatedWells);
      setEmptyRowSize(0);
      return;
    }

    const [
      oldPosition,
      newPosition,
      moveRowCount,
      newFlyDuration,
      newEmptyRowIndex,
      newEmptyRowSize,
    ] = getParametersForAnimation(wells, newCheckedWellId, updatedWells, contentRef);

    flyDurationRef.current = newFlyDuration;

    if (newPosition === oldPosition) {
      setWells(updatedWells);
    } else {
      setEmptyRowIndex(newEmptyRowIndex);
      setEmptyRowSize(newEmptyRowSize);
      const newWells = getWellsForAnimation(wells, moveRowCount, oldPosition, newPosition);
      setWells(newWells);
      setTimeout(() => {
        setWells(updatedWells);
        setEmptyRowSize(0);
        setNewCheckedWellId(null);
      }, newFlyDuration);
    }
  }, [updatedWells]);

  const [selectedWells, indeterminate, isAllWellsSelected] = useMemo(() => {
    const selectedWells = wells.filter(well => well.checked);
    const indeterminate =
      wells.length !== selectedWells.length && selectedWells.length && !isLimitedOffsetwells;
    const isAllWellsSelected = selectedWells.length === wells.length || isLimitedOffsetwells;

    return [selectedWells, indeterminate, isAllWellsSelected];
  }, [wells, isLimitedOffsetwells]);
  const isImperial = useMemo(() => getIsImperial(), []);
  const metricsColumns = useMemo(() => {
    // NOTE: Pay attention to the order of metrics and duplication
    return (metricsKeys || []).reduce(
      (result, key) => result.concat(METRICS_LIST.filter(item => item.key === key)),
      []
    );
  }, [metricsKeys]);

  const wellNameWidth = useMemo(() => {
    if (isWellNameExpand) return EXPANED_WELLNAME_WIDTH - DIFF_WELLNAME_WIDTH;
    return TableColumns[0].width[metricsKeys.length] - DIFF_WELLNAME_WIDTH;
  }, [isWellNameExpand, metricsKeys?.length]);

  // NOTE: Remove shadow from column
  useEffect(() => {
    if (viewType === ViewType.mobile || !headTableRef.current || !bodyTableRef.current) return;
    // Head table
    const headColumn = headTableRef.current.querySelector(`.${styles.wellNameFixed}`);
    if (!isHscrollMoved) {
      headColumn.classList.add(styles.noShadow);
    } else {
      headColumn.classList.remove(styles.noShadow);
    }

    // Body table
    const bodyColumns = bodyTableRef.current.querySelectorAll(`.${styles.wellNameFixed}`);
    if (!isHscrollMoved) {
      bodyColumns.forEach(th => th.classList.add(styles.noShadow));
    } else {
      bodyColumns.forEach(th => th.classList.remove(styles.noShadow));
    }
  }, [isHscrollMoved, bodyTableRef.current, headTableRef.current, wells]);

  const handleChangeSortBy = useCallback((sortKey, sortDirection) => {
    setSortBy(sortKey);
    setSortDirection(sortDirection);
  }, []);

  const handleChangeMetricsKeys = useCallback(newMetricsKeys => {
    setMetricsKeys(newMetricsKeys);
  }, []);

  const handleUpdateMetricsKey = useCallback((key, newValue) => {
    setMetricsKeys(prevKeys => prevKeys.map(item => (item === key ? newValue : item)));
  }, []);

  if (!columnsWithDict || !wells) return null;

  return (
    <div className={styles.offsetWellsTable}>
      <div className={styles.stickyTable}>
        <Table aria-label="ows table head" innerRef={headTableRef}>
          <TableHead>
            <OffsetWellsTableHead
              open={open}
              columnsWithDict={columnsWithDict}
              metricsKeys={metricsKeys}
              sortBy={sortBy}
              sortDirection={sortDirection}
              indeterminate={indeterminate}
              isAllWellsSelected={isAllWellsSelected}
              onChangeSort={handleChangeSortBy}
              onChangeMetricsKeys={handleChangeMetricsKeys}
              onUpdateMetricsKey={handleUpdateMetricsKey}
              isWellNameExpand={isWellNameExpand}
              setIsWellNameExpand={setIsWellNameExpand}
              handleChangeAllOffsetWells={handleChangeAllOffsetWells}
              wellNameStyle={styles.wellNameFixed}
              isViewOnly={isViewOnly}
              isImperial={isImperial}
              contentRef={contentRef}
              viewType={viewType}
            />
          </TableHead>
        </Table>
      </div>

      {!isViewOnly && (
        <div className={styles.searchCell}>
          <AdvancedSearch
            companyId={companyId}
            subjectWellId={subjectWellId}
            wells={wells}
            onChange={handleAddRemoveAssets}
            selectedWellIds={selectedWells.map(({ id }) => id)}
            onHideAdvancedSearch={onHideAdvancedSearch}
            width={contentRef.current?.getBoundingClientRect().width}
          />
        </div>
      )}

      <Table aria-label="ows table body" innerRef={bodyTableRef} className={styles.bodyTable}>
        <TableBody>
          <TableRow>
            <TableCell
              className={classNames(styles.topShadow, { [styles.viewOnlyShadow]: isViewOnly })}
            />
          </TableRow>
          {wells.map((well, index) => (
            <Fragment key={well.id}>
              <TableRow>
                {newCheckedWellId && emptyRowSize > 0 && index === emptyRowIndex && (
                  <TableCell style={{ height: emptyRowSize }} />
                )}
              </TableRow>
              <OffsetWellsTableRow
                columnsWithDict={columnsWithDict}
                subjectWellId={subjectWellId}
                data={well}
                metricsKeys={metricsKeys}
                metricsColumns={metricsColumns}
                handleChanageOffsetWell={handleChanageOffsetWell}
                isWellNameExpand={isWellNameExpand}
                wellNameStyle={styles.wellNameFixed}
                wellNameWidth={wellNameWidth}
                isViewOnly={isViewOnly}
                isImperial={isImperial}
                isLimitedOffsetwells={isLimitedOffsetwells}
                maxOffsetwellNumber={maxOffsetwellNumber}
                wellSections={wellSections}
                setActiveWellId={setActiveWellId}
                viewType={viewType}
                newCheckedWellId={well?.moveTo ? newCheckedWellId : 0}
                setNewCheckedWellId={setNewCheckedWellId}
                index={well?.moveTo ? index : 0}
                flyDuration={well?.moveTo ? flyDurationRef.current : 0}
                isWDUser={isWDUser}
              />
            </Fragment>
          ))}
          {!isLastWell && (
            <TableRow>
              <TableCell className={styles.loadingCell}>
                <span>Loading...</span>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className={styles.bottomShadow} />
          </TableRow>
        </TableBody>
      </Table>

      {isTableLoading && (
        <LoadingIndicator fullscreen={false} className={styles.loadingContainer} />
      )}
    </div>
  );
};

OffsetWellsTable.propTypes = {
  open: PropTypes.bool.isRequired,
  isTableLoading: PropTypes.bool.isRequired,
  companyId: PropTypes.number.isRequired,
  subjectWellId: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  setSortDirection: PropTypes.func.isRequired,
  columnsWithDict: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  setMetricsKeys: PropTypes.func.isRequired,
  handleChanageOffsetWell: PropTypes.func.isRequired,
  handleChangeAllOffsetWells: PropTypes.func.isRequired,
  handleAddRemoveAssets: PropTypes.func.isRequired,
  setIsWellNameExpand: PropTypes.func.isRequired,
  isWellNameExpand: PropTypes.bool.isRequired,
  isHscrollMoved: PropTypes.bool.isRequired,
  onHideAdvancedSearch: PropTypes.func.isRequired,
  isViewOnly: PropTypes.bool.isRequired,
  isLastWell: PropTypes.bool.isRequired,
  isLimitedOffsetwells: PropTypes.bool.isRequired,
  maxOffsetwellNumber: PropTypes.number.isRequired,
  contentRef: PropTypes.shape().isRequired,
  wellSections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setActiveWellId: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  isWDUser: PropTypes.bool.isRequired,
};

export default memo(OffsetWellsTable);
