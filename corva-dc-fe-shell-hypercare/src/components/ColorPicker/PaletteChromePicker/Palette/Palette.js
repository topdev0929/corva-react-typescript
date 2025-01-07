import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CustomPicker } from 'react-color';
import classNames from 'classnames';

import ColorSquare from '../ColorSquare';

import { colors } from './PaletteConstants';

import styles from './Palette.css';

const Palette = ({ onChange, color, className }) => (
  <div className={classNames(styles.paletteContainer, className)}>
    {colors.map(predefinedColor => (
      <ColorSquare
        key={predefinedColor}
        color={predefinedColor}
        isSelected={color === predefinedColor}
        onClick={() => {
          onChange(predefinedColor);
        }}
      />
    ))}
  </div>
);

Palette.propTypes = {
  onChange: PropTypes.func.isRequired,
  color: PropTypes.shape({
    hex: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

Palette.defaultProps = {
  className: null,
};

export default CustomPicker(Palette);
