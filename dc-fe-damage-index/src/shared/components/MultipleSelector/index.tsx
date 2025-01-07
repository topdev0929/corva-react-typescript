import { Divider, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import TruncatedText from '@corva/ui/components/TruncatedText';

import { DropdownFilterProps } from './types';
import { RenderedValue } from './RenderedValue';
import { StyledCheckbox, useStyles } from './styles';

export * from './types';

export function MultipleSelector<Value extends string | number>({
  filterKey,
  handleChange,
  label,
  value,
  options,
  disabled,
}: DropdownFilterProps<Value>) {
  const classes = useStyles();
  const isAllSelected = value.length >= options.length;

  const handleSelectChange = ({ target: { value: selections } }) => {
    if (selections.includes('All')) {
      if (isAllSelected) return handleChange([]);
      return handleChange(options.map(option => option.value));
    }
    const newSelections = selections.filter(item => item !== 'All');
    return handleChange(newSelections);
  };

  const renderValue = value => {
    return <RenderedValue value={value} />;
  };

  return (
    <FormControl className={classes.formControl} disabled={disabled}>
      <InputLabel id={`dropdown-filter-${filterKey}-label`}>{label}</InputLabel>
      <Select
        labelId={`dropdown-filter-${filterKey}-label`}
        id={`dropdown-filter-${filterKey}`}
        className={classes.multipleValueSelect}
        classes={{
          select: classes.multipleValueSelectLabel,
          icon: classes.multipleValueSelectIcon,
        }}
        value={value}
        multiple
        onChange={handleSelectChange}
        renderValue={renderValue}
        MenuProps={{ classes: { paper: classes.paper } }}
      >
        <MenuItem className={classes.item} value="All">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <StyledCheckbox color="primary" checked={isAllSelected} />
          All
        </MenuItem>
        <Divider />
        {options.map(item => (
          <MenuItem className={classes.item} key={item.value} value={item.value}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <StyledCheckbox color="primary" checked={value.includes(item.value)} />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <TruncatedText className={classes.itemText}>
              <span>{item.label}</span>
              {item.suffix && <span className={classes.itemSuffix}>&nbsp;{item.suffix}</span>}
            </TruncatedText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
