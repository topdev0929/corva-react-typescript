import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import { IconButton, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import CustomizeColumnsDialog from './CustomizeColumnsDialog';
import StyledVirtualizedTable from './VirtualizedTable';

const useStyles = makeStyles({
  vtTopSetting: {
    position: 'relative',
    height: '25px',
  },
  vtTopSettingIcon: {
    position: 'fixed',
    right: '20px',
    padding: '3px',
    fontSize: '20px',
  },
});

function VTableComponent({
  columns,
  useColumnSetting,
  savedColumns,
  onChangeColumns,
  customMuiStyles,
  ...otherProps
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  // NOTE: Validate and adjust the stored columns
  const adjustedColumns = useMemo(() => {
    const result = [];

    // NOTE: Check if stored columns are still valid
    savedColumns.forEach(savedColumn => {
      const foundColumn = columns.find(column => column.key === savedColumn.key);
      if (foundColumn) {
        result.push({
          ...foundColumn,
          show: savedColumn.show,
        });
      }
    });

    // NOTE: Add modified or new columns
    columns.forEach(column => {
      const existingColumn = result.find(item => item.key === column.key);
      if (!existingColumn) {
        result.push(column);
      }
    });

    return result;
  }, [columns, savedColumns]);

  const settingRowHeight = useColumnSetting && showSetting ? 25 : 0;

  return (
    <>
      {useColumnSetting && showSetting && (
        <div className={classes.vtTopSetting}>
          <IconButton
            size="small"
            className={classes.vtTopSettingIcon}
            onClick={() => setOpen(true)}
          >
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        </div>
      )}
      <AutoSizer>
        {({ width, height }) => (
          <StyledVirtualizedTable
            width={width}
            height={height - settingRowHeight}
            columns={adjustedColumns}
            useColumnSetting={useColumnSetting}
            onOpenSettingDlg={() => setOpen(true)}
            showTopSettingIcon={bShow => setShowSetting(bShow)}
            customMuiStyles={customMuiStyles}
            {...otherProps}
          />
        )}
      </AutoSizer>

      <CustomizeColumnsDialog
        open={open}
        columns={adjustedColumns}
        handleCloseWithCancel={() => setOpen(false)}
        handleCloseWithOK={newColumns => {
          if (onChangeColumns) {
            onChangeColumns(newColumns);
          }
          setOpen(false);
        }}
      />
    </>
  );
}

VTableComponent.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  data: PropTypes.arrayOf(PropTypes.shape({})),
  useColumnSetting: PropTypes.bool,
  useFixedColumnWidth: PropTypes.bool,
  headerHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  // NOTE: Someone may need to modify some columns or add/delte some columns
  // So we should keep another array for the order and visibility of columns. 'savedColumns' is for it.
  savedColumns: PropTypes.arrayOf(PropTypes.shape({})),
  onChangeColumns: PropTypes.func,
  customMuiStyles: PropTypes.shape({}),
  isTopSettingIconShownAlways: PropTypes.bool,
  CustomCellRenderer: PropTypes.func,
  customRowStyle: PropTypes.func,

  // NOTE: Sortable feature
  sort: PropTypes.func,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
};

VTableComponent.defaultProps = {
  columns: [],
  data: [],
  useColumnSetting: false,
  useFixedColumnWidth: false,
  headerHeight: 50,
  rowHeight: 35,
  savedColumns: [],
  onChangeColumns: null,
  customMuiStyles: {},
  isTopSettingIconShownAlways: false,
  CustomCellRenderer: null,
  customRowStyle: null,
  sort: null,
  sortBy: null,
  sortDirection: null,
};
export default VTableComponent;
