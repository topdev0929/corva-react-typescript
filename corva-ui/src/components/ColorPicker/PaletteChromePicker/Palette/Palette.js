import PropTypes from 'prop-types';
import { CustomPicker } from 'react-color';
import classNames from 'classnames';
import chroma from 'chroma-js';

import ColorSquare from '../ColorSquare';
import { paletteColors, paletteColorsWithTransparent } from './PaletteConstants';

import styles from './Palette.css';

const isSelected = (currentColor, predefinedColor) => {
  const currentColorAlpha = chroma(currentColor).alpha();
  const predefinedColorAlpha = chroma(predefinedColor).alpha();

  if (!currentColorAlpha) return currentColorAlpha === predefinedColorAlpha;
  return currentColor === predefinedColor;
};

const Palette = ({ onChange, color, className, enableTransparencyPalette }) => {
  const colors = enableTransparencyPalette ? paletteColorsWithTransparent : paletteColors;

  return (
    <div className={classNames(styles.paletteContainer, className)}>
      {colors.map(predefinedColor => (
        <ColorSquare
          key={predefinedColor}
          color={predefinedColor}
          isSelected={isSelected(color, predefinedColor)}
          onClick={() => {
            onChange(predefinedColor);
          }}
        />
      ))}
    </div>
  );
};

Palette.propTypes = {
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
  enableTransparencyPalette: PropTypes.bool.isRequired,
};

Palette.defaultProps = {
  className: null,
};

export default CustomPicker(Palette);
