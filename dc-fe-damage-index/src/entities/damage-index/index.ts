import { Well } from '@/entities/well';

export * from './helpers';

export type DamageIndex = {
  id: string;
  depth: number;
  time: number;
  timeUTC: number;
  value: number;
  rotaryRPM: number;
  mudFlowIn: number;
  weightOnBit: number;
  rop: number;
  normDepth: number;
  bha: string;
  maxMWDTemp: number;
};

export enum DI_STATUS {
  SAFE = 'SAFE',
  WARN = 'WARN',
  DANGER = 'DANGER',
}

export type WellDILists = [Well, DamageIndex[]][];
