import { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
  makeStyles,
  Popover,
  TextField,
  MenuList,
} from '@material-ui/core';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import { isEqual } from 'lodash';

import {
  normalizeDropdownRangeString,
  parseDropdownRangeArray,
  parseDropdownRangeString,
} from '../../utils/dropdownRange';

const useStyles = makeStyles({
  selectFormControl: { marginBottom: 10 },
  popover: {
    height: 400,
    maxWidth: 500,
    maxHeight: '50vh',
  },
});

function DropdownRange(props) {
  const { paramList, paramName, label, value, onChange, error } = props; // value is an array of selected values
  const anchorEl = useRef(null);

  const [stages, setStages] = useState(value);
  const [inputValue, setInputValue] = useState(() => parseDropdownRangeArray(value));
  const [isOpen, setIsOpen] = useState(false);
  const isTouching = useRef(false);

  const classes = useStyles();

  const handleChange = e => {
    if (!paramList.length) {
      return;
    }

    const value = normalizeDropdownRangeString(e.target.value);
    setInputValue(value);
    setStages(parseDropdownRangeString(value));
  };

  const handleClick = (e, item) => {
    const newStages = [...stages];
    const index = newStages.indexOf(item.key);
    if (index > -1) {
      newStages.splice(index, 1);
    } else {
      newStages.push(item.key);
    }
    onChange(paramName, [...newStages]);
    setStages([...newStages]);
    const newText = parseDropdownRangeArray(newStages);
    setInputValue(newText);

    /* Fix scroll to the end */
    anchorEl.current.value = newText;
    anchorEl.current.scrollLeft = anchorEl.current.scrollWidth;
  };

  const handleBlur = () => {
    if (isTouching.current) {
      anchorEl.current.focus();
      return;
    }

    setIsOpen(false);
    if (!isEqual(stages, value)) {
      onChange(paramName, stages);
    }
    setInputValue(parseDropdownRangeArray(stages));
    anchorEl.current.blur();
  };

  const handleOpen = () => {
    if (!paramList.length) {
      return;
    }

    setIsOpen(true);
    anchorEl.current.focus();
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleBlur();
    }
  };

  useEffect(() => setStages(value), [value]);

  useEffect(() => {
    setInputValue(parseDropdownRangeArray(value));
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      anchorEl.current.focus();
    }
  });

  const handleTouch = () => (isTouching.current = true);
  const handleTouchEnd = () => (isTouching.current = false);

  return (
    <FormControl fullWidth classes={{ root: classes.selectFormControl }}>
      <Popover
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        disableBackdropClick
        anchorEl={anchorEl.current}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          horizontal: 'center',
        }}
        className={classes.popover}
      >
        <MenuList
          onMouseDown={handleTouch}
          onTouchStart={handleTouch}
          onMouseUp={handleTouchEnd}
          onTouchEnd={handleTouchEnd}
        >
          {paramList.map(item => (
            <MenuItem key={item.key} onClick={e => handleClick(e, item)}>
              <Checkbox checked={stages.includes(item.key)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
      <TextField
        InputProps={{
          endAdornment: isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />,
        }}
        inputProps={{
          onFocus: handleOpen,
          onBlur: handleBlur,
          style: { zIndex: 1000 },
        }}
        inputRef={anchorEl}
        label={label}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onClick={handleOpen}
        placeholder={paramList.length ? undefined : 'No options available'}
        onChange={handleChange}
        error={error}
        helperText={error}
      />
    </FormControl>
  );
}

DropdownRange.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  paramName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

DropdownRange.defaultProps = {
  error: undefined,
};

export default memo(DropdownRange);
