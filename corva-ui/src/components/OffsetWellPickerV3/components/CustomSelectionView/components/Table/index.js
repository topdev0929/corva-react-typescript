import { AutoSizer, Column, Table } from 'react-virtualized';
import { SizeMe } from 'react-sizeme';
import { memo, useMemo, useRef } from 'react';
import { bool, number, string, func, shape, arrayOf } from 'prop-types';
import { get, clone, isEqual } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { Typography, IconButton, Checkbox } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import { getUnitDisplay, convertValue } from '~/utils';

import SubjectIndicator from './SubjectIndicator';
import MetricsAddMenu from './MetricsAddMenu';
import MetricsSelect from './MetricsSelect';
import { TABLE_COLUMNS, METRICS_LIST, METRICS_KEYS, SETTINGS_COLUMN } from '../../constants';
import { useStyles } from './styles';
import AssetSearch from './AssetSearch';

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 44;
const EXTRA_HEIGHT = 52;
const MAX_TABLE_HEIGHT = 2000;
const TABLE_WIDTH = 1004;

function formatItem(item, key) {
  const value = get(item, key);

  let result;
  switch (key) {
    case 'distance':
      result = Number.isFinite(value) ? parseFloat(value).toFixed(2) : 'N/A';
      break;
    case 'rigReleaseDate':
      result = Number.isFinite(value) ? moment.unix(value).format('MM/DD/YYYY') : 'N/A';
      break;
    default:
      result = value || '';
  }

  return result;
}

function formatMetricItem(item, metric, isMetricsLoading) {
  const value = get(item, metric.key);

  if (METRICS_KEYS.includes(metric.key)) {
    if (Number.isFinite(value) || value) {
      return metric.unitType ? convertValue(value, metric.unitType, metric.from, metric.to) : value;
    }

    if (isMetricsLoading) {
      return 'loading...';
    }
  }

  return '';
}

