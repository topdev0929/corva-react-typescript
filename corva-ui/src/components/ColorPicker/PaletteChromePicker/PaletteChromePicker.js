import { useState, useLayoutEffect, forwardRef } from 'react';
import { ChromePicker } from 'react-color';
import classNames from 'classnames';

import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';
import ColorizeIcon from '@material-ui/icons/Colorize';

import Palette from './Palette';

const PAGE_NAME = 'PaletteChromePicker';

const COLOR_PICK_MODE = {
  PALETTE: 'PALETTE',
  CHROME_PICKER: 'CHROME_PICKER',
};

const chromePickerStyles = {
  default: {
    picker: {
      width: '100%',
      boxShadow: 'none',
    },
    body: {
      backgroundColor: '#3b3b3b',
      padding: '16px 16px 0',
    },
    color: {
      width: '32px',
      height: '32px',
      marginRight: '16px',
      borderRadius: '2px',
    },
    swatch: {
      marginTop: 0,
      width: '100%',
      height: '100%',
      borderRadius: 0,
      position: 'relative',
      overflow: 'hidden',
    },
    toggles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    Alpha: {
      checkboard: {
        display: 'none',
      },
      gradient: {
        borderRadius: '5px',
      },
    },
  },
};

const useStyles = makeStyles({
  container: {
    backgroundColor: '#3b3b3b',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.4)',
    width: '250px',
    paddingBottom: '8px',
    borderRadius: '4px',

    '& input': {
      border: '1px solid #616161 !important',
      backgroundColor: '#3b3b3b',
      color: '#fff !important',
      boxShadow: 'none !important',
      outline: 'none',
    },

    '& svg:not(.MuiSvgIcon-root)': {
      fill: '#bdbdbd !important',
    },
  },
  chromePickerPalette: {
    margin: '0 8px',
    paddingTop: '8px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  },
  iconButton: {
    padding: '8px',
    '&:hover': {
      backgroundColor: '#333333',
    },
    '&:hover $icon': {
      color: '#fff',
    },
  },
  icon: { color: '#bdbdbd', fontSize: '24px' },
  iconActive: { color: '#fff' },
  tooltip: {
    background: '#414141',
    color: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    opacity: 1,
    fontSize: '11px',
  },
});

/**
 * @typedef PaletteChromePickerProps
 * @property {string} color
 * @property {(color: { hex: string; hsl: any; rgb: any; }) => void} onChange
 * @property {() => void} [onSizeChange]
 * @property {boolean} [enableTransparencyPalette]
 */

const PaletteChromePicker = forwardRef(
  /**
   * @param {PaletteChromePickerProps} props
   * @param ref
   */
  ({ color, onChange, onSizeChange, enableTransparencyPalette }, ref) => {
    const classes = useStyles();
    const [pickMode, setPickMode] = useState(COLOR_PICK_MODE.PALETTE);

    useLayoutEffect(onSizeChange, [pickMode]);

    return (
      <div className={classes.container} ref={ref}>
        {pickMode === COLOR_PICK_MODE.PALETTE && (
          <Palette
            className={classes.chromePickerPalette}
            color={color}
            onChange={onChange}
            enableTransparencyPalette={enableTransparencyPalette}
          />
        )}
        {pickMode === COLOR_PICK_MODE.CHROME_PICKER && (
          <ChromePicker styles={chromePickerStyles} color={color} onChange={onChange} />
        )}
        <div className={classes.buttonsContainer}>
          <Tooltip title="Palette" classes={{ tooltip: classes.tooltip }}>
            <IconButton
              data-testid={`${PAGE_NAME}_palette`}
              className={classes.iconButton}
              onClick={() => setPickMode(COLOR_PICK_MODE.PALETTE)}
            >
              <PaletteIcon
                className={classNames(classes.icon, {
                  [classes.iconActive]: pickMode === COLOR_PICK_MODE.PALETTE,
                })}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Pick your own" classes={{ tooltip: classes.tooltip }}>
            <IconButton
              data-testid={`${PAGE_NAME}_pickOwn`}
              className={classes.iconButton}
              onClick={() => setPickMode(COLOR_PICK_MODE.CHROME_PICKER)}
            >
              <ColorizeIcon
                className={classNames(classes.icon, {
                  [classes.iconActive]: pickMode === COLOR_PICK_MODE.CHROME_PICKER,
                })}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    );
  }
);

export default PaletteChromePicker;
