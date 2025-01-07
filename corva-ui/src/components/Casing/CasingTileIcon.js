import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

import AirLockSub from './assets/SmallCasing/air_lock_sub.svg';
import CasingJoint from './assets/SmallCasing/casing_joint.svg';
import DP from './assets/SmallCasing/dp.svg';
import DvTool from './assets/SmallCasing/dv_tool.svg';
import FloatCollar from './assets/SmallCasing/float_collar.svg';
import FloatShoe from './assets/SmallCasing/float_shoe.svg';
import HWDP from './assets/SmallCasing/hwdp.svg';
import LinerTopPacker from './assets/SmallCasing/liner_top_packer.svg';

function CasingTileIcon({ component, width }) {
  const { family } = component;
  let icon;
  let TileTooltip;
  switch (family) {
    case 'air_lock_sub':
      icon = AirLockSub;
      TileTooltip='Air Lock Sub';
      break;
    case 'dp':
      icon = DP;
      TileTooltip='DP';
      break;
    case 'dv_tool':
      icon = DvTool;
      TileTooltip='DV Tool';
      break;
    case 'float_collar':
      icon = FloatCollar;
      TileTooltip='Float Collar';
      break;
    case 'float_shoe':
      icon = FloatShoe;
      TileTooltip='Float Shoe';
      break;
    case 'hwdp':
      icon = HWDP;
      TileTooltip='HWDP';
      break;
    case 'liner_top_packer':
      icon = LinerTopPacker;
      TileTooltip='Liner Top Packer';
      break;
    default:
      icon = CasingJoint;
      TileTooltip='Casing Joint';
  }
  return (
    <Tooltip title={TileTooltip} placement="bottom">
      <img src={icon} style={{ width, height: '16px' }} alt={family} />
    </Tooltip>
  );
}

CasingTileIcon.propTypes = {
  width: PropTypes.string.isRequired,
  component: PropTypes.shape({
    family: PropTypes.string,
  }).isRequired,
};

export default CasingTileIcon;
