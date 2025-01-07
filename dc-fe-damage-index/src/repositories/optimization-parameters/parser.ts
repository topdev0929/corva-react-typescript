import { OptimizationParameters } from '@/entities/optimization-parameter';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseOptimizationParametersFromJSON = (json: any): OptimizationParameters => {
  return {
    time: json.timestamp,
    lowROPMudFlowIn: json.data.low_rec_ROP_mud_flow_in,
    highROPMudFlowIn: json.data.high_rec_ROP_mud_flow_in,
    lowROPWeightOnBit: json.data.low_rec_ROP_weight_on_bit,
    highROPWeightOnBit: json.data.high_rec_ROP_weight_on_bit,
    lowROPRotaryRPM: json.data.low_rec_ROP_rotary_rpm,
    highROPRotaryRPM: json.data.high_rec_ROP_rotary_rpm,
    lowDIMudFlowIn: json.data.low_rec_DI_mud_flow_in,
    highDIMudFlowIn: json.data.high_rec_DI_mud_flow_in,
    lowDIWeightOnBit: json.data.low_rec_DI_weight_on_bit,
    highDIWeightOnBit: json.data.high_rec_DI_weight_on_bit,
    lowDIRotaryRPM: json.data.low_rec_DI_rotary_rpm,
    highDIRotaryRPM: json.data.high_rec_DI_rotary_rpm,
  };
};
