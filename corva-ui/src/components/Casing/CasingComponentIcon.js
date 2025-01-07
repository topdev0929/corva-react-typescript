import PropTypes from 'prop-types';

import ACP from './assets/RegularCasing/acp.png';
import AirLockSub from './assets/RegularCasing/air_lock_sub.png';
import CasingJoints from './assets/RegularCasing/casing_joints.png';
import DP from './assets/RegularCasing/dp.png';
import DvTool from './assets/RegularCasing/dv_tool.png';
import FloatCollar from './assets/RegularCasing/float_collar.png';
import FloatShoe from './assets/RegularCasing/float_shoe.png';
import HWDP from './assets/RegularCasing/hwdp.png';
import LinerHanger from './assets/RegularCasing/liner_hanger.png';
import LinerTopPacker from './assets/RegularCasing/liner_top_packer.png';
import MarkerJoint from './assets/RegularCasing/marker_joint.png';
import PBR from './assets/RegularCasing/pbr.png';
import PupJoint from './assets/RegularCasing/pup_joint.png';
import Riser from './assets/RegularCasing/riser.png';
import ToeSleeve from './assets/RegularCasing/toe_sleeve.png';
import XO from './assets/RegularCasing/xo.png';
import Other from './assets/RegularCasing/other.png';

const COMPONENT_FAMILY_TO_ICON = {
  casing_joints: CasingJoints,
  marker_joint: MarkerJoint,
  marker_point: MarkerJoint,
  hwdp: HWDP,
  air_lock_sub: AirLockSub,
  float_collar: FloatCollar,
  toe_sleeve: ToeSleeve,
  cross_over: XO,
  dp: DP,
  pup: PupJoint,
  float_shoe: FloatShoe,
  liner_hanger: LinerHanger,
  liner_top_packer: LinerTopPacker,
  dv_tool: DvTool,
  acp: ACP,
  pbr: PBR,
  riser: Riser,
  other: Other
}

function ComponentIcon({ component, width, height }) {
  const { family } = component;

  return <img src={COMPONENT_FAMILY_TO_ICON[family]} alt={family} width={width} height={height} />;
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
