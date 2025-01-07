import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Tooltip, makeStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { FolderIcon } from './components';

const useStyles = makeStyles(theme => ({
  folderMenuItem: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.b8,
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '0.875rem',
    fontWeight: '500',
    height: 36,
    justifyContent: 'space-between',
    paddingLeft: 48,
    paddingRight: 4,
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: 'rgba(3, 188, 212, 0.07)',
    },
    '&:hover svg': {
      visibility: 'visible',
    },
  },
  folderMenuItemSelected: {
    backgroundColor: 'rgba(3, 188, 212, 0.15) !important',
    '&::before': {
      left: 0,
      height: '100%',
      width: 4,
      backgroundColor: theme.palette.primary.main,
      position: 'absolute',
      content: '""',
      borderRadius: '4px 0 0 4px',
    },
  },
  // TODO: remove icon styles when Icon is implemented
  icon: {
    boxSizing: 'content-box',
    cursor: 'pointer',
    color: theme.palette.primary.text6,
    padding: 7,
    fontSize: '1rem',
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: 'rgba(51, 51, 51, 0.9)',
      borderRadius: '50%',
    },
    '&:active': {
      backgroundColor: theme.palette.background.b9,
    },
  },
  addCircleIcon: {
    visibility: 'hidden',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  folderIcon: {
    position: 'absolute',
    left: 24,
    top: 8,
  },
  folderName: {
    overflow: 'hidden',
    marginRight: 4,
    height: '36px',
    lineHeight: '36px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    userSelect: 'none',
  },
}));

const FolderMenuItem = ({
  folderColor,
  isCreatable,
  isOpen,
  isSelected,
  name,
  onAdd,
  onClick,
  onToggle,
}) => {
  const classes = useStyles();

  const ToggleIcon = isOpen
    ? props => (
        // eslint-disable-next-line react/jsx-indent
        <Tooltip title="Collapse" placement="bottom-end">
          <ExpandLess {...props} />
        </Tooltip>
      )
    : ExpandMore;

  const handleAddItem = e => {
    e.stopPropagation();
    onAdd();
  };

  const handleToggle = e => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div
      className={classNames(
        classes.folderMenuItem,
        { [classes.folderMenuItemSelected]: isSelected },
      )}
      onClick={onClick}
    >
      <FolderIcon color={folderColor} isOpen={isOpen} className={classes.folderIcon} />
      <div className={classes.folderName}>{name}</div>
      <div className={classes.actions}>
        {isCreatable && (
          <Tooltip title="Add Page" placement="bottom-end">
            <AddCircleIcon
              fontSize="small"
              onClick={handleAddItem}
              className={classNames(classes.icon, classes.addCircleIcon)}
            />
          </Tooltip>
        )}
        <ToggleIcon fontSize="small" className={classNames(classes.icon, classes.toggleIcon)} onClick={handleToggle}/>
      </div>
    </div>
  );
};

FolderMenuItem.propTypes = {
  folderColor: PropTypes.string.isRequired,
  isCreatable: PropTypes.bool,
  isOpen: PropTypes.bool,
  isSelected: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

FolderMenuItem.defaultProps = {
  isCreatable: false,
  isOpen: false,
  isSelected: false,
};

export default FolderMenuItem;
