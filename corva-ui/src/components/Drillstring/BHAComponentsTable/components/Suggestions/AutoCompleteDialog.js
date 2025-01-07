import { memo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Radio,
  Tooltip,
  makeStyles,
  TableContainer,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { getUnitDisplay } from '~/utils';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    background: ({ isMobile }) =>
      isMobile ? theme.palette.background.b5 : theme.palette.background.b9,
  },
  titleWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
  },
  title: {
    fontWeight: 400,
  },
  closeIconButton: {
    fontSize: 20,
    padding: 4,
    '&:hover $closeIcon': {
      color: theme.palette.action.active,
    },
  },
  closeIcon: {
    color: theme.palette.primary.text6,
  },
  dialogContent: {
    display: 'flex',
    overflow: 'hidden',
    background: ({ isMobile }) =>
      isMobile ? theme.palette.background.b5 : theme.palette.background.b9,
  },
  dialogActions: {
    paddingTop: 8,
    paddingBottom: 40,
    background: ({ isMobile }) =>
      isMobile ? theme.palette.background.b5 : theme.palette.background.b9,
  },
  tableContainer: {
    flex: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
  },
  headerCell: {
    padding: '8px 5px',
    background: ({ isMobile }) =>
      isMobile ? theme.palette.background.b5 : theme.palette.background.b9,
    color: theme.palette.primary.text7,
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '14px',
    verticalAlign: 'middle',
    borderTop: '1px solid #5c5c5c',
    maxWidth: '100px',
  },
  cell: {
    padding: '0 8px',
    fontSize: '14px',
    lineHeight: '20px',
    background: ({ isMobile }) =>
      isMobile ? theme.palette.background.b5 : theme.palette.background.b9,
  },
  actionHeadCell: {
    zIndex: 12,
  },
  actionCell: {
    position: 'sticky',
    left: 0,
    zIndex: 2,
  },
  shadow: {
    position: 'sticky',
    zIndex: 10,
    height: 0,
    border: 0,
    padding: 0,
    margin: 0,
    '&::after': {
      content: "' '",
      pointerEvents: 'none',
      position: 'absolute',
      height: '16px',
      left: 0,
      right: 0,
    },
  },
  topShadow: {
    top: '48px',
    '&::after': {
      background: ({ isMobile }) =>
        isMobile
          ? `linear-gradient(0deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b5} 100%)`
          : `linear-gradient(0deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
  bottomShadow: {
    bottom: '16px',
    '&::after': {
      background: ({ isMobile }) =>
        isMobile
          ? `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b5} 100%)`
          : `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
}));

function AutoCompleteDialog({ isMobile, data, columns, onClose, onSelect }) {
  const classes = useStyles({ isMobile });
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const handleSelectRow = rowIndex => {
    setSelectedRowIndex(rowIndex);
  };

  const handleSave = () => {
    onSelect(data[selectedRowIndex]);
  };

  /* eslint-disable react/no-array-index-key */
  return (
    <Dialog
      open
      maxWidth="lg"
      onBackdropClick={onClose}
      onEscapeKeyDown={onClose}
      fullScreen={isMobile}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div className={classes.titleWrapper}>
          <span className={classes.title}>AutoComplete Items</span>
          <Tooltip title="Close">
            <IconButton
              data-not-migrated-muiiconbutton
              aria-label="close"
              className={classes.closeIconButton}
              onClick={onClose}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small" aria-label="autocomplete items">
            <TableHead>
              <TableRow>
                <TableCell className={classNames(classes.headerCell, classes.actionHeadCell)}>
                  Action
                </TableCell>
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    className={classes.headerCell}
                    style={{ minWidth: column.width }}
                    align={columnIndex === columns.length - 1 ? 'right' : 'left'}
                  >
                    {column.label} {column.unitType && `(${getUnitDisplay(column.unitType)})`}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan="100%"
                    className={classNames(classes.shadow, classes.topShadow)}
                  />
                </TableRow>
              )}
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className={classNames(classes.cell, classes.actionCell)}>
                    <Radio
                      color="primary"
                      checked={rowIndex === selectedRowIndex}
                      onChange={() => handleSelectRow(rowIndex)}
                      value={rowIndex}
                    />
                  </TableCell>
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={column.key}
                      className={classes.cell}
                      align={columnIndex === columns.length - 1 ? 'right' : 'left'}
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {data.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan="100%"
                    className={classNames(classes.shadow, classes.bottomShadow)}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedRowIndex < 0}
          onClick={handleSave}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AutoCompleteDialog.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default memo(AutoCompleteDialog);
