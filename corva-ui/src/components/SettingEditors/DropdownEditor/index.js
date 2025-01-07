import PropTypes from 'prop-types';
import {
  Select,
  Checkbox,
  MenuItem,
  InputLabel,
  FormControl,
  withStyles,
  FormHelperText,
} from '@material-ui/core';
import classNames from 'classnames';

const StyledCheckbox = withStyles({ root: { paddingLeft: '7px' } })(Checkbox);

function DropdownEditor({
  currentValue,
  defaultValue,
  options,
  placeholder,
  onChange,
  multiple,
  disabled,
  classes,
  renderValue,
  errorText,
  'data-testid': PAGE_NAME,
}) {
  const value = currentValue || defaultValue;
  const menuItemClassName = classNames(classes.menuItem, multiple && classes.multipleMenuItem);

  return (
    <FormControl className={classes.formControl} error={!!errorText}>
      <InputLabel shrink={value !== undefined}>{placeholder}</InputLabel>
      <Select
        data-testid={`${PAGE_NAME}_select`}
        value={value}
        onChange={e => onChange(e.target.value)}
        multiple={multiple}
        disabled={disabled}
        renderValue={renderValue}
        MenuProps={{
          className: classes.selectMenu,
          anchorOrigin: { vertical: 'top' },
        }}
        autoWidth
        displayEmpty
      >
        {options &&
          options.map(option => {
            return (
              <MenuItem
                data-testid={`${PAGE_NAME}_item_${option.label}MenuItem`}
                key={option.value}
                value={option.value}
                className={menuItemClassName}
              >
                {multiple && (
                  <StyledCheckbox color="primary" checked={value && value.includes(option.value)} />
                )}
                {option.label}
              </MenuItem>
            );
          })}
      </Select>
      {!!errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}

DropdownEditor.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  renderValue: PropTypes.func,
  errorText: PropTypes.string,
  'data-testid': PropTypes.string,
};

DropdownEditor.defaultProps = {
  currentValue: undefined,
  defaultValue: undefined,
  multiple: false,
  placeholder: 'Choose An Option',
  disabled: false,
  renderValue: undefined,
  errorText: '',
  'data-testid': 'DropdownEditor',
};

const muiStyles = {
  formControl: { minWidth: '200px', maxWidth: '200px', margin: '10px 20px 10px 0' },
  selectMenu: { maxHeight: '400px' },
  menuItem: { minWidth: '200px' },
  multipleMenuItem: { paddingLeft: '5px', minWidth: '200px' },
};

const StyledDropdownEditor = withStyles(muiStyles)(DropdownEditor);
export default StyledDropdownEditor;

/**
 * A High-Order Component that allows setting up an editor component
 * @param {Object[]} options - The array of dropdown options
 * @param {string|React.Element} options[].label - Label of dropdown option
 * @param {*} options[].value - Value of dropdown option.
 * @param {Object} dropdownProps - Passing additional props to dropdown component
 * @param {boolean} dropdownProps.multiple - Indicates using multiselect dropdown
 */
export const dropdownEditorForDefinitions =
  (options, dropdownProps = {}) =>
  props =>
    <StyledDropdownEditor {...props} {...dropdownProps} options={options} />;
