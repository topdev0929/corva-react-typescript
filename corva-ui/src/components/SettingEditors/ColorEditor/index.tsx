import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker, GithubPicker } from 'react-color';

import { Button, ClickAwayListener, withStyles } from '@material-ui/core';
import ColorLensIcon from '@material-ui/icons/ColorLens';

import styles from './style.css';

const muiStyles = {
  button: {
    marginBottom: 16,
  },
};

type ColorEditorProps = PropTypes.InferProps<typeof colorEditorPropTypes>;

export const ColorEditor = ({
  onChange,
  currentValue,
  defaultValue,
  classes,
  condensed,
  colors,
  lensColor,
}: ColorEditorProps): JSX.Element => {
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const [color, setColor] = useState(currentValue || defaultValue);

  const handlePickerOpen = () => setIsPickerOpened(true);

  const handleSave = () => onChange(color);

  const handlePickerClose = () => {
    setIsPickerOpened(false);
    handleSave();
  };

  const handleChange = color => {
    setColor(color.hex);
    handleSave();
  };

  const handleChangeAndClose = color => {
    setColor(color.hex);
    setIsPickerOpened(false);
    handleSave();
  };

  return (
    <div className={styles.colorEditor}>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePickerOpen}
        className={classes.button}
        style={{ backgroundColor: color, color: lensColor }}
      >
        <ColorLensIcon />
      </Button>
      {isPickerOpened && (
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={handlePickerClose}
        >
          <div className={styles.colorEditorPickerContainer}>
            {condensed ? (
              <GithubPicker
                color={color}
                onChange={handleChangeAndClose}
                colors={colors}
                triangle="hide"
              />
            ) : (
              <ChromePicker color={color} onChange={handleChange} />
            )}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

const colorEditorPropTypes = {
  currentValue: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  condensed: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.shape({
    button: PropTypes.string,
  }).isRequired,
  lensColor: PropTypes.string,
};

ColorEditor.propTypes = colorEditorPropTypes;

ColorEditor.defaultProps = {
  condensed: false,
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  defaultValue: '#FF0000',
  lensColor: '#fff',
};

export default withStyles(muiStyles)(ColorEditor);

export const colorEditorForDefinitions = (colors, defaultValue) => props => (
  <ColorEditor condensed colors={colors} defaultValue={defaultValue} {...props} />
);
