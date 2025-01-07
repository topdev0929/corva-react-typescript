import PropTypes from 'prop-types';

import { InputAdornment, TextField as MuiTextField, makeStyles } from '@material-ui/core';
import { useCustomShrink } from './effects';
import palette from '~/config/theme/palette.mjs';

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: 16,
    marginBottom: 8,
    '& .MuiFormLabel-root': {
      marginLeft: props => (props.startlabelOffset ? `${props.startlabelOffset + 8}px` : 0),
      marginRight: props => (props.endlabelOffset ? `${props.endlabelOffset + 8}px` : 0),
    },

    '&:hover': {
      '&.MuiTextField-root .MuiInput-root': {
        '& .MuiInputAdornment-root svg.MuiSvgIcon-root': {
          fill: palette.primary.contrastText,
        },
      },
    },

    '&.MuiTextField-root .MuiInput-root': {
      '& .MuiInputAdornment-root svg.MuiSvgIcon-root': {
        width: 16,
        height: 16,
        fontSize: 16,
        fill: '#DADADA',
      },
      '&.Mui-error .MuiInputAdornment-root svg.MuiSvgIcon-root': {
        fill: `${theme.palette.error.main} !important`,
      },
    },

    '& .Mui-focused .MuiInputAdornment-root svg.MuiSvgIcon-root': {
      fill: `${theme.palette.primary.main} !important`,
    },
  },
  shrunkLabel: {
    '&.MuiInputLabel-shrink.MuiFormLabel-root': {
      marginLeft: 0,
    },
  },
}));

const TextField = props => {
  const {
    startIcon,
    endIcon,
    onFocus,
    onBlur,
    InputProps,
    value,
    startAdornment,
    endAdornment,
    ...rest
  } = props;

  const {
    shrink,
    onInputFocus,
    onInputBlur,
    startlabelOffset,
    endlabelOffset,
    startAdornmentRef,
    endAdornmentRef,
  } = useCustomShrink({
    startIcon,
    endIcon,
    onFocus,
    onBlur,
    value,
    InputProps,
  });

  const styles = useStyles({ startlabelOffset, endlabelOffset });

  return (
    <MuiTextField
      {...rest}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      value={value}
      classes={{ root: styles.textField }}
      InputLabelProps={{
        shrink,
        classes: { shrink: styles.shrunkLabel },
        ...props.InputLabelProps,
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start" ref={startAdornmentRef}>
            {startIcon}
          </InputAdornment>
        ) : (
          startAdornment
        ),
        endAdornment: endIcon ? (
          <InputAdornment position="end" ref={endAdornmentRef}>
            {endIcon}
          </InputAdornment>
        ) : (
          endAdornment
        ),
        ...props.InputProps,
      }}
    />
  );
};

TextField.propTypes = {
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  InputProps: PropTypes.shape({ startAdornment: null }),
  InputLabelProps: PropTypes.shape({ startAdornment: null }),
  value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  endAdornment: PropTypes.node,
  startAdornment: PropTypes.node,
};

TextField.defaultProps = {
  startIcon: null,
  endIcon: null,
  InputProps: undefined,
  InputLabelProps: undefined,
  value: '',
  onFocus: undefined,
  onBlur: undefined,
  endAdornment: null,
  startAdornment: null,
};

export default TextField;
