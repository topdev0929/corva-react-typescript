import { Well, WellOption } from '@/entities/well';

export const mockedWellsJson = [
  {
    asset_id: 1,
    _id: 'well 1',
  },
  {
    asset_id: 2,
    _id: 'well 2',
  },
  {
    asset_id: 3,
    _id: 'well 3',
  },
];

export const mockedWells: Well[] = [
  {
    assetId: 1,
    name: 'well 1',
  },
  {
    assetId: 2,
    name: 'well 2',
  },
  {
    assetId: 3,
    name: 'well 3',
  },
];

export const mockedWellOptions: WellOption[] = [
  {
    value: 1,
    label: 'well 1',
  },
  {
    value: 2,
    label: 'well 2',
  },
  {
    value: 3,
    label: 'well 3',
  },
];
