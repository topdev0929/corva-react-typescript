import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Popover, Typography, IconButton } from '@material-ui/core';
import { ColorLens as ColorLensIcon } from '@material-ui/icons';
import classNames from 'classnames';

import PaletteChromePicker from './PaletteChromePicker';

const muiStyles = {
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
  popper: {
    zIndex: 1500,
  },
  topLabel: {
    marginBottom: '8px',
    fontSize: '12px',
    color: '#BDBDBD',
  },
  rightLabel: {
    marginLeft: '8px',
    fontSize: '16px',
  },
};

const converters = {
  rgba: c => `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`,
  rgb: c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
  hex: c => c.hex,
  rgba_rgb: c => (c.rgb.a === 1 ? converters.rgb(c) : converters.rgba(c)),
  rgba_hex: c => (c.rgb.a === 1 ? converters.hex(c) : converters.rgba(c)),
};

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
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState(value);
  const popperInstanceRef = useRef();

  useEffect(() => {
    setColor(value);
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
      popperInstanceRef.current.update();
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
        <Typography
          className={classNames({
            [classes.topLabel]: labelPosition === 'top',
            [classes.rightLabel]: labelPosition === 'right',
          })}
          shrink
        >
          {label}
        </Typography>
      )}
      <IconButton
        className={classNames(classes.button, buttonClassName)}
        disableRipple
        style={{ backgroundColor: color, color: lensColor }}
        onClick={handleOpen}
      >
        <ColorLensIcon fontSize="small" />
      </IconButton>

      <Popover
        id="colors-popper"
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
        />
      </Popover>
    </div>
  );
};

ColorPicker.propTypes = {
  buttonClassName: PropTypes.string,

  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  converter: PropTypes.oneOf(Object.keys(converters)),

  classes: PropTypes.shape({
    button: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
    topLabelRoot: PropTypes.string.isRequired,
    rightLabelRoot: PropTypes.string.isRequired,
    rightLabel: PropTypes.string.isRequired,
    topLabel: PropTypes.string.isRequired,
  }).isRequired,
  pickerComponent: PropTypes.node,

  labelPosition: PropTypes.oneOf(['top', 'right']),
  popoverAnchorOrigin: PropTypes.shape({}),
  popoverTransformOrigin: PropTypes.shape({}),

  hideLabel: PropTypes.bool,
  lensColor: PropTypes.string,
};

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
  labelPosition: 'top',
  lensColor: '#fff',
};

export default withStyles(muiStyles)(ColorPicker);
