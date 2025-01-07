import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import classnames from 'classnames';

import { SelectorProps } from './types';
import { RenderedValue } from './RenderedValue';
import { useStyles, StyledCheckbox } from './styles';

export * from './types';

export function CustomSelector<Value extends string | number>({
  id,
  handleChange,
  label,
  value,
  options,
  disabled,
  testId,
  multiple,
  className,
}: SelectorProps<Value>) {
  const classes = useStyles();
  const isAllSelected = multiple && value.length >= options.length;

  const handleSelectChange = ({ target: { value } }) => {
    if (multiple) {
      if (value.includes('All')) {
        return handleChange(isAllSelected ? [] : options.map(option => option.value));
      }
      const newSelections = value.filter(item => item !== 'All');
      return handleChange(newSelections);
    }
    return handleChange(value);
  };

  const renderValue = value => {
    const option = multiple
      ? options.filter(item => value.includes(item.value))
      : options.find(item => item.value === value);
    return <RenderedValue option={option} />;
  };

  return (
    <FormControl className={classnames(classes.formControl, className)} disabled={disabled}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        data-testid={testId}
        fullWidth
        labelId={`${id}-label`}
        id={id}
        className={classes.multipleValueSelect}
        classes={{
          select: classes.multipleValueSelectLabel,
          icon: classes.multipleValueSelectIcon,
        }}
        value={value}
        onChange={handleSelectChange}
        renderValue={renderValue}
        multiple={multiple}
        MenuProps={{ classes: { paper: classes.paper } }}
      >
        {multiple && (
          <MenuItem className={classes.item} value="All" data-testid={`${testId}_item_all}`}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <StyledCheckbox color="primary" checked={isAllSelected} />
            All
          </MenuItem>
        )}
        {options.map(item => (
          <MenuItem
            data-testid={`${testId}_item_${item.value}`}
            className={classes.item}
            key={item.value}
            value={item.value}
          >
            {multiple && (
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              /* @ts-ignore */
              <StyledCheckbox color="primary" checked={value.includes(item.value)} />
            )}
            {item.icon && <img src={item.icon} alt={item.label} width={18} />}
            <span>{item.label}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
