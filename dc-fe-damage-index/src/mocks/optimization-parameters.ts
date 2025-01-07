import { FitInParameters, OptimizationParameters } from '@/entities/optimization-parameter';

export const mockedOPListJson = [
  {
    data: {
      low_rec_ROP_mud_flow_in: 100,
      high_rec_ROP_mud_flow_in: 200,
      low_rec_ROP_weight_on_bit: 300,
      high_rec_ROP_weight_on_bit: 400,
      low_rec_ROP_rotary_rpm: 500,
      high_rec_ROP_rotary_rpm: 600,
      low_rec_DI_mud_flow_in: 700,
      high_rec_DI_mud_flow_in: 800,
      low_rec_DI_weight_on_bit: 900,
      high_rec_DI_weight_on_bit: 1000,
      low_rec_DI_rotary_rpm: 1100,
      high_rec_DI_rotary_rpm: 1200,
    },
    timestamp: 100,
  },
  {
    data: {
      low_rec_ROP_mud_flow_in: 1001,
      high_rec_ROP_mud_flow_in: 201,
      low_rec_ROP_weight_on_bit: 301,
      high_rec_ROP_weight_on_bit: 401,
      low_rec_ROP_rotary_rpm: 501,
      high_rec_ROP_rotary_rpm: 601,
      low_rec_DI_mud_flow_in: 701,
      high_rec_DI_mud_flow_in: 801,
      low_rec_DI_weight_on_bit: 901,
      high_rec_DI_weight_on_bit: 1001,
      low_rec_DI_rotary_rpm: 1101,
      high_rec_DI_rotary_rpm: 1201,
    },
    timestamp: 300,
  },
];

export const mockedOptimizationParametersList: OptimizationParameters[] = [
  {
    lowROPMudFlowIn: 100,
    highROPMudFlowIn: 200,
    lowROPWeightOnBit: 300,
    highROPWeightOnBit: 400,
    lowROPRotaryRPM: 500,
    highROPRotaryRPM: 600,
    lowDIMudFlowIn: 700,
    highDIMudFlowIn: 800,
    lowDIWeightOnBit: 900,
    highDIWeightOnBit: 1000,
    lowDIRotaryRPM: 1100,
    highDIRotaryRPM: 1200,
    time: 100,
  },
  {
    lowROPMudFlowIn: 1001,
    highROPMudFlowIn: 201,
    lowROPWeightOnBit: 301,
    highROPWeightOnBit: 401,
    lowROPRotaryRPM: 501,
    highROPRotaryRPM: 601,
    lowDIMudFlowIn: 701,
    highDIMudFlowIn: 801,
    lowDIWeightOnBit: 901,
    highDIWeightOnBit: 1001,
    lowDIRotaryRPM: 1101,
    highDIRotaryRPM: 1201,
    time: 300,
  },
];

export const mockedSortedOptimizationParametersList: OptimizationParameters[] = [
  mockedOptimizationParametersList[1],
  mockedOptimizationParametersList[0],
];

export const mockedFitInParameters: FitInParameters = {
  min: 100,
  max: 200,
  real: 150,
  id: 'id',
  type: 'DI',
};
