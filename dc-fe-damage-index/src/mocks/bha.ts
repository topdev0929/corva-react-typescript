import { BHA, BHAOption } from '@/entities/bha';

export const mockedBHAJson = [
  {
    _id: 'bha 1',
    timestamp: 102,
  },
  {
    _id: 'bha 2',
    timestamp: 101,
  },
  {
    _id: 'bha 3',
    timestamp: 103,
  },
];

export const mockedBHAs: BHA[] = [
  {
    id: 'bha 1',
    name: 'bha 1',
    timestamp: 102,
  },
  {
    id: 'bha 2',
    name: 'bha 2',
    timestamp: 101,
  },
  {
    id: 'bha 3',
    name: 'bha 3',
    timestamp: 103,
  },
];

export const mockedSortedBHAs: BHA[] = [
  {
    id: 'bha 2',
    name: 'bha 2',
    timestamp: 101,
  },
  {
    id: 'bha 1',
    name: 'bha 1',
    timestamp: 102,
  },
  {
    id: 'bha 3',
    name: 'bha 3',
    timestamp: 103,
  },
];

export const mockedBHAOptions: BHAOption[] = [
  {
    value: 'bha 1',
    label: 'bha 1',
  },
  {
    value: 'bha 2',
    label: 'bha 2',
  },
  {
    value: 'bha 3',
    label: 'bha 3',
  },
];
