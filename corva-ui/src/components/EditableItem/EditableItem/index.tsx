import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  ClickAwayListener,
  InputAdornment,
  TextField,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles(theme => ({
  editableItem: {
    width: '100%',
    height: 36,
    position: 'relative',
    backgroundColor: theme.palette.background.b8,
    '&:hover': {
      backgroundColor: 'rgba(3, 188, 212, 0.07)',
    },
    '&:hover svg': {
      visibility: 'visible',
    },
  },
  editableItemActive: {
    backgroundColor: 'rgba(3, 188, 212, 0.15)  !important',
  },
  value: {
    color: theme.palette.primary.text6,
    fontSize: '0.875rem',
    height: '100%',
    letterSpacing: '.13132px',
    lineHeight: '36px',
    overflow: 'hidden',
    paddingLeft: 48,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 'calc(100% - 32px)',
    userSelect: 'none',
  },
  textField: {
    width: '100%',
  },
  inputRoot: {
    height: 36,
    paddingLeft: 48,
    fontSize: '0.875rem',
  },
  inputDisabled: {
    backgroundColor: 'unset',
    paddingRight: 16,
    '&::before': {
      display: 'none',
    },
    pointerEvents: 'none',
  },
  // TODO: remove icon styles when Icon component is implemented
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
    '&:target': {
      backgroundColor: theme.palette.background.b9,
    },
  },
  iconPrimary: {
    color: theme.palette.primary.main,
  },
  iconPrimaryDisabled: {
    color: theme.palette.primary.main,
    opacity: 0.4,
    cursor: 'default',
    pointerEvents: 'none',
  },
  iconClose: {
    fill: `${theme.palette.primary.text6} !important`,
    '&:hover': {
      fill: '#FFFFFF !important',
    },
  },
  iconEdit: {
    position: 'absolute',
    right: 4,
    top: 3,
    visibility: 'hidden',
  },
  inputAdornment: {
    marginTop: 1,
    marginRight: 4,
  },
}));

type EditableItemProps = PropTypes.InferProps<typeof editableItemPropTypes>;

const EditableItem = ({
  className,
  isEditable,
  isEditing: isEditingInitial,
  onClick,
  onClickAway,
  onCancel,
  onSave,
  value: initialValue,
}: EditableItemProps): JSX.Element => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(isEditingInitial);

  const classes = useStyles();

  const handleSave = e => {
    e.stopPropagation();
    if (!value.length) return;

    if (value !== initialValue) onSave(value).then(() => setIsEditing(false));
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setValue(initialValue);
        setIsEditing(false);
        onClickAway();
      } else if (e.key === 'Enter') {
       handleSave(e);
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, initialValue, value]);

  const handleClickAway = () => {
    setValue(initialValue);
    setIsEditing(false);
    onClickAway();
  };

  const handleCancel = e => {
    e.stopPropagation();
    setValue(initialValue);
    setIsEditing(false);
    onCancel();
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = e => {
    e.stopPropagation();
    setValue(e.target.value);
  };

  const handleEdit = e => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const getInputAdornment = () => {
    if (!isEditing) return null;

    return (
      <InputAdornment position="end">
        <span className={classes.inputAdornment}>
          <Tooltip title="Cancel" placement="bottom-end">
            <CloseIcon
              className={classNames(classes.icon, classes.iconClose)}
              onClick={handleCancel}
              fontSize="small"
            />
          </Tooltip>
          <Tooltip title="Save" placement="bottom-end">
            {/*@ts-ignore*/}
            <DoneIcon
              color={value === initialValue ? 'disabled' : 'primary'}
              onClick={handleSave}
              fontSize="small"
              disabled={value === initialValue}
              classes={{
                root: classes.icon,
                colorPrimary: classes.iconPrimary,
                colorDisabled: classes.iconPrimaryDisabled,
              }}
            />
          </Tooltip>
        </span>
      </InputAdornment>
    );
  };

  const editableInputClassName = classNames(
    classes.editableItem,
    {
      [classes.editableItemActive]: isEditing,
    },
    className
  );

  return (
    <div className={editableInputClassName} onClick={onClick}>
      {!isEditing && <div className={classes.value}>{value}</div>}
      {isEditing && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            autoFocus
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Page Name..."
            className={classes.textField}
            InputProps={{
              classes: {
                root: classes.inputRoot,
              },
              endAdornment: getInputAdornment(),
            }}
          />
        </ClickAwayListener>
      )}
      {isEditable && !isEditing && (
        <Tooltip title="Rename Page" placement="bottom-end">
          <EditIcon
            className={classNames(classes.icon, classes.iconEdit)}
            onClick={handleEdit}
            fontSize="small"
          />
        </Tooltip>
      )}
    </div>
  );
};

const editableItemPropTypes = {
  className: PropTypes.string,
  isEditable: PropTypes.bool,
  isEditing: PropTypes.bool,
  onClick: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onClickAway: PropTypes.func,
  onCancel: PropTypes.func,
  value: PropTypes.string.isRequired,
};

EditableItem.propTypes = editableItemPropTypes;

EditableItem.defaultProps = {
  className: '',
  isEditable: true,
  isEditing: false,
  onClick: () => {},
  onClickAway: () => {},
  onCancel: () => {},
};

export default EditableItem;
