import { InputAdornment, makeStyles } from '@material-ui/core';
import {
  Layers as LayersIcon,
  LayersClear as LayersClearIcon
} from '@material-ui/icons';

import Select from './index';
import { SelectProps } from './types';

const useStyles = makeStyles(theme => ({
  emptyItem: { color: theme.palette.primary.text6 },
  formControlRoot: {
    '&:hover': {
      '& .MuiFormLabel-root': { color: theme.palette.primary.text6 },
      '& .MuiFormLabel-root.Mui-focused': { color: theme.palette.primary.main },
    },
    '& .MuiFormLabel-root': { color: theme.palette.primary.text6 },
    '& .MuiSelect-filled': { paddingLeft: 0 },
    '& .MuiSelect-select:focus': { backgroundColor: 'transparent' },
    '& .MuiFilledInput-root': {
      backgroundColor: '#FFFFFF10',
      '&:hover': { backgroundColor: '#FFFFFF20' },
      '&.Mui-disabled': { backgroundColor: '#FFFFFF10' },
    },
  },
}));

export const SelectFilterBy = <T extends unknown>(props: SelectProps<T>): JSX.Element => {
  const classes = useStyles();

  return (
    <Select
      disableUnderline
      displayEmpty
      FormControlProps={{
        variant: 'filled',
        classes: { root: classes.formControlRoot },
      }}
      renderValue={(value: any) => value ? value : <span className={classes.emptyItem}>None</span>}
      startAdornment={(
        <InputAdornment position="start">
          {props.value ? <LayersIcon /> : <LayersClearIcon />}
        </InputAdornment>
      )}
      { ...props }
    />
  );
};
