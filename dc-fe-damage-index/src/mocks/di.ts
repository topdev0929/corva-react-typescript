import { DamageIndex } from '@/entities/damage-index';

export const mockedDiListJson = [
  {
    _id: 'id3',
    timestamp: 12415611,
    data: {
      hole_depth: 2874,
      DI: 0.5,
      total_rotary: 752,
      total_circulating: 231,
      diff_press: 36,
      avg_rop_ft_hr: 24,
      bha_depth_drilled: 7593,
      bha_id: 'bha 3',
      temperature_expanding_max_std: 0,
    },
  },
  {
    _id: 'id1',
    timestamp: 13589012,
    data: {
      hole_depth: 7593,
      DI: 1.8,
      total_rotary: 34,
      total_circulating: 65,
      diff_press: 21,
      avg_rop_ft_hr: 24,
      bha_depth_drilled: 7593,
      bha_id: 'bha 1',
      temperature_expanding_max_std: 0,
    },
  },
  {
    _id: 'id2',
    timestamp: 13589002,
    data: {
      hole_depth: 4665,
      DI: 1.6,
      total_rotary: 56,
      total_circulating: 75,
      diff_press: 12,
      avg_rop_ft_hr: 25,
      bha_depth_drilled: 7593,
      bha_id: 'bha 2',
      temperature_expanding_max_std: 0,
    },
  },
];

export const mockedDiList: DamageIndex[] = [
  {
    id: 'id3',
    depth: 2874,
    time: 12415611,
    timeUTC: 12415611000,
    value: 0.5,
    rotaryRPM: 752,
    mudFlowIn: 231,
    weightOnBit: 36,
    rop: 24,
    normDepth: 7593,
    bha: 'bha 3',
    maxMWDTemp: 0,
  },
  {
    id: 'id1',
    depth: 7593,
    time: 13589012,
    timeUTC: 13589012000,
    value: 1.8,
    rotaryRPM: 34,
    mudFlowIn: 65,
    weightOnBit: 21,
    rop: 24,
    normDepth: 7593,
    bha: 'bha 1',
    maxMWDTemp: 0,
  },
  {
    id: 'id2',
    depth: 4665,
    time: 13589002,
    timeUTC: 13589002000,
    value: 1.6,
    rotaryRPM: 56,
    mudFlowIn: 75,
    weightOnBit: 12,
    rop: 25,
    normDepth: 7593,
    bha: 'bha 2',
    maxMWDTemp: 0,
  },
];

export const mockedSortedDiList: DamageIndex[] = [
  mockedDiList[1],
  mockedDiList[2],
  mockedDiList[0],
];

export const mockedExtendedDiList: DamageIndex[] = [
  mockedSortedDiList[0],
  {
    id: 'id5',
    depth: 7593,
    time: 13589010,
    timeUTC: 12415611000,
    value: 1.79,
    rotaryRPM: 34,
    mudFlowIn: 65,
    weightOnBit: 21,
    rop: 16,
    normDepth: 7000,
    bha: 'bha 1',
    maxMWDTemp: 0,
  },
  mockedSortedDiList[1],
  mockedSortedDiList[2],
];
