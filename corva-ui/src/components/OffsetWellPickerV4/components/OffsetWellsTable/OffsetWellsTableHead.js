import { memo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { SortDirection } from 'react-virtualized';
import {
  Checkbox,
  Tooltip,
  TableSortLabel as MuiTableSortLabel,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@material-ui/icons';
import { MetricsSettingMenu } from './MetricsSettingMenu';
import { MetricsSelect } from './MetricsSelect';
import { ColumnType, EXPANED_WELLNAME_WIDTH, ViewType } from '../../constants';
import styles from './OffsetWellsTableHead.module.css';

const PAGE_NAME = 'OffsetWellsTableHead';

const TableSortLabel = ({ title, ...props }) => (
  <Tooltip placement="top-end" title={title}>
    <MuiTableSortLabel {...props} />
  </Tooltip>
);

function getCellWidth(columnsWithDict, key) {
  const cell = columnsWithDict.find(item => item.key === key);
  return cell?.width || 0;
}

const OffsetWellsTableHead = ({
  open,
  columnsWithDict,
  metricsKeys,
  sortBy,
  sortDirection,
  indeterminate,
  isAllWellsSelected,
  onChangeSort,
  onChangeMetricsKeys,
  onUpdateMetricsKey,
  isWellNameExpand,
  setIsWellNameExpand,
  handleChangeAllOffsetWells,
  wellNameStyle,
  isViewOnly,
  isImperial,
  contentRef,
  viewType,
}) => {
  const [isMetricsMenuOpen, setIsMetricsMenuOpen] = useState(false);

  const handleSort = key => {
    onChangeSort(
      key,
      key === sortBy && sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    );
  };

  return (
    <TableRow className={styles.tableRow}>
      <TableCell
        data-testid={`${PAGE_NAME}_wellName`}
        className={classNames(styles.headCell, styles.wellNameCell, {
          [wellNameStyle]: viewType !== ViewType.mobile,
          [styles.wellNameCellMobile]: viewType === ViewType.mobile,
        })}
        style={{
          width: isWellNameExpand
            ? EXPANED_WELLNAME_WIDTH
            : getCellWidth(columnsWithDict, ColumnType.name),
        }}
      >
        <div className={styles.nameWrapper}>
          {!isViewOnly && open && (
            <Checkbox
              data-testid={`${PAGE_NAME}_allWellsSelector`}
              size="medium"
              onChange={event => handleChangeAllOffsetWells(event.target.checked)}
              checked={isAllWellsSelected}
              indeterminate={indeterminate}
            />
          )}
          <TableSortLabel
            title="Sort"
            active={sortBy === ColumnType.name}
            direction={
              sortBy === ColumnType.name && sortDirection === SortDirection.DESC ? 'desc' : 'asc'
            }
            classes={{
              root: classNames(styles.headerLabel, {
                [styles.cellDataViewOnly]: isViewOnly,
              }),
            }}
            onClick={() => handleSort(ColumnType.name)}
          >
            Well Name
          </TableSortLabel>
        </div>
        <Tooltip title={isWellNameExpand ? 'Collapse' : 'Expand'}>
          <ArrowForwardIosIcon
            className={classNames(styles.wellNameExpandIcon, {
              [styles.wellNameCollapsed]: !isWellNameExpand,
            })}
            onClick={() => setIsWellNameExpand(!isWellNameExpand)}
          />
        </Tooltip>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_nameExpander_${isWellNameExpand}`}
        className={styles.headCell}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.status) }}
      />

      <TableCell
        data-testid={`${PAGE_NAME}_rig`}
        className={styles.headCell}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.rig) }}
      >
        <div className={styles.nameWrapper}>
          <TableSortLabel
            title="Sort"
            active={sortBy === ColumnType.rig}
            direction={
              sortBy === ColumnType.rig && sortDirection === SortDirection.DESC ? 'desc' : 'asc'
            }
            classes={{ root: styles.headerLabel }}
            onClick={() => handleSort(ColumnType.rig)}
          >
            Rig
          </TableSortLabel>
        </div>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_distance`}
        className={styles.headCell}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.distance) }}
      >
        <div className={styles.nameWrapper}>
          <TableSortLabel
            title="Sort"
            active={sortBy === ColumnType.distance}
            direction={
              sortBy === ColumnType.distance && sortDirection === SortDirection.DESC
                ? 'desc'
                : 'asc'
            }
            classes={{ root: styles.headerLabel }}
            onClick={() => handleSort(ColumnType.distance)}
          >
            {`Distance (${isImperial ? 'miles' : 'km'})`}
          </TableSortLabel>
        </div>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_LastActive`}
        className={styles.headCell}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.lastActive) }}
      >
        <div className={styles.nameWrapper}>
          <TableSortLabel
            title="Sort"
            active={sortBy === ColumnType.lastActive}
            direction={
              sortBy === ColumnType.lastActive && sortDirection === SortDirection.DESC
                ? 'desc'
                : 'asc'
            }
            classes={{ root: styles.headerLabel }}
            onClick={() => handleSort(ColumnType.lastActive)}
          >
            Last Active
          </TableSortLabel>
        </div>
      </TableCell>

      {metricsKeys.map(metricsKey => (
        <TableCell
          data-testid={`${PAGE_NAME}_${metricsKey}`}
          key={metricsKey}
          className={styles.headCell}
          style={{ width: getCellWidth(columnsWithDict, metricsKey) }}
        >
          <TableSortLabel
            title={isMetricsMenuOpen ? '' : 'Sort'}
            active={sortBy === metricsKey}
            direction={
              sortBy === metricsKey && sortDirection === SortDirection.DESC ? 'desc' : 'asc'
            }
            classes={{ root: styles.headerLabel }}
            onClick={() => handleSort(metricsKey)}
          >
            <MetricsSelect
              isTooltipVisible={metricsKeys.length > 1}
              currentValue={metricsKey}
              metricsKeys={metricsKeys}
              onChange={newValue => onUpdateMetricsKey(metricsKey, newValue)}
              setIsMenuOpen={setIsMetricsMenuOpen}
            />
          </TableSortLabel>
        </TableCell>
      ))}

      <TableCell
        data-testid={`${PAGE_NAME}_WellSection`}
        className={styles.headCell}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.wellSection) }}
      >
        <div className={styles.settingsHeader}>
          <span className={styles.headerLabel}>Well Section</span>
          <MetricsSettingMenu
            viewType={viewType}
            metricsKeys={metricsKeys}
            onChange={onChangeMetricsKeys}
            contentRef={contentRef}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

OffsetWellsTableHead.propTypes = {
  open: PropTypes.bool.isRequired,
  columnsWithDict: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string,
      width: PropTypes.number,
    })
  ).isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  indeterminate: PropTypes.bool.isRequired,
  isAllWellsSelected: PropTypes.bool.isRequired,
  style: PropTypes.shape({}).isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onChangeMetricsKeys: PropTypes.func.isRequired,
  onUpdateMetricsKey: PropTypes.func.isRequired,
  isWellNameExpand: PropTypes.bool.isRequired,
  setIsWellNameExpand: PropTypes.func.isRequired,
  handleChangeAllOffsetWells: PropTypes.func.isRequired,
  wellNameStyle: PropTypes.string.isRequired,
  isViewOnly: PropTypes.bool.isRequired,
  isImperial: PropTypes.bool.isRequired,
  contentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  viewType: PropTypes.string.isRequired,
};

export default memo(OffsetWellsTableHead);
