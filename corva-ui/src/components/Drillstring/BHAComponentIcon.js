import PropTypes from 'prop-types';

import DrillPipe from './assets/regular-bha/drill_pipe.png';
import DrillCollar from './assets/regular-bha/drill_collar.png';
import DrillCollarWhite from './assets/regular-bha/drill_collar_white.png';
import HeavyWeightDrillPipe from './assets/regular-bha/heavy_weight_drill_pipe.png';
import Jar from './assets/regular-bha/jar.png';
import Motor from './assets/regular-bha/motor.png';
import Mwd from './assets/regular-bha/mwd.png';
import Rss from './assets/regular-bha/rss.png';
import Sub from './assets/regular-bha/sub.png';
import SubWhite from './assets/regular-bha/sub_white.png';
import Agitator from './assets/regular-bha/agitator.png';
import Stabilizer from './assets/regular-bha/stabilizer.png';
import BitPdc from './assets/regular-bha/pdcbit.png';
import BitCone from './assets/regular-bha/rollerconebit.png';
import UnderReamer from './assets/regular-bha/ur.png';
import Lwd from './assets/regular-bha/lwd.png';

function ComponentIcon({ component, width, height }) {
  const { family, material, bit_type: bitType } = component;

  let icon;

  if (family === 'dp') {
    icon = DrillPipe;
  } else if (family === 'dc') {
    icon = material !== 'Steel' ? DrillCollarWhite : DrillCollar;
  } else if (family === 'hwdp') {
    icon = HeavyWeightDrillPipe;
  } else if (family === 'pdm') {
    icon = Motor;
  } else if (family === 'mwd') {
    icon = Mwd;
  } else if (family === 'jar') {
    icon = Jar;
  } else if (family === 'rss') {
    icon = Rss;
  } else if (family === 'sub') {
    icon = material !== 'Steel' ? SubWhite : Sub;
  } else if (family === 'agitator') {
    icon = Agitator;
  } else if (family === 'stabilizer') {
    icon = Stabilizer;
  } else if (family === 'bit') {
    icon = bitType === 'Tri Cone' ? BitCone : BitPdc;
  } else if (family === 'ur') {
    icon = UnderReamer;
  } else if (family === 'lwd') {
    icon = Lwd;
  } else {
    icon = null;
  }

  return <img src={icon} alt={family} width={width} height={height} />;
}

ComponentIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  component: PropTypes.shape({
    family: PropTypes.string,
    material: PropTypes.string,
    bit_type: PropTypes.string,
  }).isRequired,
};

ComponentIcon.defaultProps = {
  width: 32,
  height: 48,
};

export default ComponentIcon;
