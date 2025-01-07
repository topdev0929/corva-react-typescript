import { useRef, FC, ElementType } from 'react';
import { withStyles, Popover, PopoverActions, PopoverOrigin } from '@material-ui/core';

import PaletteChromePicker from '../ColorPicker/PaletteChromePicker/PaletteChromePicker';

const converters = {
  rgba: c => `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`,
  rgb: c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
  hex: c => c.hex,
  rgba_rgb: c => (c.rgb.a === 1 ? converters.rgb(c) : converters.rgba(c)),
  rgba_hex: c => (c.rgb.a === 1 ? converters.hex(c) : converters.rgba(c)),
};

interface ColorPickerPaletteProps {
  color: string;
  onChange: (convertedColor: string) => void;
  handleClose: () => void;
  anchorEl?: null | Element | ((element: Element) => Element);
  converter?: string;
  popoverAnchorOrigin?: PopoverOrigin;
  popoverTransformOrigin?: PopoverOrigin;
  pickerComponent?: ElementType;
  classes?: { root: string; }
  enableTransparencyPalette?: boolean;
}

const ColorPickerPalette = ({
  color,
  onChange,
  anchorEl,
  handleClose,
  converter,
  popoverAnchorOrigin,
  popoverTransformOrigin,
  pickerComponent: PickerComponent,
  classes,
  enableTransparencyPalette,
}: ColorPickerPaletteProps): JSX.Element => {
  const popperInstanceRef = useRef<PopoverActions>();

  const handleChange = nextColor => {
    const convertedColor = converters[converter](nextColor);
    onChange(convertedColor);
  };

  const updatePopperPosition = () => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.updatePosition();
    }
  };

  return (
    <div className={classes.root}>
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

ColorPickerPalette.defaultProps = {
  converter: 'rgba_hex',
  pickerComponent: PaletteChromePicker,
  popoverAnchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  popoverTransformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  enableTransparencyPalette: false,
  anchorEl: null,
};

export default withStyles({
  root: {
    position: 'relative',
    display: 'flex',
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
})(ColorPickerPalette as FC);
