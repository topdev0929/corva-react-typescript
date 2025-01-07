import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import BitIcon from './assets/small-bha/bit.svg';
import PdmIcon from './assets/small-bha/pdm.svg';
import RssIcon from './assets/small-bha/rss.svg';
import StabilizerIcon from './assets/small-bha/stabilizer.svg';
import NonMagIcon from './assets/small-bha/non-mag.svg';

const TileTooltip = {
  bit: 'Bit',
  other: 'Non Magnetic',
  pdm: 'PDM',
  rss: 'Rotary Steerables',
  stabilizer: 'Stabilizer',
};

function BHATileIcon({ component, width, height }) {
  const { family, material } = component;

  let icon;
  if (family === 'bit') {
    icon = BitIcon;
  } else if (family === 'pdm') {
    icon = PdmIcon;
  } else if (family === 'rss') {
    icon = RssIcon;
  } else if (family === 'stabilizer') {
    icon = StabilizerIcon;
  } else if (family === 'other' || material === 'Non Magnetic') {
    icon = NonMagIcon;
  } else {
    icon = NonMagIcon;
  }

  return (
    <Tooltip title={TileTooltip[family] || TileTooltip.other} placement="bottom">
      <img src={icon} style={{ width, height }} alt={family} />
    </Tooltip>
  );
}

BHATileIcon.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  component: PropTypes.shape({
    family: PropTypes.string,
    material: PropTypes.string,
    bit_type: PropTypes.string,
  }).isRequired,
};

export default BHATileIcon;
