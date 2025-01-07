import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, clone, isEqual } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { Typography, IconButton, Checkbox, withStyles } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { SizeMe } from 'react-sizeme';

import { getUnitDisplay, convertValue } from '~/utils';

import SubjectIndicator from './SubjectIndicator';
import MetricsAddMenu from './MetricsAddMenu';
import MetricsSelect from './MetricsSelect';
import { TABLE_COLUMNS, METRICS_LIST, METRICS_KEYS, SETTINGS_COLUMN } from '../../constants';

export const ROW_HEIGHT = 48;
export const HEADER_HEIGHT = 44;

const PAGE_NAME = 'WellsTable';

const muiStyles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '15px',
    marginTop: '16px',
  },
  tableWrapper: {
    marginTop: '24px',
    overflowX: 'auto',
    overflowY: 'hidden',
    position: 'relative',
    height: 2000,
    minHeight: 150,
    borderTop: '1px solid rgba(81, 81, 81, 1)',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      textTransform: 'none',
      borderBottom: theme.isLightTheme
        ? '1px solid rgba(224, 224, 224, 1)'
        : '1px solid rgba(81, 81, 81, 1)',
    },
    '& .ReactVirtualized__Table__row': {
      borderBottom: theme.isLightTheme
        ? '1px solid rgba(224, 224, 224, 1)'
        : '1px solid rgba(81, 81, 81, 1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
      },
    },
    '& .ReactVirtualized__Table__Grid': {
      outline: 'none',
    },
    '& .ReactVirtualized__Table__headerColumn': {
      outline: 'none',
    },
  },
  cell: {
    color: 'rgba(255, 255, 255, 0.54)',
    padding: '5px 10px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  nameWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  nameCell: {
    padding: 0,
  },
  unitCell: {
    padding: 0,
  },
  tableRowHoverEnabled: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  settingsCell: {
    textAlign: 'right',
  },
  rigReleaseCell: {
    whiteSpace: 'nowrap',
  },
  nameCheckBox: {
    color: theme.palette.primary.main,
  },
  bodyCell: {
    fontSize: '0.90rem',
    padding: '5px 10px',
  },
  metricsCellWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },
  tableTitle: {
    fontSize: '16px',
    lineHeight: '140.6%',
    marginTop: 10,
  },
  tableTitleItems: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addWellInput: {
    width: 300,
    marginTop: 10,
  },
  sortIconButton: {
    padding: '8px',
    '&:hover $sortIcon': {
      color: '#fff',
    },
  },
  ascendingSortIcon: {
    transform: 'scaleY(-1)',
  },
  sortIcon: {
    fontSize: '14px',
    color: '#BDBDBD',
  },
  metricsColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  tableCellLabel: {
    fontSize: '0.90rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#fff',
  },
  tableCellLabelDisabled: {
    color: '#C4C4C4',
  },
  errorMsg: {
    color: '#C4C4C4',
    fontStyle: 'italic',
    fontSize: '14px',
    padding: '0 16px',
    whiteSpace: 'nowrap',
  },
});

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

/* eslint-disable react/no-array-index-key */
function WellsTable({
  subjectWell,
  wells,
  offsetWells,
  metricsKeys,
  isMetricsLoading,
  sortInfo,
  unusableWellAlarm,
  dialogWidth,
  classes,
  onChangeMetricsKeys,
  onAddOffsetWell,
  onDeleteOffsetWell,
  onAddAllOffsetWells,
  onDeleteAllOffsetWells,
  onSorting,
}) {
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
    return Object.values(columnWidthDict).reduce((result, item) => result + item, 0);
  }, [columnWidthDict]);

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
        data-testid={`${PAGE_NAME}_sortRemove`}
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
        <div
          data-testid={`${PAGE_NAME}_wellHeader`}
          className={classes.nameWrapper}
        >
          <Checkbox
            data-testid={`${PAGE_NAME}_selectAll`}
            classes={{
              checked: classes.nameCheckBox,
              indeterminate: classes.nameCheckBox,
            }}
            onClick={handleToggleWells}
            checked={isAllUsableWellsSelected}
            indeterminate={offsetWells.length > 0 && !isAllUsableWellsSelected}
            size="small"
          />
          <Typography className={classNames(classes.cell, classes.nameCell)}>
            {label}
          </Typography>
          {sortIconRenderer(dataKey)}
        </div>
      );
    }

    // metrics columns
    if (metricsKeys.includes(dataKey)) {
      const currentMetric = metricsColumns.find(item => item.key === dataKey);
      const metricIndex = metricsColumns.findIndex(item => item.key === dataKey);
      return (
        <div
          data-testid={`${PAGE_NAME}_header_${dataKey}`}
          className={classes.metricsColumn}
        >
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
      <div
        data-testid={`${PAGE_NAME}_header_${label}`}
        className={classes.nameWrapper}
      >
        <Typography className={classes.cell}>{label}</Typography>
        {sortIconRenderer(dataKey)}
      </div>
    );
  };

  const cellRenderer = ({ rowData: well, dataKey }) => {
    if (dataKey === 'name') {
      return (
        <div
          data-testid={`${PAGE_NAME}_row_${well.name}`}
          className={classes.nameWrapper}
        >
          <Checkbox
            data-testid={`${PAGE_NAME}_wellCheckbox`}
            color="primary"
            checked={offsetWells.findIndex(offsetWell => offsetWell.id === well.id) > -1}
            onChange={e => handleToggleWell(well.id, e.target.checked)}
            size="small"
            disabled={!well.is_usable}
          />

          <Typography
            data-testid={`${PAGE_NAME}_wellName`}
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
        data-testid={`${PAGE_NAME}_cell}`}
        className={classNames(classes.cell, classes.tableCellLabel, {
          [classes.tableCellLabelDisabled]: !well.is_usable,
        })}
      >
        {formattedCellData}
      </Typography>
    );
  };

  return (
    <>
      <div className={classes.tableWrapper}>
        <AutoSizer>
          {({ height }) => (
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
          )}
        </AutoSizer>
      </div>
    </>
  );
}

WellsTable.propTypes = {
  subjectWell: PropTypes.shape({
    id: PropTypes.number,
  }),
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  offsetWells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  isMetricsLoading: PropTypes.bool.isRequired,
  sortInfo: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.number.isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  onChangeMetricsKeys: PropTypes.func.isRequired,
  onAddOffsetWell: PropTypes.func.isRequired,
  onDeleteOffsetWell: PropTypes.func.isRequired,
  onAddAllOffsetWells: PropTypes.func.isRequired,
  onDeleteAllOffsetWells: PropTypes.func.isRequired,
  onSorting: PropTypes.func.isRequired,
  unusableWellAlarm: PropTypes.string.isRequired,
  dialogWidth: PropTypes.number,
  // isAdvancedSearch: PropTypes.bool,
};

WellsTable.defaultProps = {
  subjectWell: null,
  dialogWidth: 0,
  // isAdvancedSearch: false,
};

// NOTE: Monitor the dialog width for table cell width
function WithSizeMe(props) {
  return (
    <SizeMe monitorWidth>{({ size }) => <WellsTable dialogWidth={size.width} {...props} />}</SizeMe>
  );
}

export default withStyles(muiStyles)(memo(WithSizeMe));
