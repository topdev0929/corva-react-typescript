import { AssetId } from '@/entities/asset';

export * from './helpers';

export type Well = {
  assetId: AssetId;
  name: string;
};

export type WellOption = {
  value: number;
  label: string;
  suffix?: string;
};
