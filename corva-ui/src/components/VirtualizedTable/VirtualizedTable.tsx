import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Column, Table, SortDirection } from 'react-virtualized';
import { Typography, IconButton, Tooltip, withStyles } from '@material-ui/core';
import {
  Settings as SettingsIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Sort as SortIcon,
} from '@material-ui/icons';

import { getUnitDisplay } from '../../utils/convert';

const DEFAULT_COLUMN_MIN_WIDTH = 65;

const muiStyles = theme => ({
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
    },
    '& .ReactVirtualized__Table__Grid': {
      outline: 'none',
    },
    '& .ReactVirtualized__Table__headerColumn': {
      outline: 'none',
    },
  },
  oddRow: {
    backgroundColor: theme.isLightTheme ? 'rgba(189, 189, 189, 0.1)' : '#303030',
  },
  headerLabel: {
    lineHeight: '14px',
    fontSize: '12px',
    fontStyle: 'normal',
    letterSpacing: '-0.25px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cellData: {
    lineHeight: '14px',
    fontSize: '12px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: '0.15px',
  },
  unitLabel: {
    fontSize: '10px',
    opacity: 0.5,
  },
  settingIcon: {
    padding: '3px',
    fontSize: '20px',
  },
  sortIcon: {
    fontSize: '16px',
  },
});

function getUnitText(columns, dataKey) {
  const { unitType, customUnit } = columns.find(column => column.key === dataKey) || {};
  if (customUnit) {
    return `(${customUnit})`;
  }

  if (unitType) {
    return `(${getUnitDisplay(unitType)})`;
  }

  return '';
}

function getHeaderLabelClassName(columns, dataKey) {
  const { headerLabelClassName } = columns.find(column => column.key === dataKey) || {};
  return headerLabelClassName || '';
}

function getHeaderLabelUnitClassName(columns, dataKey) {
  const { headerLabelUnitClassName } = columns.find(column => column.key === dataKey) || {};
  return headerLabelUnitClassName || '';
}

const SETTING_COLUMN_WIDTH = 25;

type VirtualizedTableComponentProps = PropTypes.InferProps<typeof virtualizedTableComponentPropTypes>;

