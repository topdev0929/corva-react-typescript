import { useState, useEffect, useRef, FC } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Popover,
  InputLabel,
  IconButton,
  PopoverActions,
  PopoverOrigin,
  TooltipProps,
  Tooltip,
} from '@material-ui/core';
import { ColorLens as ColorLensIcon } from '@material-ui/icons';
import chroma from 'chroma-js';
import classNames from 'classnames';
import validateColor from 'validate-color';

import PaletteChromePicker from './PaletteChromePicker';

import Checkboard from '~/assets/checkboard.svg';

const DEFAULT_COLOR = '#03BCD4';

const converters = {
  rgba: c => `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`,
  rgb: c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
  hex: c => c.hex,
  rgba_rgb: c => (c.rgb.a === 1 ? converters.rgb(c) : converters.rgba(c)),
  rgba_hex: c => (c.rgb.a === 1 ? converters.hex(c) : converters.rgba(c)),
};

interface ColorPickerProps extends PropTypes.InferProps<typeof colorPickerPropTypes> {
  popoverAnchorOrigin?: PopoverOrigin;
  popoverTransformOrigin?: PopoverOrigin;
}

const ColorPicker = ({
  label,
  value,
  converter,
  onChange,
  buttonClassName,
  popoverAnchorOrigin,
  popoverTransformOrigin,
  labelPosition,
  hideLabel,
  pickerComponent: PickerComponent,
  classes,
  lensColor,
  enableTransparencyPalette,
  'data-testid': PAGE_NAME,
  tooltipProps,
}: ColorPickerProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const popperInstanceRef = useRef<PopoverActions>();

  useEffect(() => {
    const newColor = value?.trim();
    if (newColor && validateColor(newColor)) setColor(newColor);
    else console.error(`The color value(${value}) is not valid, please check it.`);
  }, [value]);

  const handleOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = nextColor => {
    const convertedColor = converters[converter](nextColor);
    setColor(convertedColor);
    onChange(convertedColor);
  };

  const updatePopperPosition = () => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.updatePosition();
    }
  };

  return (
    <div
      className={classNames(classes.root, {
        [classes.topLabelRoot]: labelPosition === 'top',
        [classes.rightLabelRoot]: labelPosition === 'right',
      })}
    >
      {!hideLabel && (
        <InputLabel
          className={classNames({
            [classes.topLabel]: labelPosition === 'top',
            [classes.rightLabel]: labelPosition === 'right',
          })}
          shrink
        >
          {label}
        </InputLabel>
      )}
      <Tooltip title={tooltipProps.title} {...tooltipProps as TooltipProps}>
        <IconButton
          data-testid={`${PAGE_NAME}_icon_${label}`}
          className={classNames(classes.button, buttonClassName, {
            [classes.buttonTransparrent]: chroma(color).alpha() === 0,
          })}
          disableRipple
          style={{ backgroundColor: color, color: lensColor }}
          onClick={handleOpen}
        >
          <ColorLensIcon fontSize="small" className={classes.colorLensIcon} />
        </IconButton>
      </Tooltip>
      <Popover
        id="colors-popper"
        action={popperInstanceRef}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={popoverAnchorOrigin}
        transformOrigin={popoverTransformOrigin}
      >
        <PickerComponent
          color={color}
          onChange={handleChange}
          onSizeChange={updatePopperPosition}
          enableTransparencyPalette={enableTransparencyPalette}
        />
      </Popover>
    </div>
  );
};

const popoverOriginPropType = PropTypes.shape({
  vertical: PropTypes.oneOfType([PropTypes.oneOf(['top', 'center', 'bottom']), PropTypes.number]),
  horizontal: PropTypes.oneOfType([PropTypes.oneOf(['left', 'center', 'right']), PropTypes.number]),
});
const colorPickerPropTypes = {
  buttonClassName: PropTypes.string,

  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  converter: PropTypes.oneOf(Object.keys(converters)),

  classes: PropTypes.shape({
    button: PropTypes.string.isRequired,
    root: PropTypes.string,
    topLabelRoot: PropTypes.string,
    rightLabelRoot: PropTypes.string,
    topLabel: PropTypes.string,
    rightLabel: PropTypes.string,
    buttonTransparrent: PropTypes.string,
    colorLensIcon: PropTypes.string,
  }).isRequired,
  pickerComponent: PropTypes.elementType,

  labelPosition: PropTypes.oneOf(['top', 'right']),
  popoverAnchorOrigin: popoverOriginPropType,
  popoverTransformOrigin: popoverOriginPropType,

  tooltipProps: PropTypes.shape({ title: PropTypes.string }),

  hideLabel: PropTypes.bool,
  lensColor: PropTypes.string,

  enableTransparencyPalette: PropTypes.bool,
  'data-testid': PropTypes.string,
};

ColorPicker.propTypes = colorPickerPropTypes;

ColorPicker.defaultProps = {
  label: 'Color',
  buttonClassName: null,
  converter: 'rgba_hex',
  pickerComponent: PaletteChromePicker,
  hideLabel: false,
  popoverAnchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  popoverTransformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },

  tooltipProps: { title: 'Change color' },

  labelPosition: 'top',
  lensColor: '#fff',
  enableTransparencyPalette: false,
  'data-testid': 'ColorPicker',
};

export default withStyles({
  root: {
    position: 'relative',
    display: 'flex',
  },
  topLabelRoot: {
    flexDirection: 'column',
  },
  rightLabelRoot: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: '36px',
    height: '24px',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.161)',
    borderRadius: '5px',
  },
  buttonTransparrent: {
    position: 'relative',
    backgroundImage: `url(${Checkboard})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    '&::before': {
      content: '""',
      position: 'absolute',
      display: 'block',
      width: '100%',
      height: '3px',
      background: '#FF0000',
      transform: 'rotate(148deg)',
      borderRadius: '2px',
    },
  },
  colorLensIcon: {
    position: 'relative',
    zIndex: 2,
  },
  popper: {
    zIndex: 1500,
  },
  topLabel: {
    marginBottom: '8px',
    fontSize: '15px',
    lineHeight: '17px',
    letterSpacing: '0.4px',
    color: '#BDBDBD',
    whiteSpace: 'nowrap',
  },
  rightLabel: {
    marginLeft: '8px',
    fontSize: '16px',
  },
})(ColorPicker as FC);
