export * from './helpers';

export type OptimizationParameters = {
  lowROPMudFlowIn: number;
  highROPMudFlowIn: number;
  lowROPWeightOnBit: number;
  highROPWeightOnBit: number;
  lowROPRotaryRPM: number;
  highROPRotaryRPM: number;
  lowDIMudFlowIn: number;
  highDIMudFlowIn: number;
  lowDIWeightOnBit: number;
  highDIWeightOnBit: number;
  lowDIRotaryRPM: number;
  highDIRotaryRPM: number;
  time: number;
};

export type FitInParametersType = 'DI' | 'ROP';

export type FitInParameters = {
  min: number;
  max: number;
  real: number;
  id: string;
  type: FitInParametersType;
};

export enum FIT_IN_STATUS {
  SAFE = 'SAFE',
  WARN = 'WARN',
  DANGER = 'DANGER',
}