export const VirtualizedTableComponent = ({
  columns,
  data,
  useColumnSetting,
  useFixedColumnWidth,
  onOpenSettingDlg,
  classes,
  width,
  height,
  headerHeight,
  rowHeight,
  showTopSettingIcon,
  customMuiStyles,
  isTopSettingIconShownAlways,
  CustomCellRenderer,
  customRowStyle,
  sort,
  sortBy,
  sortDirection,
}: VirtualizedTableComponentProps): JSX.Element => {
  const appliedClasses = { ...classes, ...customMuiStyles };
  const settingColumn = useMemo(() => {
    return {
      label: '',
      key: 'setting',
      width: useColumnSetting ? SETTING_COLUMN_WIDTH : 0,
    };
  }, [useColumnSetting]);

  const visibleColumns = useMemo(() => {
    return columns.filter(column => column.show);
  }, [columns]);

  // NOTE: Add setting column
  const tableColumns = useMemo(() => {
    return useColumnSetting ? [...visibleColumns, settingColumn] : visibleColumns;
  }, [visibleColumns, useColumnSetting, settingColumn]);

  const columnWidthDict = useMemo(() => {
    if (width <= 0) {
      return {};
    }

    // NOTE: Reserve space for setting column
    const result = {
      [settingColumn.key]: settingColumn.width,
    };

    // NOTE: Keep the columns that had been adjusted due to expected width is smaller than min width
    const adjustedColumns = [];

    // NOTE: Give fixed width to the columns with "width" field
    visibleColumns
      .filter(column => Number.isFinite(column.width))
      .forEach(column => {
        result[column.key] = column.width - 1;
        adjustedColumns.push(column.width - 1);
      });

    visibleColumns
      .filter(column => !Number.isFinite(column.width))
      .forEach(column => {
        // NOTE: Width sum of adjusted columns
        const sumOfAdjustColumnWidth = adjustedColumns.reduce(
          (subResult, columnWidth) => subResult + columnWidth,
          0
        );
        // NOTE: Expected space for the column
        const calculatedWidth = Math.floor(
          (width - sumOfAdjustColumnWidth - settingColumn.width) /
            (visibleColumns.length - adjustedColumns.length)
        );

        const requiredWidth = column.minWidth || DEFAULT_COLUMN_MIN_WIDTH;
        const adjustedWidth = calculatedWidth < requiredWidth ? requiredWidth : calculatedWidth;
        result[column.key] = adjustedWidth - 1;
        adjustedColumns.push(adjustedWidth - 1);
      });

    return result;
  }, [width, visibleColumns, settingColumn]);

  // NOTE: Calculate table width from adjusted columns width
  const tableWidth = useMemo(() => {
    return Object.values(columnWidthDict).reduce((result, item) => result + item, 0);
  }, [columnWidthDict]);

  const isTopSettingIconShown =
    isTopSettingIconShownAlways || tableWidth - SETTING_COLUMN_WIDTH / 2 >= width;

  useEffect(() => {
    showTopSettingIcon(isTopSettingIconShown);
  }, [isTopSettingIconShown]);

  // NOTE: react-virtualzed table props
  const rowClassName = ({ index }) => {
    return classNames({
      [appliedClasses.oddRow]: index % 2 === 1,
    });
  };

  // NOTE: table header
  const headerRenderer = headerData => {
    const { label, dataKey } = headerData;

    const isSortable = sortBy || sortDirection || sort;

    if (dataKey === settingColumn.key) {
      return !isTopSettingIconShown ? (
        <IconButton
          size="small"
          aria-label="customize columns"
          className={appliedClasses.settingIcon}
          onClick={onOpenSettingDlg}
        >
          <SettingsIcon fontSize="inherit" />
        </IconButton>
      ) : null;
    }
    return (
      <Typography
        variant="body2"
        className={classNames(
          appliedClasses.headerLabel,
          getHeaderLabelClassName(columns, dataKey)
        )}
      >
        {label}&nbsp;
        <span
          className={classNames(
            appliedClasses.unitLabel,
            getHeaderLabelUnitClassName(columns, dataKey)
          )}
        >
          {getUnitText(columns, dataKey)}
        </span>
        {isSortable && dataKey !== sortBy && (
          <Tooltip title="Sort A-Z">
            <SortIcon fontSize="small" className={classes.sortIcon} />
          </Tooltip>
        )}
        {isSortable &&
          dataKey === sortBy &&
          (sortDirection === SortDirection.ASC ? (
            <ArrowUpwardIcon fontSize="small" className={classes.sortIcon} />
          ) : (
            <ArrowDownwardIcon fontSize="small" className={classes.sortIcon} />
          ))}
      </Typography>
    );
  };

  // NOTE: table body cells
  const cellRenderer = cellData => {
    const { dataKey, rowData } = cellData;
    if (CustomCellRenderer) {
      return <CustomCellRenderer columnKey={dataKey} value={rowData[dataKey]} />;
    }
    return (
      <Typography variant="body2" className={appliedClasses.cellData}>
        {rowData[dataKey]}
      </Typography>
    );
  };

  return (
    <>
      <Table
        width={useFixedColumnWidth ? tableWidth : width}
        height={height}
        headerHeight={headerHeight}
        rowClassName={rowClassName}
        rowHeight={rowHeight}
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        rowStyle={customRowStyle || {}} // Optional custom inline style
        className={appliedClasses.table}
        sort={sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
      >
        {tableColumns.map(column => (
          <Column
            key={column.key}
            width={columnWidthDict[column.key] || 0}
            dataKey={column.key}
            label={column.label}
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
          />
        ))}
      </Table>
    </>
  );
}

const virtualizedTableComponentPropTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    show: PropTypes.bool,
    minWidth: PropTypes.number,
    width: PropTypes.number,
    key: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  useColumnSetting: PropTypes.bool.isRequired,
  useFixedColumnWidth: PropTypes.bool.isRequired,
  headerHeight: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,

  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onOpenSettingDlg: PropTypes.func.isRequired,
  showTopSettingIcon: PropTypes.func.isRequired,

  sort: PropTypes.func,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,

  classes: PropTypes.shape({
    sortIcon: PropTypes.string,
  }).isRequired,

  customMuiStyles: PropTypes.shape({
    table: PropTypes.string,
    oddRow: PropTypes.string,
    headerLabel: PropTypes.string,
    cellData: PropTypes.string,
    unitLabel: PropTypes.string,
    settingIcon: PropTypes.string,
  }).isRequired,
  isTopSettingIconShownAlways: PropTypes.bool.isRequired,

  CustomCellRenderer: PropTypes.func,
  customRowStyle: PropTypes.func,
};

VirtualizedTableComponent.propTypes = virtualizedTableComponentPropTypes;

VirtualizedTableComponent.defaultProps = {
  CustomCellRenderer: null,
  customRowStyle: null,
  sort: null,
  sortBy: null,
  sortDirection: null,
};

//@ts-ignore
export default withStyles(muiStyles)(VirtualizedTableComponent);
