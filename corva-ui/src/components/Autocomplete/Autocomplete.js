import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, get, identity } from 'lodash';
import { makeStyles } from '@material-ui/core';
import MaterialAutocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '../Tooltip';

const getAddedValue = value => `Create "${value}"`;
const getUpdateValue = value => get(get(value.split('Create "'), '1', '').split('"'), '0', '');

const useStyles = makeStyles(theme => ({
  root: {
    width: 200,
  },
  paper: {
    maxHeight: 400,
    boxShadow:
      '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
  },
  createLabel: {
    fontSize: '16px',
    lineHeight: '22.5px',
    color: theme.palette.primary.main,
  },
  openIcon: {
    marginLeft: 5,
  },
  option: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
}));

const Autocomplete = ({
  isCreatable,
  options: inputOptions,
  value: inputValue,
  getOptionLabel,
  onInputChange,
  onChange,
  renderOption,
  classes: customClasses,
  ...restProps
}) => {
  const classes = useStyles();
  const initialOptions = useMemo(
    () => inputOptions?.map(item => (isCreatable ? getOptionLabel(item) : item)),
    [inputOptions]
  );
  const value = useMemo(
    () => (isCreatable ? getOptionLabel(inputValue) || '' : inputValue),
    [inputValue]
  );
  const [options, setOptions] = useState(initialOptions);
  const [addedValue, setAddedValue] = useState(null);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const handleInputChange = newValue => {
    if (newValue === '') {
      setAddedValue(null);
      setOptions(initialOptions);
    } else if (!initialOptions.find(item => item === newValue)) {
      // if input value not matches any option add Create option
      const newAddedValue = getAddedValue(newValue);
      setAddedValue(newAddedValue);
      setOptions([...initialOptions, newAddedValue]);
    } else {
      // if any option include input value remove Create option
      const filteredInitialOptions = initialOptions.filter(option => !option.includes(`Create "`));
      setOptions(filteredInitialOptions);
    }
  };

  const handleChangeValue = newValue => {
    if (newValue?.includes('Create "') && getOptionLabel(newValue) === getOptionLabel(addedValue)) {
      setAddedValue(null);
      const updatedValue = getUpdateValue(addedValue);
      setOptions([...initialOptions, updatedValue]);
      onChange(updatedValue, true);
    } else {
      onChange(newValue, false);
    }
  };

  return (
    <MaterialAutocomplete
      value={value}
      onChange={isCreatable ? (_, newValue) => handleChangeValue(newValue) : onChange}
      onInputChange={isCreatable ? (_, newValue) => handleInputChange(newValue) : onInputChange}
      options={options}
      getOptionLabel={isCreatable ? item => item : getOptionLabel}
      renderOption={
        isCreatable
          ? props => {
              const updateValue = getUpdateValue(props);

              return (
                <Tooltip title={props}>
                  <div
                    className={classNames(
                      { [classes.createLabel]: updateValue && props !== updateValue },
                      classes.option,
                      customClasses?.optionLabelClass
                    )}
                  >
                    {props}
                  </div>
                </Tooltip>
              );
            }
          : renderOption
      }
      classes={{
        root: classNames(classes.root, customClasses?.root),
        paper: classNames(classes.paper, customClasses?.paper),
        popupIndicator: classes.openIcon,
        ...customClasses,
      }}
      closeIcon={(value || addedValue) && <CloseIcon className={classes.closeIcon} />}
      {...restProps}
    />
  );
};

Autocomplete.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired,
  options: PropTypes.shape([]).isRequired,
  isCreatable: PropTypes.bool,
  getOptionLabel: PropTypes.func,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  renderOption: PropTypes.func,
  classes: PropTypes.shape(),
};

Autocomplete.defaultProps = {
  isCreatable: false,
  onChange: noop,
  getOptionLabel: identity,
  onInputChange: noop,
  renderOption: identity,
  classes: {},
};

export default Autocomplete;
