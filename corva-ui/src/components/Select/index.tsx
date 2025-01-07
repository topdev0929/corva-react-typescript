import { useMemo } from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  FormHelperText,
  makeStyles,
} from '@material-ui/core';
import uuidV4 from 'uuid/v4';
import classNames from 'classnames';
import { SelectProps } from './types';

const DISABLED_OPACITY = '0.4';

const useStyles = makeStyles(theme => ({
  formControlRoot: {
    '&:hover': {
      '& .MuiFormLabel-root, & .MuiInputAdornment-root, & .MuiSvgIcon-root.MuiSelect-icon': {
        color: theme.palette.primary.contrastText,
      },
      '& .MuiInput-underline:not(.Mui-disabled), & .MuiFilledInput-underline:not(.Mui-disabled)': {
        '&::before': {
          borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
        },
      },
    },
    '& .MuiInputBase-root.Mui-focused': {
      '& .MuiSvgIcon-root.MuiSelect-icon': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiInput-underline, & .MuiFilledInput-underline': {
      '&::before': {
        borderBottom: `1px solid ${theme.palette.primary.text6}`,
      },
      '&.Mui-disabled': {
        '&::before': {
          opacity: DISABLED_OPACITY,
          borderBottom: `1px solid ${theme.palette.primary.text6}`,
        },
        '&::after': {
          opacity: DISABLED_OPACITY,
        },
      },
    },
    '& .MuiSelect-root': {
      '&.Mui-disabled': {
        color: theme.palette.primary.contrastText,
        opacity: DISABLED_OPACITY,
      },
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.primary.text6,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.Mui-disabled.MuiInputLabel-root': {
        color: theme.palette.primary.text6,
        opacity: DISABLED_OPACITY,
      },
    },
    '& .MuiSelect-icon.Mui-disabled': {
      color: theme.palette.primary.contrastText,
      opacity: DISABLED_OPACITY,
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.primary.text6,
      '&.Mui-disabled': {
        opacity: DISABLED_OPACITY,
      },
    },
    '& .MuiFilledInput-root': {
      backgroundColor: theme.palette.background.b6,
      '&:hover': {
        backgroundColor: theme.palette.background.b7,
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.background.b6,
        opacity: DISABLED_OPACITY,
      },
    },
    '& .MuiInputLabel-filled': {
      left: 2,
    },
    '& .MuiSelect-filled': {
      paddingLeft: 14,
    },
    '& .MuiSvgIcon-root.MuiSelect-icon': {
      color: theme.palette.primary.text6,
    },
    '& .MuiInputBase-root': {
      '& .MuiInputAdornment-root': {
        color: theme.palette.primary.text6,
        '& svg': {
          height: 16,
          width: 16,
        },
      },
      '&.Mui-error': {
        '& .MuiInputAdornment-root': { color: theme.palette.error.main },
      },
      '&.Mui-disabled': {
        '& .MuiInputAdornment-root': { opacity: DISABLED_OPACITY },
      },
      '&.Mui-focused': {
        '& .MuiInputAdornment-root': { color: theme.palette.primary.main },
      },
    },
  },
  menuList: {
    backgroundColor: theme.palette.background.b9,
    '& .MuiMenuItem-root': {
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.text9,
      },
    },
  },
  error: {
    '&:hover': {
      '& .MuiInput-underline, & .MuiFilledInput-underline': {
        '&::after': {
          borderBottom: `2px solid ${theme.palette.error.main}`,
        },
      },
      '& .MuiInput-underline.Mui-disabled, & .MuiFilledInput-underline.Mui-disabled': {
        '&::before': {
          borderBottom: `1px solid ${theme.palette.error.main}`,
        },
        '&::after': {
          display: 'none',
        },
      },
      '& .MuiOutlinedInput-root.Mui-error:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
    '& .MuiFormLabel-root.MuiInputLabel-root': {
      color: theme.palette.error.main,
      '&.Mui-focused': {
        color: theme.palette.error.main,
      },
      '&.Mui-disabled': {
        color: theme.palette.error.main,
      },
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.error.main,
    },
    '& .MuiInput-underline, & .MuiFilledInput-underline': {
      '&::after': {
        borderBottom: `1px solid ${theme.palette.error.main}`,
      },
      '&.Mui-disabled::after': {
        display: 'none',
      },
      '&.Mui-disabled::before': {
        borderBottom: `1px solid ${theme.palette.error.main}`,
      },
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
      opacity: DISABLED_OPACITY,
    },
  },
}));

const Select = <T extends unknown>(props: SelectProps<T>): JSX.Element => {
  const { FormControlProps, InputLabelProps, label, formHelperText, ...SelectProps } = props;

  const labelId: string = useMemo(uuidV4, []);

  const styles = useStyles();

  return (
    <FormControl
      {...FormControlProps}
      classes={{
        ...FormControlProps.classes,
        root: classNames(FormControlProps.classes?.root, styles.formControlRoot, {
          [styles.error]: SelectProps.error,
        }),
      }}
      disabled={FormControlProps.disabled || SelectProps.disabled}
    >
      {label && (
        <InputLabel id={labelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      <MuiSelect
        {...SelectProps}
        labelId={labelId}
        // NOTE: label should be explicitly set for outlined select
        // https://github.com/mui-org/material-ui/issues/14530#issuecomment-620974845
        label={label}
        MenuProps={{
          ...SelectProps?.MenuProps,
          classes: {
            ...SelectProps?.MenuProps?.classes,
            paper: SelectProps?.MenuProps?.classes?.paper,
            list: classNames(SelectProps?.MenuProps?.classes?.list, styles.menuList),
          },
        }}
      />
      {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
    </FormControl>
  );
};

Select.defaultProps = {
  FormControlProps: {},
  InputLabelProps: {},
  label: null,
  formHelperText: null,
  error: false,
};

export default Select;
