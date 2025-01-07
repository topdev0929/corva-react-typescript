import { DamageIndex } from '@/entities/damage-index';

export const parseDIFromJSON = (json: any): DamageIndex => {
  return {
    id: json._id,
    timeUTC: json.timestamp * 1000,
    time: json.timestamp,
    value: json.data.DI,
    depth: json.data.hole_depth,
    rotaryRPM: json.data.total_rotary,
    mudFlowIn: json.data.total_circulating,
    weightOnBit: json.data.diff_press,
    rop: json.data.avg_rop_ft_hr,
    normDepth: json.data.bha_depth_drilled,
    bha: json.data.bha_id,
    maxMWDTemp: json.data.temperature_expanding_max_std,
  };
};

export const parseDIListFromJSON = (json: any[]): DamageIndex[] => {
  return json.map(item => parseDIFromJSON(item));
};