function WellsTable({
  open,
  subjectWell,
  wells,
  offsetWells,
  metricsKeys,
  isMetricsLoading,
  sortInfo,
  unusableWellAlarm,
  dialogWidth,
  onChangeMetricsKeys,
  onAddOffsetWell,
  onDeleteOffsetWell,
  onAddAllOffsetWells,
  onDeleteAllOffsetWells,
  onSorting,
  isTablet,
  isMobile,
  companyId,
}) {
  const classes = useStyles({ isTablet, isMobile });
  const tableContainerRef = useRef();
  // NOTE: Get usable wells & offset wells only
  const usableWells = useMemo(() => {
    return wells.filter(item => item.is_usable);
  }, [wells]);

  // NOTE: Just compare among usable wells
  const isAllUsableWellsSelected = useMemo(() => {
    const usableWellIds = usableWells.map(well => well.id).sort();
    const offsetWellIds = offsetWells.map(well => well.id).sort();
    return usableWellIds.length && isEqual(usableWellIds, offsetWellIds);
  }, [usableWells, offsetWells]);

  const metricsColumns = useMemo(() => {
    // NOTE: Pay attention to the order of metrics and duplication
    return metricsKeys.reduce(
      (result, key) => result.concat(METRICS_LIST.filter(item => item.key === key)),
      []
    );
  }, [metricsKeys]);

  // NOTE: Table columns
  const tableColumns = useMemo(() => {
    return [
      ...TABLE_COLUMNS,
      ...metricsColumns.map(item => ({ ...item, width: 240 })),
      SETTINGS_COLUMN,
    ];
  }, [metricsColumns]);

  // NOTE: Calculate width of each table columns
  const columnWidthDict = useMemo(() => {
    if (!dialogWidth || dialogWidth <= 0) {
      return {};
    }

    const result = {};
    // NOTE: Keep the columns that had been adjusted due to expected width is smaller than min width
    const adjustedColumns = [];

    // NOTE: Give fixed width to the columns with "width" field
    tableColumns
      .filter(column => Number.isFinite(column.width))
      .forEach(column => {
        result[column.key] = column.width - 1;
        adjustedColumns.push(column.width - 1);
      });

    tableColumns
      .filter(column => !Number.isFinite(column.width))
      .forEach(column => {
        // NOTE: Width sum of adjusted columns
        const sumOfAdjustColumnWidth = adjustedColumns.reduce(
          (subResult, columnWidth) => subResult + columnWidth,
          0
        );
        // NOTE: Expected space for the column
        const calculatedWidth = Math.floor(
          (dialogWidth - sumOfAdjustColumnWidth) / (tableColumns.length - adjustedColumns.length)
        );

        const requiredWidth = column.minWidth || 200;
        const adjustedWidth = calculatedWidth < requiredWidth ? requiredWidth : calculatedWidth;
        result[column.key] = adjustedWidth - 1;
        adjustedColumns.push(adjustedWidth - 1);
      });

    return result;
  }, [dialogWidth, tableColumns]);
  // NOTE: Calculate table width from adjusted columns width
  const tableWidth = useMemo(() => {
    if (tableContainerRef.current?.clientWidth > TABLE_WIDTH && open) {
      return tableContainerRef.current.clientWidth;
    }
    return TABLE_WIDTH;
  }, [columnWidthDict, tableContainerRef.current, open]);

  const handleChangeMetricsKeys = newKeys => {
    onChangeMetricsKeys(newKeys);
  };

  const handleChangeColumnMetricsKey = columnIdx => newKey => {
    const newKeys = clone(metricsKeys);
    newKeys[columnIdx] = newKey;
    onChangeMetricsKeys(newKeys);
  };

  const handleSorting = dataKey => {
    onSorting(dataKey);
  };

  const handleToggleWell = (targetId, checked) => {
    if (checked) {
      onAddOffsetWell(targetId);
    } else {
      onDeleteOffsetWell(targetId);
    }
  };

  const handleToggleWells = e => {
    if (e.target.checked) {
      onAddAllOffsetWells();
    } else {
      onDeleteAllOffsetWells();
    }
  };

  const sortIconRenderer = dataKey => {
    return (
      <IconButton
        data-not-migrated-muiiconbutton
        className={classes.sortIconButton}
        onClick={() => handleSorting(dataKey)}
      >
        {dataKey !== sortInfo.key ? (
          <NotInterestedIcon className={classes.sortIcon} />
        ) : (
          <SortIcon
            className={classNames(classes.sortIcon, {
              [classes.ascendingSortIcon]: sortInfo.direction === 1,
            })}
          />
        )}
      </IconButton>
    );
  };
  // NOTE: Table renderers
  const headerRenderer = headerData => {
    const { label, dataKey } = headerData;
    // name column
    if (dataKey === 'name') {
      return (
        <div className={classes.nameWrapper}>
          <Checkbox
            classes={{
              checked: classes.nameCheckBox,
              indeterminate: classes.nameCheckBox,
            }}
            onClick={handleToggleWells}
            checked={isAllUsableWellsSelected}
            indeterminate={offsetWells.length > 0 && !isAllUsableWellsSelected}
            size="small"
          />
          <Typography className={classNames(classes.cell, classes.nameCell)}>{label}</Typography>
          {sortIconRenderer(dataKey)}
        </div>
      );
    }

    // metrics columns
    if (metricsKeys.includes(dataKey)) {
      const currentMetric = metricsColumns.find(item => item.key === dataKey);
      const metricIndex = metricsColumns.findIndex(item => item.key === dataKey);
      return (
        <div className={classes.metricsColumn}>
          <MetricsSelect
            items={METRICS_LIST}
            currentValue={dataKey}
            onChange={handleChangeColumnMetricsKey(metricIndex)}
          />
          <Typography className={classNames(classes.cell, classes.unitCell)}>
            {currentMetric.unitType
              ? `(${getUnitDisplay(currentMetric.unitType, currentMetric.to)})`
              : ''}
          </Typography>
          {sortIconRenderer(dataKey)}
        </div>
      );
    }

    // settings column
    if (dataKey === SETTINGS_COLUMN.key) {
      return (
        <div className={classes.settingsCell}>
          <MetricsAddMenu metricsKeys={metricsKeys} onChange={handleChangeMetricsKeys} />
        </div>
      );
    }

    return (
      <div className={classes.nameWrapper}>
        <Typography className={classes.cell}>{label}</Typography>
        {sortIconRenderer(dataKey)}
      </div>
    );
  };

  const cellRenderer = ({ rowData: well, dataKey }) => {
    if (dataKey === 'name') {
      return (
        <div className={classes.nameWrapper}>
          <Checkbox
            color="primary"
            checked={offsetWells.findIndex(offsetWell => offsetWell.id === well.id) > -1}
            onChange={e => handleToggleWell(well.id, e.target.checked)}
            size="small"
            disabled={!well.is_usable}
          />

          <Typography
            className={classNames(classes.tableCellLabel, {
              [classes.tableCellLabelDisabled]: !well.is_usable,
            })}
          >
            {formatItem(well, dataKey)}
          </Typography>
          {subjectWell && well.id === subjectWell.id && <SubjectIndicator />}
        </div>
      );
    }

    // settings column
    if (dataKey === SETTINGS_COLUMN.key) {
      return (
        <div className={classes.settingsCell}>
          {!well.is_usable && (
            <Typography className={classes.errorMsg}>{unusableWellAlarm}</Typography>
          )}
        </div>
      );
    }

    let formattedCellData = null;
    if (metricsKeys.includes(dataKey)) {
      const currentMetric = metricsColumns.find(item => item.key === dataKey);
      formattedCellData = formatMetricItem(well, currentMetric, isMetricsLoading);
    } else {
      formattedCellData = formatItem(well, dataKey);
    }
    return (
      <Typography
        className={classNames(classes.cell, classes.tableCellLabel, {
          [classes.tableCellLabelDisabled]: !well.is_usable,
        })}
      >
        {formattedCellData}
      </Typography>
    );
  };

  const height = useMemo(() => {
    return Math.min(ROW_HEIGHT * wells.length + HEADER_HEIGHT + EXTRA_HEIGHT, MAX_TABLE_HEIGHT);
  }, [wells]);

  const handleClickAsset = redirectAssetId => {
    onAddOffsetWell(redirectAssetId);
  };

  return (
    <>
      <div className={classes.tableContainer} style={{ height }}>
        <div className={classes.titleWrapper}>
          <Typography variant="body2" className={classes.tableTitle}>
            Well Names ({offsetWells.length})
          </Typography>
          <div className={classes.addWellInput}>
            <AssetSearch
              company={companyId}
              onClickAsset={handleClickAsset}
              isTablet={isTablet}
              isMobile={isMobile}
            />
          </div>
        </div>

        <div
          className={classes.tableTopBorder}
          ref={tableContainerRef}
          style={{ width: !isTablet && isMobile && tableWidth }}
        />
        <AutoSizer>
          {() => {
            return (
              <Table
                width={tableWidth}
                height={height}
                headerHeight={HEADER_HEIGHT}
                rowHeight={ROW_HEIGHT}
                rowCount={wells.length}
                rowGetter={({ index }) => wells[index]}
                className={classes.table}
              >
                {tableColumns.map(column => (
                  <Column
                    key={column.key}
                    width={columnWidthDict[column.key] || 200}
                    dataKey={column.key}
                    label={column.label}
                    headerRenderer={headerRenderer}
                    cellRenderer={cellRenderer}
                  />
                ))}
              </Table>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
}

WellsTable.propTypes = {
  open: bool.isRequired,
  subjectWell: shape({ id: number }),
  wells: arrayOf(shape({})).isRequired,
  offsetWells: arrayOf(shape({})).isRequired,
  metricsKeys: arrayOf(string).isRequired,
  isMetricsLoading: bool.isRequired,
  sortInfo: shape({
    key: string.isRequired,
    direction: number.isRequired,
  }).isRequired,
  onChangeMetricsKeys: func.isRequired,
  onAddOffsetWell: func.isRequired,
  onDeleteOffsetWell: func.isRequired,
  onAddAllOffsetWells: func.isRequired,
  onDeleteAllOffsetWells: func.isRequired,
  onSorting: func.isRequired,
  unusableWellAlarm: string.isRequired,
  dialogWidth: number,
  isMobile: bool.isRequired,
  isTablet: bool.isRequired,
  companyId: number.isRequired,
};

WellsTable.defaultProps = {
  subjectWell: null,
  dialogWidth: 0,
};

// NOTE: Monitor the dialog width for table cell width
function WithSizeMe(props) {
  return (
    <SizeMe monitorWidth>{({ size }) => <WellsTable dialogWidth={size.width} {...props} />}</SizeMe>
  );
}

export default memo(WithSizeMe);
