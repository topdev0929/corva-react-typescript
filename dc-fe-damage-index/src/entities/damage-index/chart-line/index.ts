import { DamageIndex } from '@/entities/damage-index';
import { BHA } from '@/entities/bha';

export * from './helpers';

export type DIListChartPoint = {
  x: number;
  y: number;
  marker: {
    enabled: boolean;
    symbol: string | undefined;
  };
  custom: {
    index: DamageIndex['value'];
    time: DamageIndex['time'];
    depth: DamageIndex['depth'];
    rop: DamageIndex['rotaryRPM'];
  };
};

export type DIListLine = {
  points: DIListChartPoint[];
  isActive: boolean;
  name: string;
  color: string;
  showInLegend: boolean;
};

export type PointGeneratorConfig = {
  isActiveWell: boolean;
  bhasToRemove: BHA[];
  xPath: keyof DamageIndex;
  yPath: keyof DamageIndex;
};

export const LINE_NAME_SEPARATOR = ' - ';
